import express from "express";
import { handleLevel1 } from "../controllers/level1Controller.js";

const router = express.Router();

// GET (for browser check)
router.get("/", (req, res) => {
  res.send("Level1 working (use POST)");
});

// MAIN API
router.post("/", handleLevel1);

export default router;