import { calculateReliability } from "./reliability";
import { calculateStructureScore, predictSuccess } from "./scoring";

import { generateCode } from "../services/aiService";

export {
    calculateStructureScore,
    predictSuccess,
    calculateEffectiveness,
    
} from "./scoring";

export { optimizePrompt } from "./optimize";
export { checkEthics } from "./ethics";
export { detectHallucination } from "./hallucination";

export {
    trackPromptEvolution,
    calculateEfficiency,
    generateFeedback,
    comparePrompts,
    shouldShowFeedback,
    shouldShowComparison
} from "./evolution";
import { calculateScore } from "./scoring";


export async function evaluatePrompt(prompt) {
  // Step 3: Structure Score
  const structureScore = calculateStructureScore(prompt);

  // Step 4: Success Prediction
  const successProbability = predictSuccess(structureScore);

  // Step 5: AI call
  const aiOutput = await generateCode(prompt);

  // Step 6–7: Reliability
  const reliability = calculateReliability(aiOutput);

  // Step 8: Effectiveness
  const effectivenessScore =
    structureScore * 5 + reliability.score * 0.5;

  return {
    structureScore,
    successProbability,
    aiOutput,
    reliabilityScore: reliability.score,
    effectivenessScore: Math.round(effectivenessScore),
    testCasesPassed: reliability.passed,
    totalTestCases: reliability.total,
  };
}