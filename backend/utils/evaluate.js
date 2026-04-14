import { calculateScore } from "../../src/app/utils/scoring.js";
import { checkEthics } from "../../src/app/utils/ethics.js";
import { detectHallucination } from "../../src/app/utils/hallucination.js";
import { runTestCases } from "../services/testRunner.js";

export async function evaluatePrompt(prompt, problem, generatedCode) {

  const aiOutput = generatedCode;

  const structureScore = calculateScore(prompt) || 0;

  const testResult = runTestCases(problem, aiOutput);

  const reliabilityScore =
    testResult.total > 0
      ? (testResult.passed / testResult.total) * 100
      : 0;

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
    testCaseResults: testResult.results || [], // ✅ FIXED
    aiOutput
  };
}