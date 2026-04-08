import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  const { prompt } = req.body;

  console.log("Received:", prompt);

  res.json({
    message: "Level 1 API working ✅",
    promptReceived: prompt
  });
});

export default router;