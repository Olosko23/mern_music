import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getSongs,
  getTopSongs,
  getNewReleases,
  getRandom,
  getAroundYou,
  likeSong,
  addBulkSongs,
  addSingleSong,
} from "../controllers/songController.js";

const router = express.Router();

router.get("/", getSongs);
router.get("/top", getTopSongs);
router.get("/releases", getNewReleases);
router.get("/random", getRandom);
router.get("/popular", getAroundYou);
router.patch("/like/:id", verifyToken, likeSong);
router.post("/bulk", addBulkSongs);
router.post("/single", addSingleSong);

export default router;
