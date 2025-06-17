import express from 'express';
import { listImages } from '../controllers/imagesController.js';

const router = express.Router();

router.get('/:houseId', listImages);

export default router;