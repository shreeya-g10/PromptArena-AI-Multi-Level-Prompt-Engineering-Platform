import { calculateReliability } from "./reliability";
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
import { generateCode } from "../services/aiService";

export async function evaluatePrompt(prompt) {
  const structureScore = calculateScore(prompt);

  const successProbability = structureScore * 10;

  const aiOutput = await generateCode(prompt);
  const reliability = calculateReliability(aiOutput);

  return {
  structureScore,
  successProbability,
  aiOutput,
  reliabilityScore: reliability.score
};
  
}