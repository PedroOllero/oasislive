import express from "express";
import { listHouses, getHouse, createHouse, updateHouse, deleteHouse } from "../controllers/housesController.js";

const router = express.Router();

router.get("/", listHouses);
router.get("/:id", getHouse);
router.post("/", createHouse);
router.put("/:id", updateHouse);
router.delete("/:id", deleteHouse);

export default router;
