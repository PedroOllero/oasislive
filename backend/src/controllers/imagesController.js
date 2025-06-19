import cloudinary from '../utils/cloudinary.js';
import { addImage, getImagesByHouseId } from '../models/imageModel.js';
import { updateHouseImage } from '../models/houseModel.js';

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
        if (error) {
          console.error('Error al subir la imagen a Cloudinary:', error);
          return res.status(500).json({ error: 'Error uploading image to Cloudinary' });
        }

        const updated = await updateHouseImage(houseId, result.secure_url);
        if (!updated) {
          console.error(`No se pudo actualizar la casa con ID ${houseId}`);
          return res.status(404).json({ error: 'House not found or could not update image' });
        }

        res.status(200).json({ message: 'Image uploaded and saved to house', url: result.secure_url });
      }
    );

    stream.end(file.buffer); // Enviar el archivo al stream de Cloudinary
  } catch (error) {
    console.error('Error en el servidor:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function getImage(req, res) {
  try {
    const images = await getImagesByHouseId(req.params.id);
    if (!images || images.length === 0) {
      return res.status(404).json({ error: "No images found for this house" });
    }
    res.status(200).json(images);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}