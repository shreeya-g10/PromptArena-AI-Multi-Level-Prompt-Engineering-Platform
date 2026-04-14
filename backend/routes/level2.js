import express from "express";
import { handleLevel2 } from "../controllers/level2Controller.js";

const router = express.Router();

router.post("/", handleLevel2);

export default router;