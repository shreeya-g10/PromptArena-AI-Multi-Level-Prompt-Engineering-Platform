import express from "express";
import cors from "cors";

// imports
import level1Routes from "./routes/level1.js";
import level2Routes from "./routes/level2.js";
import level3Routes from "./routes/level3.js";
import leaderboardRoutes from "./routes/leaderboard.js"; // ✅ ADD HERE

console.log("🔥 Server file started");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/level1", level1Routes);
app.use("/level2", level2Routes);
app.use("/level3", level3Routes);
app.use("/leaderboard", leaderboardRoutes); // ✅ ADD HERE

app.get("/", (req, res) => {
  res.send("Server working ✅");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});