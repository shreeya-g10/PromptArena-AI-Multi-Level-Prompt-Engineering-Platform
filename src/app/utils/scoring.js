export function calculateStructureScore(prompt) {
    let score = 0;
    const text = prompt.toLowerCase();

    // Parameters
    if (text.includes("python") || text.includes("java")) score++;
    if (text.includes("function") || text.includes("program")) score++;
    if (text.includes("input")) score++;
    if (text.includes("output")) score++;
    if (text.includes("edge") || text.includes("constraint")) score++;

    const total = 5;

    return Math.round((score / total) * 10);
}
export function predictSuccess(structureScore) {
    return structureScore * 10; // %
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
