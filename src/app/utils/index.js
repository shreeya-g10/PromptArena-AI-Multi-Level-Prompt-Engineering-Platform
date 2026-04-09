import { calculateReliability } from "./reliability";
import { predictSuccess } from "./scoring";

import { generateCode } from "../services/aiService";

export {
   
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
function calculateStructureScore(prompt) {
  let score = 0;

  if (/python|java|c\+\+|javascript/i.test(prompt)) score++; // language
  if (/function|method/i.test(prompt)) score++; // function
  if (/input|parameter|number|n/i.test(prompt)) score++; // input
  if (/return|output|true|false/i.test(prompt)) score++; // output
  if (/edge|negative|zero|constraint|1/i.test(prompt)) score++; // edge cases

  return score * 2; // out of 10
}

function isSameAsProblem(prompt, problem) {
  return prompt.trim().toLowerCase() === problem.trim().toLowerCase();
}

export async function evaluatePrompt(prompt, problem) {

  // ✅ 1. Structure Score
  let structureScore = calculateStructureScore(prompt);

  // ✅ 2. Copy Detection
  if (problem && isSameAsProblem(prompt, problem)) {
    structureScore = Math.min(structureScore, 2);
  }

  // ✅ 3. Success Prediction
  const successProbability = predictSuccess(structureScore);

  // ✅ 4. AI Output
  const aiOutput = await generateCode(prompt);

  // ✅ 5. Reliability
  const reliabilityRaw = calculateReliability(aiOutput);

  const testCaseScore =
    (reliabilityRaw.passed / reliabilityRaw.total) * 100;

  const reliabilityScore = Math.round(
    testCaseScore * 0.7 + structureScore * 3
  );

  // ✅ 6. Effectiveness (FIXED)
  const effectivenessScore = Math.round(
    structureScore * 6 + reliabilityScore * 0.4
  );

  // ✅ 7. Suggestion
  let suggestion = "";

  if (structureScore < 5) {
    suggestion = "Mention input, output and edge cases clearly.";
  } else if (structureScore < 7) {
    suggestion = "Try adding more constraints and clarity.";
  } else {
    suggestion = "Well-structured prompt!";
  }

  // ✅ 8. Return
  return {
    structureScore,
    successProbability,
    aiOutput,
    reliabilityScore,
    effectivenessScore,
    testCasesPassed: reliabilityRaw.passed,
    totalTestCases: reliabilityRaw.total,
    suggestion
  };
}