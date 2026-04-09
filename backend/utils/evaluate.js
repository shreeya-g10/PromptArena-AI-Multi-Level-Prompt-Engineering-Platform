import { calculateScore } from "../../src/app/utils/scoring.js";
import { checkEthics } from "../../src/app/utils/ethics.js";
import { detectHallucination } from "../../src/app/utils/hallucination.js";
import { runTestCases } from "../services/testRunner.js";

export async function evaluatePrompt(prompt, problem, generatedCode) {

  const aiOutput = generatedCode;

  const structureScore = calculateScore(prompt);

  const testResult = runTestCases(problem, aiOutput);

  const reliabilityScore =
    (testResult.passed / testResult.total) * 100;

  const ethicalScore = checkEthics(prompt);
  const hallucinationDetected = detectHallucination(prompt);

  const effectivenessScore =
    structureScore * 0.6 + reliabilityScore * 0.4;

  return {
    structureScore,
    reliabilityScore: Math.round(reliabilityScore),
    effectivenessScore: Math.round(effectivenessScore),
    ethicalScore,
    hallucinationDetected,
    testCasesPassed: testResult.passed,
    totalTestCases: testResult.total,
    testCaseDetails: testResult.results,
    aiOutput
  };
}