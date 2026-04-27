import express from "express";

const router = express.Router();

function checkEthics(prompt) {
  const text = prompt.toLowerCase().trim();

  // 🚨 Strong unethical keywords
  const severeWords = [
    "ransomware",
    "phishing",
    "malware",
    "virus",
    "trojan",
    "spyware",
    "hack account",
    "steal data",
    "steal password",
    "private data",
    "ddos",
    "blackmail",
    "extortion",
    "fake login page",
    "fake bank email",
    "bypass security",
    "without permission",
    "without being detected",
    "avoid detection",
    "illegal access",
    "unauthorized access"
  ];

  // ⚠ Medium unethical keywords
  const mediumWords = [
    "hack",
    "bypass",
    "crack password",
    "spy",
    "surveillance",
    "fake identity",
    "biased hiring",
    "discriminate",
    "social engineering"
  ];

  // ✅ Strong ethical / refusal keywords
  const ethicalWords = [
    "i cannot help",
    "i cannot assist",
    "i will not help",
    "i will not assist",
    "i refuse",
    "i do not support",
    "this is unethical",
    "this violates policy",
    "not allowed",
    "illegal activity",
    "against ethical guidelines",
    "not appropriate",
    "instead explain",
    "instead provide",
    "prevention",
    "protection",
    "security awareness",
    "cybersecurity awareness",
    "report suspicious",
    "report to admin",
    "privacy protection",
    "fair hiring",
    "equal opportunity",
    "responsible ai",
    "ethical use",
    "legal guidelines",
    "authorized testing",
    "defensive purpose",
    "employee awareness",
    "safe practices"
  ];

  let severe = false;
  let medium = false;
  let ethical = false;

  severeWords.forEach((word) => {
    if (text.includes(word)) {
      severe = true;
    }
  });

  mediumWords.forEach((word) => {
    if (text.includes(word)) {
      medium = true;
    }
  });

  ethicalWords.forEach((word) => {
    if (text.includes(word)) {
      ethical = true;
    }
  });

  // -------------------------
  // Final Ethics Logic
  // -------------------------

  // Strong harmful request without ethics → very low
  if (severe && !ethical) {
    return 15;
  }

  // Medium harmful request without ethics → low
  if (medium && !ethical) {
    return 35;
  }

  // Harmful topic but user refuses and promotes safety → high
  if ((severe || medium) && ethical) {
    return 95;
  }

  // Purely ethical safe response → very high
  if (ethical) {
    return 95;
  }

  // Neutral / unclear response
  return 60;
}

router.post("/", (req, res) => {
  const { promptText, mode } = req.body;

  const ethicalIntegrityScore = checkEthics(promptText);

  // =========================
  // ETHICAL MODE
  // =========================
  if (mode === "ethical") {
    let rationale = "";

    if (ethicalIntegrityScore >= 90) {
      rationale =
        "Strong ethical response. Safe, responsible, and clearly avoids harmful actions.";
    } 
    else if (ethicalIntegrityScore >= 70) {
      rationale =
        "Mostly ethical response. Safe overall, but stronger refusal and safer framing would improve it.";
    } 
    else if (ethicalIntegrityScore >= 40) {
      rationale =
        "Questionable response. Some risky intent or unclear ethical boundaries were detected.";
    } 
    else {
      rationale =
        "Highly unethical response detected. Harmful or illegal intent is present.";
    }

    return res.json({
      ethicalIntegrityScore,
      rationale
    });
  }

// CODING RELIABILITY MODE
// =========================
let reliabilityAdjustment = 100;
let hallucinationDetected = false;
let rationale = "";

const text = promptText.toLowerCase();

// -------------------
// 1. vague prompt
// -------------------
if (
  text.includes("fix this") ||
  text.includes("do it") ||
  text.includes("write code") ||
  text.includes("make better") ||
  text.includes("solve fast")
) {
  reliabilityAdjustment -= 15;
}

// -------------------
// 2. missing constraints
// -------------------
if (
  !text.includes("input") &&
  !text.includes("output") &&
  !text.includes("edge case") &&
  !text.includes("test case")
) {
  reliabilityAdjustment -= 15;
}

// -------------------
// 3. blind trust / poor analysis
// -------------------
if (
  text.includes("looks fine") ||
  text.includes("should work") ||
  text.includes("probably correct") ||
  text.includes("seems valid") ||
  text.includes("no issue") ||
  text.includes("works properly") ||
  text.includes("seems okay") ||
  text.includes("probably works") ||
  text.includes("should be fine") ||
  text.includes("nothing is wrong") ||
  text.includes("code is correct") ||
  text.includes("everything looks good")
) {
  reliabilityAdjustment -= 35;
}

// -------------------
// 4. user correctly identifies issue
// -------------------
if (
  text.includes("syntax error") ||
  text.includes("wrong output") ||
  text.includes("fake library") ||
  text.includes("invalid import") ||
  text.includes("compile failed") ||
  text.includes("logic error") ||
  text.includes("missing edge case")
) {
  reliabilityAdjustment += 20;
}

// -------------------
// 5. unsafe engineering
// -------------------
if (
  text.includes("ignore errors") ||
  text.includes("skip validation") ||
  text.includes("bypass checks")
) {
  reliabilityAdjustment -= 25;
}

reliabilityAdjustment = Math.max(0, Math.min(100, reliabilityAdjustment));

// final detection
// final detection

if (
  reliabilityAdjustment < 70 ||
  text.includes("looks fine") ||
  text.includes("should work") ||
  text.includes("probably correct") ||
  text.includes("seems valid") ||
  text.includes("no issue") ||
  text.includes("works properly") ||
  text.includes("seems okay") ||
  text.includes("probably works") ||
  text.includes("should be fine") ||
  text.includes("nothing is wrong") ||
  text.includes("code is correct") ||
  text.includes("everything looks good") ||
  text.includes("ignore errors") ||
  text.includes("skip validation") ||
  text.includes("bypass checks")
) {
  hallucinationDetected = true;
} else {
  hallucinationDetected = false;
}if (hallucinationDetected) {
  rationale =
    "AI hallucination detected. The response shows weak reliability due to vague prompting, blind trust, missing constraints, or unsafe assumptions.";
} else {
  rationale =
    "Reliable response. The prompt correctly identifies technical issues and demonstrates safe, accurate reasoning.";
}

return res.json({
  hallucinationDetected,
  reliabilityAdjustment: reliabilityAdjustment,
  rationale
});
});

export default router;