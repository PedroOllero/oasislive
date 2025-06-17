import { openDb } from "./db.js";

export async function getAllHouses() {
  const db = await openDb();
  return db.all("SELECT * FROM houses");
}

export async function getHouseById(id) {
  const db = await openDb();
  return db.get("SELECT * FROM houses WHERE id = ?", [id]);
}

export async function insertHouse(data) {
  const db = await openDb();
  const {
    title,
    price,
    description,
    address,
    bedrooms,
    bathrooms,
    total_area,
    living_area,
    garage,
    terrace,
    active,
    rentable,
    year_built,
  } = data;

  const result = await db.run(
    `
    INSERT INTO houses (
      title, price, description, address, bedrooms, bathrooms,
      total_area, living_area, garage, terrace, active, rentable, year_built
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      title,
      price,
      description,
      address,
      bedrooms,
      bathrooms,
      total_area,
      living_area,
      garage ? 1 : 0,
      terrace ? 1 : 0,
      active ? 1 : 0,
      rentable ? 1 : 0,
      year_built,
    ]
  );

  return result.lastID;
}

export async function insertHouseImages(houseId, images) {
  const db = await openDb();
  for (const img of images) {
    await db.run(
      `
      INSERT INTO images (house_id, url, alt, order_index)
      VALUES (?, ?, ?, ?)
    `,
      [houseId, img.url, img.alt, img.order_index || 0]
    );
  }
}

export async function updateHouseById(id, data) {
  const db = await openDb();
  const {
    title,
    price,
    description,
    address,
    bedrooms,
    bathrooms,
    total_area,
    living_area,
    garage,
    terrace,
    active,
    rentable,
    year_built,
  } = data;

  const result = await db.run(
    `
    UPDATE houses SET
      title = ?, price = ?, description = ?, address = ?, bedrooms = ?,
      bathrooms = ?, total_area = ?, living_area = ?, garage = ?, terrace = ?,
      active = ?, rentable = ?, year_built = ?
    WHERE id = ?
  `,
    [
      title,
      price,
      description,
      address,
      bedrooms,
      bathrooms,
      total_area,
      living_area,
      garage ? 1 : 0,
      terrace ? 1 : 0,
      active ? 1 : 0,
      rentable ? 1 : 0,
      year_built,
      id,
    ]
  );

  return result.changes > 0;
}
