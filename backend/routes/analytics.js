import express from "express";
import UserData from "../models/userData.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const allData = await UserData.find();

    const totalPrompts = allData.length;

    const averageScore =
      totalPrompts > 0
        ? Math.round(
            allData.reduce(
              (sum, item) => sum + (item.effectivenessScore || 0),
              0
            ) / totalPrompts
          )
        : 0;

    const successRate =
      totalPrompts > 0
        ? Math.round(
            (allData.filter(
              (item) => (item.effectivenessScore || 0) >= 70
            ).length /
              totalPrompts) *
              100
          )
        : 0;

    const improvement = 0;

    const scoreHistory = allData.map((item, index) => ({
      date: `Attempt ${index + 1}`,
      score: item.effectivenessScore || 0,
    }));

    const categoryBreakdown = [
      {
        category: "Prompt Quality",
        score: averageScore,
      },
      {
        category: "Reliability",
        score: averageScore - 5 > 0 ? averageScore - 5 : 0,
      },
      {
        category: "Ethics",
        score: averageScore - 10 > 0 ? averageScore - 10 : 0,
      },
    ];

    res.json({
      totalPrompts,
      successRate,
      averageScore,
      improvement,
      scoreHistory,
      categoryBreakdown,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch analytics data",
    });
  }
});

export default router;