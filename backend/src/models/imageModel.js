import { openDb } from "./db.js";

export async function addImage(houseId, url) {
  const db = await openDb();
  return db.run('INSERT INTO images (house_id, url) VALUES (?, ?)', [houseId, url]);
}

export async function getImagesByHouseId(houseId) {
  const db = await openDb();
  return db.all('SELECT * FROM images WHERE house_id = ?', [houseId]);
}