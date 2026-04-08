export function calculateReliability(output) {
  let passed = 0;
  const total = 5;

  if (!output) return { score: 0, passed, total };

  if (output.includes("def")) passed++;
  if (output.includes("return")) passed++;
  if (output.includes("for")) passed++;
  if (output.length > 50) passed++;
  if (!output.includes("error")) passed++;

  const score = Math.round((passed / total) * 100);

  return { score, passed, total };
}