import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { data } = req.body;

  res.json({
    message: "Level 3 API working ✅",
    received: data
  });
});

export default router;