import express from "express";
import {
  loginUser,
  registerUser,
  getUserFavoriteSongs,
} from "../controllers/userController.js";

import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/favorites", verifyToken, getUserFavoriteSongs);

export default router;
