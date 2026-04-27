import fetch from "node-fetch";                  // ✅ NEW
import dotenv from "dotenv";                     // ✅ NEW
import { evaluatePrompt } from "../utils/evaluate.js";   // ✅ EXISTING
import { runTestCases } from "../services/testRunner.js";
import { checkEthics } from "../../src/app/utils/ethics.js";
import { detectHallucination } from "../../src/app/utils/hallucination.js";
import UserData from "../models/userData.js";            // ✅ EXISTING

dotenv.config();                                 // ✅ NEW

export const handleLevel1 = async (req, res) => {
  try {
    const { prompt, problem } = req.body;   // ❗ removed generatedCode from input
    const userId = req.user.userId;

    // ✅ validation
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    // ===============================
    // 🔥 1. CALL OPENROUTER (NEW)
    // ===============================
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await response.json();

    const generatedCode =
      data.choices?.[0]?.message?.content || "No response";

    // ===============================
    // 🔥 2. EVALUATE (EXISTING)
    // ===============================
    const testDetails = runTestCases(problem, generatedCode);
    const result = await evaluatePrompt(prompt, problem, generatedCode, {
      testResult: testDetails,
    });

    console.log("Evaluation Result:", result);

    const ethicalScore = checkEthics(prompt) || 0;
    const hallucinationDetected = detectHallucination(prompt);
    const problemId = problem?.problem_id ?? problem?.id;

    // ===============================
    // 🔥 3. SAVE TO DB (EXISTING)
    // ===============================
    await UserData.create({
      userId,
      problemId,
      prompt,
      generatedCode,
      structureScore: result.structureScore,
      reliabilityScore: result.reliability,
      effectivenessScore: result.effectiveness,
      ethicalScore,
      hallucinationDetected,
      testCasesPassed: result.passed,
      totalTestCases: result.total,
      testCaseDetails: testDetails.results || [],
      aiOutput: generatedCode,
      timestamp: new Date()
    });

    // ===============================
    // 🔥 4. RESPONSE
    // ===============================
    res.json({
      structureScore: result.structureScore,
      predictedSuccess: result.predictedSuccess,
      reliability: result.reliability,
      effectiveness: result.effectiveness,
      passed: result.passed,
      total: result.total,
      promptScore: result.promptScore,
      testPassRate: result.testPassRate,
      successProbability: result.predictedSuccess,
      reliabilityScore: result.reliability,
      effectivenessScore: result.effectiveness,
      testCasesPassed: result.passed,
      totalTestCases: result.total,
      testCaseResults: testDetails.results || [],
      feedback: result.feedback ?? [],
      generatedCode
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};