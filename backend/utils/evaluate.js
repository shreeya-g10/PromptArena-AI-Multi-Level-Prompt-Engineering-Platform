import { calculateScore } from "../../src/app/utils/scoring.js";
import { checkEthics } from "../../src/app/utils/ethics.js";
import { detectHallucination } from "../../src/app/utils/hallucination.js";
import { runTestCases } from "../services/testRunner.js";
import {
  computePromptScore,
  isLikelyProblemCopyPaste,
  buildLevel1Feedback,
} from "./promptQuality.js";

/**
 * @param {string} prompt
 * @param {object} problem
 * @param {string} generatedCode
 * @param {{ combinedReliability?: boolean; testResult?: { passed: number; total: number; results?: unknown[] } }} [options]
 */
export async function evaluatePrompt(
  prompt,
  problem,
  generatedCode,
  options = {}
) {
  const aiOutput = generatedCode;

  const testResult =
    options.testResult != null
      ? options.testResult
      : runTestCases(problem, aiOutput);
  const passed = testResult.passed ?? 0;
  const total = testResult.total ?? 0;

  if (options.combinedReliability) {
    // Level 2: combined reliability path
    const structureScore = calculateScore(prompt) || 0;
    const reliabilityRaw =
      total > 0 ? (passed / total) * 100 : 0;
    const testScore = reliabilityRaw;
    const promptScore = computePromptScore(prompt, problem);
    const reliabilityScore = Math.round(promptScore * 0.6 + testScore * 0.4);
    const ethicalScore = checkEthics(prompt) || 0;
    const hallucinationDetected = detectHallucination(prompt);
    const effectivenessScore = Math.round(
      (structureScore || 0) * 0.6 + (reliabilityScore || 0) * 0.4
    );

    return {
      structureScore: structureScore || 0,
      reliabilityScore,
      effectivenessScore,
      ethicalScore,
      hallucinationDetected,
      testCasesPassed: passed,
      totalTestCases: total,
      testCaseResults: testResult.results || [],
      aiOutput,
      promptScore,
      testScore: Math.round(testScore),
    };
  }

  // --- Level 1: aligned with Level 2 (prompt quality + test pass rate) ---

  const normalizedPrompt = (prompt || "").trim();
  const testScore = total > 0 ? (passed / total) * 100 : 0;

  let promptScore = computePromptScore(prompt, problem, { level1: true });
  const isCopyPaste = isLikelyProblemCopyPaste(normalizedPrompt, problem);

  if (isCopyPaste) {
    promptScore = Math.min(promptScore, 34);
  }

  const structureScore = !normalizedPrompt
    ? 0
    : Math.max(1, Math.min(10, Math.round(promptScore / 10)));

  const predictedSuccess = structureScore * 10;

  // Reliability: mostly driven by test pass rate ("depends on code"), with a
  // small prompt-quality term so a strong spec nudges score without masking failures.
  const reliability = Math.min(
    100,
    Math.max(
      0,
      Math.round(testScore * 0.82 + promptScore * 0.18)
    )
  );

  const effectiveness = Math.round(
    predictedSuccess * 0.5 + reliability * 0.5
  );

  const feedback = buildLevel1Feedback(normalizedPrompt, problem, {
    isCopyPaste,
    testPassRate: Math.round(testScore),
  });

  return {
    structureScore,
    predictedSuccess,
    reliability,
    effectiveness,
    passed,
    total,
    promptScore: Math.round(promptScore),
    testPassRate: Math.round(testScore),
    feedback,
  };
}
