import { evaluatePrompt } from "../utils/evaluate.js";
import UserData from "../models/userData.js";

export const handleLevel2 = async (req, res) => {
  try {
    const generateCodeFromAI = async (prompt, problem) => {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini",
      messages: [
        {
            role: "user",
            content: `
                You are solving a coding problem.

                Problem Title: ${problem?.title}
                Problem Description: ${problem?.description}
                Expected Output: ${problem?.expected_output}

                Example Test Case:
                ${JSON.stringify(problem?.test_cases?.[0])}

                User Prompt:
                ${prompt}

                IMPORTANT:
                - Solve THIS problem only
                - Return only code
                - Do NOT explain anything
                `
        }
        ]
    })
  });

  const data = await response.json();

  return data.choices?.[0]?.message?.content || "";
};
    const { userId, prompt, problem } = req.body;

    // ✅ Validation
   if (!prompt || !problem) {
  return res.status(400).json({ error: "Missing input" });
}
const aiOutput = await generateCodeFromAI(prompt, problem);

    // ✅ 1. Run evaluation (same as Level 1)
    const result = await evaluatePrompt(prompt, problem, aiOutput);

    console.log("Level 2 Evaluation:", result);

    // ✅ 2. Fetch previous attempts
    const previousAttempts = await UserData.find({
      userId,
      problemId: problem?.id
    }).sort({ timestamp: 1 });

    // ✅ 3. Evolution Tracking
    const evolutionHistory = previousAttempts.map((a, index) => ({
      version: index + 1,
      score: a.reliabilityScore / 10
    }));

    // ✅ 4. Efficiency Index
    const attempts = previousAttempts.length + 1;

    const efficiencyIndex =
      result.reliabilityScore === 100
        ? Math.round(100 / attempts)
        : null;

    // ✅ 5. Improvement Feedback
    let feedback = [];

    if (previousAttempts.length >= 1) {
      const prev = previousAttempts[previousAttempts.length - 1].prompt;

      if (prompt.length > prev.length) {
        feedback.push("Improved prompt detail");
      }

      if (prompt.includes("function")) {
        feedback.push("Defined function clearly");
      }

      if (prompt.includes("input")) {
        feedback.push("Added input constraints");
      }
    }

    // ✅ 6. Comparison Mode
    let comparison = null;

    if (previousAttempts.length >= 1) {
      const firstPrompt = previousAttempts[0].prompt;

      comparison = {
        before: firstPrompt,
        after: prompt,
        improvementPercent: Math.round(
          ((prompt.length - firstPrompt.length) / firstPrompt.length) * 100
        )
      };
    }

    // ✅ 7. Save current attempt
    await UserData.create({
      userId,
      problemId: problem?.id,
      prompt,
      generatedCode: aiOutput,
      ...result,
      timestamp: new Date()
    });

    // ✅ 8. Final Response
    res.json({
  ...result,
  aiOutput, // 🔥 VERY IMPORTANT
  evolutionHistory,
  efficiencyIndex,
  feedback,
  comparison
});

  } catch (err) {
    console.error("Level 2 Error:", err);
    res.status(500).json({ error: err.message });
  }
};