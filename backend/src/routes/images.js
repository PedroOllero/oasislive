import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/imagesController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/:houseId', upload.single('image'), uploadImage);

export default router;