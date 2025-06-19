import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function openDb() {
  const db = await open({
    filename: path.join(__dirname, '../db/oasislive.sqlite'),
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS houses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      price INTEGER,
      description TEXT,
      address TEXT,
      bedrooms INTEGER,
      bathrooms INTEGER,
      total_area INTEGER,
      living_area INTEGER,
      garage BOOLEAN,
      terrace BOOLEAN,
      active BOOLEAN,
      rentable BOOLEAN,
      year_built INTEGER
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      houseId INTEGER,
      url TEXT,
      alt TEXT,
      order_index INTEGER,
      FOREIGN KEY (houseId) REFERENCES houses(id)
    );
  `);

  return db;
}