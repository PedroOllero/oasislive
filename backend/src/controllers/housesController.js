import {
  getAllHouses,
  getHouseById,
  insertHouse,
  updateHouseById,
  insertHouseImages,
  deleteHouseById,
} from "../models/houseModel.js";

export async function listHouses(req, res) {
  const houses = await getAllHouses();
  res.json(houses);
}

export async function getHouse(req, res) {
  const house = await getHouseById(req.params.id);
  if (!house) return res.status(404).json({ error: "House not found" });
  res.json(house);
}

export async function createHouse(req, res) {
  try {
    const houseId = await insertHouse(req.body);
    if (req.body.images && req.body.images.length > 0) {
      await insertHouseImages(houseId, req.body.images);
    }
    res
      .status(201)
      .json({ id: houseId, message: "House created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create house" });
  }
}

export async function updateHouse(req, res) {
  try {
    const updated = await updateHouseById(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "House not found" });
    }
    res.json({ message: "House updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update house" });
  }
}

export async function deleteHouse(req, res) {
  try {
    const deleted = await deleteHouseById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "House not deleted" });
    }
    res.json({ message: "House deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete house" });
  }
}
