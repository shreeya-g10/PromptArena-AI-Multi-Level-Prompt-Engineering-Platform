import { evaluatePrompt } from "../utils/evaluate.js";
import UserData from "../models/userData.js";

export const handleLevel1 = async (req, res) => {
  try {
    const { prompt, problem, generatedCode } = req.body;

    const userId = req.user.userId; // 🔐 secure user

    // validation
    if (!prompt || !generatedCode) {
      return res.status(400).json({ error: "Missing input" });
    }

    const result = await evaluatePrompt(prompt, problem, generatedCode);

    console.log("Evaluation Result:", result);

    await UserData.create({
      userId,
      problemId: problem?.id,
      prompt,
      generatedCode,
      ...result,
      timestamp: new Date()
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};