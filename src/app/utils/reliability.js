export function calculateReliability(aiOutput) {
  // dummy logic (we improve later)

  let passed = 0;
  let total = 5;

  if (aiOutput.includes("return")) passed++;
  if (aiOutput.includes("for")) passed++;
  if (aiOutput.includes("if")) passed++;
  if (aiOutput.length > 20) passed++;
  if (!aiOutput.includes("error")) passed++;

  const score = Math.round((passed / total) * 100);

  return {
    passed,
    total,
    score
  };
}