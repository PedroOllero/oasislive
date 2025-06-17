import cloudinary from '../utils/cloudinary.js';
import { addImage, getImagesByHouseId } from '../models/imageModel.js';

export async function uploadImage(req, res) {
  try {
    const houseId = req.params.houseId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'houses' },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        await addImage(houseId, result.secure_url);

        res.status(200).json({ message: 'Image uploaded', url: result.secure_url });
      }
    );

    stream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getImage(req, res) {
  const image = await getImagesByHouseId(req.params.id);
  if (!image) return res.status(404).json({ error: "House not found" });
  res.json(image);
}