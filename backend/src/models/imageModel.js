import { openDb } from './db.js';

export async function getImagesByHouseId(houseId) {
  const db = await openDb();
  return db.all('SELECT * FROM images WHERE house_id = ?', [houseId]);
}