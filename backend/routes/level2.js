import express from "express";
import { handleLevel2, getLevel2History } from "../controllers/level2Controller.js";

const router = express.Router();

router.get("/history", getLevel2History);
router.post("/", handleLevel2);

export default router;