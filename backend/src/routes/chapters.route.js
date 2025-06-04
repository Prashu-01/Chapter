import { Router } from "express";
import multer from "multer";

import { getAllChapters, getChapterDetails, uploadChapters } from "../controllers/chapters.controller.js";
import { adminCheck } from '../middlewares/customAdminCheck.js'

const router = Router();
const upload = multer({ dest: 'uploads/' })

router.post('/', adminCheck, upload.single('file'), uploadChapters);
router.get('/', getAllChapters);
router.get('/:id', getChapterDetails);

export default router;