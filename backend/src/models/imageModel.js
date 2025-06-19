import { openDb } from "./db.js";

export async function addImage(houseId, url) {
  const db = await openDb();
  return db.run('INSERT INTO images (houseId, url) VALUES (?, ?)', [houseId, url]);
}

export async function getImagesByHouseId(houseId) {
  const db = await openDb();
  return db.all('SELECT * FROM images WHERE houseId = ?', [houseId]);
}