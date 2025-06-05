import fs from "fs/promises";
import redisClient from "../../config/redisClient.js";

import Chapter from "../models/chapter.js";
import { getChapterDetailService, getChaptersService } from "../services/chapters.service.js";

export async function getAllChapters(req, res) {
    try {
        const query = {};
        // filters
        if (req.query.subject) query.subject = req.query.subject;
        if (req.query.class) query.class = req.query.class;
        if (req.query.unit) query.unit = req.query.unit;
        if (req.query.status) query.status = req.query.status;
        if (req.query.weakChapters) query.isWeakChapters = req.query.weakChapters;

        // pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // redis logic
        const cacheKey = `chapters:${JSON.stringify({ ...query, page })}`;
        // console.log("key ",cacheKey);

        const cachedData = await redisClient.get(cacheKey);
        // console.log("cached data", cachedData);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }

        const chapters = await getChaptersService(query, skip, limit);
        // add to cache
        await redisClient.set(cacheKey, JSON.stringify(chapters.data), { EX: 3600 });

        res.status(200).json(chapters);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error!" });
    }
}

export async function getChapterDetails(req, res) {
    if (!req.params.id) return res.status(404).json({ msg: "No Id Found!" });

    try {
        const chapter = await getChapterDetailService(req.params.id);
        // console.log(chapter);
        res.status(200).json(chapter);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error!" });
    }
}

export async function uploadChapters(req, res) {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    try {
        const fileContent = await fs.readFile(req.file.path, "utf-8");

        let chapters;
        try {
            chapters = JSON.parse(fileContent);
        } catch (parseError) {
            return res.status(400).json({ error: "Invalid JSON format" });
        }

        // if (!Array.isArray(chapters)) {
        //     return res.status(400).json({ error: "Uploaded data must be an array of chapters." });
        // }

        const failedChapters = [];

        for (const chapter of chapters) {
            try {
                const newChapter = new Chapter(chapter);
                await newChapter.validate();
                await newChapter.save();
            } catch (err) {
                failedChapters.push({
                    chapter: chapter,
                    error: err.message
                });
            }
        }

        if (failedChapters.length > 0) {
            return res.status(200).json({
                message: "Chapters uploaded with some validation.",
                failedChapters
            });
        }

        // invalidate cache
        await redisClient.flushAll();

        res.status(201).json({ msg: "All Uplaoded!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error!" });
    }
}