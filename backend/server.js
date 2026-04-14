import express from "express";
import cors from "cors";
import mongoose from "mongoose"; 

// imports
import level1Routes from "./routes/level1.js";
import level2Routes from "./routes/level2.js";
import level3Routes from "./routes/level3.js";
import leaderboardRoutes from "./routes/leaderboard.js";

console.log("🔥 Server file started");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ CONNECT TO MONGODB
mongoose.connect("mongodb://127.0.0.1:27017/promptarena")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ DB error:", err));

// routes
app.use("/api/level1", level1Routes);
app.use("/api/level2", level2Routes);
app.use("/api/level3", level3Routes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/", (req, res) => {
  res.send("Server working ✅");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});