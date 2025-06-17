import express from 'express';
import multer from 'multer';
import { uploadImage, getImage } from '../controllers/imagesController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/:house_Id', upload.single('image'), uploadImage);
router.get('/:house_Id', getImage);

export default router;