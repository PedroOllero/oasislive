import cloudinary from 'cloudinary';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const seedImages = async () => {
  const db = await open({
    filename: path.join(__dirname, '../src/db/oasislive.sqlite'),
    driver: sqlite3.Database,
  });

  const houses = await db.all('SELECT id FROM houses');

  for (const house of houses) {
    for (let i = 1; i <= 2; i++) {
      const imagePath = path.join(__dirname, `../src/assets/house${house.id}_${i}.jpg`);

      try {
        const result = await cloudinary.v2.uploader.upload(imagePath, {
          folder: 'houses',
        });

        await db.run(
          'INSERT INTO images (url, house_Id) VALUES (?, ?)',
          result.secure_url,
          house.id
        );

        console.log(`✔️ Uploaded image for house ${house.id}: ${result.secure_url}`);
      } catch (err) {
        console.error(`❌ Failed to upload image for house ${house.id}:`, err.message);
      }
    }
  }

  await db.close();
};

seedImages();