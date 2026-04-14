import express from "express";
import UserData from "../models/UserData.js"; // ✅ MongoDB model

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const data = await UserData.find();

    // sort by effectiveness score (highest first)
    const sorted = data.sort(
      (a, b) => (b.effectivenessScore || 0) - (a.effectivenessScore || 0)
    );

    res.json(sorted);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;