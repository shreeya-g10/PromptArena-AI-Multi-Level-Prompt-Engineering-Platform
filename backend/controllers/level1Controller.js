import { evaluatePrompt } from "../utils/evaluate.js";
import { saveUserData } from "../models/userData.js";

export const handleLevel1 = async (req, res) => {
  try {
    const { userId, prompt, problem, generatedCode } = req.body;

    const result = await evaluatePrompt(prompt, problem, generatedCode);

    await saveUserData({
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