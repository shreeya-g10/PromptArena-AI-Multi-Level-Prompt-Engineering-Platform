/**
 * Level 2 prompt quality (0–100): five +20 checks.
 */
export function computePromptScore(prompt) {
  const p = (prompt || "").toLowerCase();
  let score = 0;
  if (/python|java|c\+\+/.test(p)) score += 20;
  if (/function|def|method/.test(p)) score += 20;
  if (/input|output|return/.test(p)) score += 20;
  if (/edge case|empty|negative|null/.test(p)) score += 20;
  if ((prompt || "").length > 20) score += 20;
  return Math.min(100, score);
}

/** Gap-based hints for the current prompt (deduped). */
export function buildSmartFeedbackGaps(prompt) {
  const p = prompt || "";
  const pl = p.toLowerCase();
  const out = [];
  if (!/python|java|c\+\+/i.test(p)) {
    out.push("Specify programming language");
  }
  if (!/function|def|method/i.test(pl)) {
    out.push("Define function structure");
  }
  if (!/input|output|return/i.test(pl)) {
    out.push("Specify input/output format");
  }
  if (!/edge case|empty|negative|null/i.test(pl)) {
    out.push("Mention edge cases like empty or negative inputs");
  }
  return out;
}
