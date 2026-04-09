import express from "express";
import { handleLevel1 } from "../controllers/level1Controller.js";

const router = express.Router();

// optional GET (for browser)
router.get("/", (req, res) => {
  res.send("Level1 working (use POST)");
});

// ✅ MAIN ROUTE (IMPORTANT)
router.post("/", handleLevel1);

export default router;