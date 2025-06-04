import Chapter from "../models/chapter.js";

export async function getChaptersService(query) {
    try {
        const chapters = await Chapter.find(query);
        return { success: true, data: chapters };
    } catch (error) {
        console.log("Error: ", error.message);
        throw new Error("Failed to fetch");
    }
}