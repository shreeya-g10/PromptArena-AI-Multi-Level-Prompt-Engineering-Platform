import express from "express";
const router = express.Router();

// ✅ GET (for browser)
router.get("/", (req, res) => {
  res.send("Level1 working (use POST to test)");
});

// ✅ POST (your actual API)
router.post("/", (req, res) => {
  const { prompt } = req.body;

  console.log("Received:", prompt);

  res.json({
    message: "Level 1 API working ✅",
    promptReceived: prompt
  });
});

export default router;