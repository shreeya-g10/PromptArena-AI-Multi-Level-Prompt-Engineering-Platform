import { calculateScore } from "../../src/app/utils/scoring.js";
import { checkEthics } from "../../src/app/utils/ethics.js";
import { detectHallucination } from "../../src/app/utils/hallucination.js";
import { runTestCases } from "../services/testRunner.js";
import { computePromptScore } from "./promptQuality.js";

/**
 * @param {string} prompt
 * @param {object} problem
 * @param {string} generatedCode
 * @param {{ combinedReliability?: boolean }} [options]
 */
export async function evaluatePrompt(
  prompt,
  problem,
  generatedCode,
  options = {}
) {
  const aiOutput = generatedCode;

  const structureScore = calculateScore(prompt) || 0;

  const testResult = runTestCases(problem, aiOutput);

  const testScore =
    testResult.total > 0 ? (testResult.passed / testResult.total) * 100 : 0;

  let reliabilityScore;
  let promptScore;

  if (options.combinedReliability) {
    promptScore = computePromptScore(prompt);
    reliabilityScore = Math.round(promptScore * 0.6 + testScore * 0.4);
  } else {
    promptScore = undefined;
    reliabilityScore = testScore;
  }

  const ethicalScore = checkEthics(prompt) || 0;
  const hallucinationDetected = detectHallucination(prompt);

  const effectivenessScore =
    (structureScore || 0) * 0.6 + (reliabilityScore || 0) * 0.4;

  return {
    structureScore: structureScore || 0,
    reliabilityScore: Math.round(reliabilityScore || 0),
    effectivenessScore: Math.round(effectivenessScore || 0),
    ethicalScore,
    hallucinationDetected,
    testCasesPassed: testResult.passed || 0,
    totalTestCases: testResult.total || 0,
    testCaseResults: testResult.results || [],
    aiOutput,
    ...(options.combinedReliability
      ? { promptScore, testScore: Math.round(testScore) }
      : {}),
  };
}