import { getImagesByHouseId } from '../models/imageModel.js';

export async function listImages(req, res) {
  const images = await getImagesByHouseId(req.params.houseId);
  res.json(images);
}