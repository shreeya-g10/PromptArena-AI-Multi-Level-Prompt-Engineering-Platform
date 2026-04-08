export function calculateStructureScore(prompt) {
  let score = 0;
  const text = prompt.toLowerCase();

  // 4 parameters (as per your doc)

  if (text.includes("python") || text.includes("java") || text.includes("c++"))
    score += 1;

  if (text.includes("function") || text.includes("program"))
    score += 1;

  if (text.includes("edge") || text.includes("negative") || text.includes("zero"))
    score += 1;

  if (text.includes("input") || text.includes("output") || text.includes("return"))
    score += 1;

  // Convert to /10 scale
  return Math.round((score / 4) * 10);
}
export function predictSuccess(structureScore) {
  return structureScore * 10;
}
export function calculateEffectiveness(structureScore, reliabilityScore) {
    return (structureScore * 5) + (reliabilityScore * 0.5);
}
export function evaluatePrompt(prompt, reliabilityScore = 0) {
    const structureScore = calculateStructureScore(prompt);
    const successProbability = predictSuccess(structureScore);
    const effectiveness = calculateEffectiveness(structureScore, reliabilityScore);

    return {
        structureScore,
        successProbability,
        effectiveness
    };
}
export function calculateScore(prompt) {
  let score = 0;

  if (prompt.toLowerCase().includes("python")) score++;
  if (prompt.toLowerCase().includes("input")) score++;
  if (prompt.toLowerCase().includes("output")) score++;
  if (prompt.toLowerCase().includes("handle") || prompt.toLowerCase().includes("edge")) score++;

  return Math.round((score / 4) * 10);
}