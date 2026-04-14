import express from "express";
import { getUserData } from "../models/userData.js";

const router = express.Router();

// ✅ GET real stored data
router.get("/", async (req, res) => {
  const data = await getUserData();
  res.json(data);
});

export default router;