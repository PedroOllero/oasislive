import { openDb } from "./db.js";

export async function getAllHouses() {
  const db = await openDb();
  const houses = await db.all("SELECT * FROM houses");

  for (const house of houses) {
    const images = await db.all("SELECT * FROM images WHERE houseId = ?", [house.id]);
    house.houseImage = images;
  }

  return houses;
}

export async function getHouseById(id) {
  const db = await openDb();
  const house = await db.get("SELECT * FROM houses WHERE id = ?", [id]);

  if (house) {
    const images = await db.all("SELECT * FROM images WHERE houseId = ?", [id]);
    house.houseImage = images;
  }

  return house;
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
    houseImage
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
      houseImage
    ]
  );

  return result.lastID;
}

export async function insertHouseImages(houseId, images) {
  const db = await openDb();
  for (const img of images) {
    await db.run(
      `
      INSERT INTO images (houseId, url, alt, order_index)
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
    houseImage
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
      houseImage,
      id,
    ]
  );

  return result.changes > 0;
}

export async function updateHouseImage(houseId, imageUrl) {
  const db = await openDb();
  const result = await db.run(
    `
    UPDATE houses
    SET img = ?
    WHERE id = ?
    `,
    [imageUrl, houseId]
  );

  return result.changes > 0;
}

export async function deleteHouseById(id) {
  const db = await openDb();

  await db.run("DELETE FROM images WHERE houseId = ?", [id]);

  const result = await db.run("DELETE FROM houses WHERE id = ?", [id]);

  return result.changes > 0;
}