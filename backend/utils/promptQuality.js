/**
 * Level 2 / Level 1 prompt quality (0–100): weighted checks.
 * @param {string} prompt
 * @param {{ language?: string; title?: string; description?: string } | null} [problem]
 * @param {{ level1?: boolean }} [opts] Pass `{ level1: true }` only from Level 1 — keeps Level 2 behaviour unchanged.
 */
export function computePromptScore(prompt, problem, opts) {
  const p = (prompt || "").toLowerCase();
  let score = 0;

  const langNamed = /python|java|c\+\+|javascript|typescript|go|rust/i.test(p);
  if (langNamed) score += 20;

  const inferredLang = inferLanguageFromProblem(prompt, problem);
  if (!langNamed && inferredLang) score += 16;

  if (/function|def|method/.test(p)) score += 20;
  if (/\b(code|program|routine)\b/.test(p)) score += 14;
  if (/input|output|return|returns|parameter|argument|expected/.test(p))
    score += 20;
  if (
    /edge case|edge cases|empty|negative|null|zero|constraint|invalid|boundary|corner/i.test(
      p
    )
  )
    score += 20;
  if ((prompt || "").length > 20) score += 18;

  const domain = mentionsProblemDomain(prompt, problem);
  if (domain && !langNamed) score += 8;

  score = Math.min(100, score);

  if (opts?.level1) {
    const raw = (prompt || "").trim();
    const words = raw.split(/\s+/).filter(Boolean);
    const hasRichSpec =
      /python|java|function|def|method|return|returns|input|output|edge|negative|zero|constraint|integer|boolean|otherwise|handle\s+edge|takes\s+an/i.test(
        p
      );
    if (words.length <= 6 && !hasRichSpec) {
      score = Math.min(score, 32);
    }
    if (words.length <= 4 && !langNamed && !/function|def/.test(p)) {
      score = Math.min(score, 28);
    }
  }

  return score;
}

function inferLanguageFromProblem(prompt, problem) {
  const lang = (problem?.language || "").toLowerCase();
  if (!lang.includes("python")) return false;
  const pl = (prompt || "").toLowerCase();
  if (/python/.test(pl)) return true;
  return /\b(code|program|script|snippet|def|function)\b/.test(pl) || mentionsProblemDomain(prompt, problem);
}

function mentionsProblemDomain(prompt, problem) {
  const pl = (prompt || "").toLowerCase();
  if (!pl) return false;
  const title = (problem?.title || "").toLowerCase();
  const desc = (problem?.description || "").toLowerCase();
  const stems =
    /\b(prime|factorial|palindrome|fibonacci|anagram|prefix|parentheses|binary|search|sort|merge|rotate|vowel|reverse|json|cache|ladder|frequent|leetcode|array|list|string|dict)\b/i;
  if (stems.test(pl)) return true;
  const stop = new Set([
    "write",
    "python",
    "function",
    "returns",
    "that",
    "the",
    "and",
    "with",
    "from",
    "this",
    "given",
    "your",
    "code",
    "program",
    "handle",
    "cases",
    "like",
    "numbers",
    "number",
  ]);
  const words = [...title.split(/\W+/), ...desc.split(/\W+/)]
    .map((w) => w.trim().toLowerCase())
    .filter((w) => w.length > 4 && !stop.has(w));
  for (const w of new Set(words)) {
    if (w && pl.includes(w)) return true;
  }
  return false;
}

/** Gap-based hints for the current prompt (deduped). */
export function buildSmartFeedbackGaps(prompt, problem) {
  const p = prompt || "";
  const pl = p.toLowerCase();
  const out = [];

  const langOk =
    /python|java|c\+\+/i.test(p) || inferLanguageFromProblem(prompt, problem);
  if (!langOk) {
    out.push("Specify programming language (e.g. Python), or align your wording with the task so the model knows the stack.");
  }

  const sigOk =
    /function|def|method/i.test(pl) || /\b(code|program|routine)\b/i.test(pl);
  if (!sigOk) {
    out.push(
      "Name the function or describe what to build (e.g. “function is_prime(n) returning bool”)."
    );
  }

  const desc = (problem?.description || "").toLowerCase();
  const primeStyleTask =
    /prime/i.test(desc) &&
    /prime/i.test(pl) &&
    /negative|edge|even|odd|less|greater|divide|sqrt|loop|factor|composite/i.test(
      pl
    );
  const ioOk =
    /input|output|return|returns|parameter|argument|expected|boolean|bool|true|false/i.test(
      pl
    ) ||
    primeStyleTask;
  if (!ioOk) {
    out.push(
      "State expected input type/range and return format (e.g. boolean for prime check, handling n ≤ 1)."
    );
  }

  const edgeOk =
    /edge case|edge cases|empty|negative|null|zero|constraint|invalid|boundary|corner|less than|n\s*[≤<]=?\s*1/i.test(
      pl
    );
  if (!edgeOk) {
    out.push(
      "Call out edge cases (e.g. n ≤ 1, negatives, even numbers) and constraints the solution must satisfy."
    );
  }

  return dedupeFeedback(out);
}

function dedupeFeedback(items) {
  return [...new Set(items.filter(Boolean))];
}

export function normalizePromptForCompare(text) {
  return (text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when the user prompt is essentially the official problem text (no added engineering).
 */
export function isLikelyProblemCopyPaste(prompt, problem) {
  const p = normalizePromptForCompare(prompt);
  const d = normalizePromptForCompare(problem?.description || "");
  if (!p || !d || d.length < 20) return false;
  if (p === d) return true;
  const longer = p.length >= d.length ? p : d;
  const shorter = p.length >= d.length ? d : p;
  if (longer.includes(shorter) && shorter.length >= longer.length * 0.88) return true;
  const overlap = tokenSetOverlap(p, d);
  return overlap >= 0.82 && Math.abs(p.length - d.length) / Math.max(d.length, 1) < 0.12;
}

function tokenSetOverlap(a, b) {
  const words = (s) =>
    new Set(
      s
        .split(/\s+/)
        .map((w) => w.trim())
        .filter((w) => w.length > 2)
    );
  const A = words(a);
  const B = words(b);
  if (A.size === 0 || B.size === 0) return 0;
  let inter = 0;
  for (const w of A) {
    if (B.has(w)) inter++;
  }
  return inter / Math.max(A.size, B.size);
}

/**
 * Level 1 learning feedback: gaps + copy-paste warning + problem-aware nudge.
 */
export function buildLevel1Feedback(
  prompt,
  problem,
  { isCopyPaste, testPassRate } = {}
) {
  const gaps = buildSmartFeedbackGaps(prompt, problem);
  const out = [];
  if (isCopyPaste) {
    out.push(
      "Your prompt closely matches the problem statement alone. Add your own specification: function name, parameter types, return rules, and edge cases to improve your score."
    );
  }
  out.push(...gaps);
  if (
    problem?.expected_output &&
    !/(expected|output format|return|boolean|true|false|prime)/i.test(
      prompt || ""
    )
  ) {
    out.push(
      `Tie your prompt to the expected result shape (this problem expects: ${problem.expected_output}).`
    );
  }
  if (typeof testPassRate === "number" && testPassRate < 100) {
    out.push(
      "Some tests failed: ask for a complete algorithm (e.g. trial division up to √n for primes), exact function name the grader calls, and explicit return type so generated code is runnable."
    );
  }
  return dedupeFeedback(out);
}