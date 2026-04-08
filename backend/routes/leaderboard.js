import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { name: "User1", score: 90 },
    { name: "User2", score: 85 }
  ]);
});

export default router;