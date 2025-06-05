import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import redisClient from './config/redisClient.js';
import dotenv from 'dotenv';
dotenv.config();

import Connection from './config/db.js';
import Chapters from './src/routes/chapters.route.js';

const app = express();
const PORT = process.env.PORT || 5133;

// middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1/chapters', Chapters);

app.listen(PORT, async() => {
    console.log("listening..")
    await Connection();
    await redisClient.connect();
});