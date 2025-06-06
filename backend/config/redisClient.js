import { createClient } from "redis";
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
    username: process.env.user,
    password: process.env.Password,
    socket: {
        host: process.env.Host,
        port: process.env.RPort,
    }
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient; 