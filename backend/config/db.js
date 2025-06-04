import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.DB_URL;

const Connection = async () => {
    try {
        await mongoose.connect(url);
        console.log('connected successfully');
        return true;
    } catch (error) {
        console.log('failed to connect reason:', error);
        return false;
    }
}
export default Connection;