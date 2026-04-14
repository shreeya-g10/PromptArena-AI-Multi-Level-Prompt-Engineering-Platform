import express from "express";
import { handleLevel1 } from "../controllers/level1Controller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET (for browser check)
router.get("/", (req, res) => {
  res.send("Level1 working (use POST)");
});

// 🔐 PROTECTED API
router.post("/", verifyToken, handleLevel1);

export default router;