import { createClient } from "redis";

const redisClient = createClient({
    username: process.env.Username,
    password: process.env.Password,
    socket: {
        host: process.env.Host,
        port: process.env.Port,
    }
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export default redisClient; 