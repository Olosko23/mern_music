import express from "express";
import {
  getArtist,
  getArtists,
  getTopArtists,
  addBulkArtists,
  addSingleArtist,
} from "../controllers/artistController.js";

const router = express.Router();

router.get("/all", getArtists);
router.get("/top", getTopArtists);
router.get("/:id", getArtist);
router.post("/bulk", addBulkArtists);
router.post("/single", addSingleArtist);

export default router;
