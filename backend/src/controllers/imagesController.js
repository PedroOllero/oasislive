import cloudinary from '../utils/cloudinary.js';
import { addImage, getImagesByHouseId } from '../models/imageModel.js';
import { updateHouseImage } from '../models/houseModel.js';

export async function uploadImage(req, res) {
  try {
    const houseId = req.houseId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const stream = cloudinary.uploader.upload_stream(
      { folder: 'houses' },
      async (error, result) => {
        if (error) return res.status(500).json({ error });

        // Actualizar la columna `img` en la tabla `houses`
        await updateHouseImage(houseId, result.secure_url);

        res.status(200).json({ message: 'Image uploaded and saved to house', url: result.secure_url });
      }
    );

    stream.end(file.buffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getImage(req, res) {
  try {
    const images = await getImagesByHouseId(req.params.id); // Asegúrate de que `id` sea el parámetro correcto
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found for this house" });
    }
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}