import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import redisClient from './config/redisClient.js';
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import dotenv from 'dotenv';
dotenv.config();

import Connection from './config/db.js';
import Chapters from './src/routes/chapters.route.js';

const app = express();
const PORT = process.env.PORT || 5133;

async function startServer() {
    await Connection();
    await redisClient.connect();

    // req limiter
    const limiter = rateLimit({
        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
        }),
        windowMs: 1 * 60 * 1000,
        max: 30,
        message: {
            error: "Too many requests, try again after a moment"
        },
        standardHeaders: true,
        legacyHeaders: false,
    });

    // middlewares
    app.use(limiter);
    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use('/api/v1/chapters', Chapters);

    app.listen(PORT, async () => {
        console.log(`listening on PORT: ${PORT}`);
    });
}

startServer().catch(error => {
    console.log("Server Error: ", error);
})