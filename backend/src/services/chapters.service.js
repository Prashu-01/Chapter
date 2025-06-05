import Chapter from "../models/chapter.js";

export async function getChaptersService(query,skip,limit) {
    try {
        const chapters = await Chapter.find(query)
            .skip(skip)
            .limit(limit)
            .lean();
        return { success: true, data: chapters };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}

export async function getChapterDetailService(id) {
    try {
        const chapters = await Chapter.findById(id).lean();
        return { success: true, data: chapters };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}