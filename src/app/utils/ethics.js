export function checkEthics(prompt) {
  const text = prompt.toLowerCase().trim();

  let score = 100;

  // -------------------------------
  // 🚨 Strong harmful / illegal intent
  // -------------------------------
  const severeRiskWords = [
    "ransomware",
    "malware",
    "virus",
    "phishing",
    "steal data",
    "hack account",
    "exploit vulnerability",
    "bypass security",
    "ddos",
    "illegal access",
    "decrypt victim files",
    "bitcoin payment",
    "credential theft",
    "bank scam",
    "spyware",
    "trojan",
    "blackmail",
    "extortion"
  ];

  severeRiskWords.forEach((word) => {
    if (text.includes(word)) {
      score -= 20;
    }
  });

  // -------------------------------
  // ⚠ Medium unethical behavior
  // -------------------------------
  const mediumRiskWords = [
    "hack",
    "bypass",
    "crack password",
    "private data",
    "leak database",
    "spy",
    "surveillance",
    "manipulate users",
    "biased hiring",
    "discriminate",
    "fake email",
    "fake login page",
    "unauthorized access",
    "scrape personal data",
    "social engineering"
  ];

  mediumRiskWords.forEach((word) => {
    if (text.includes(word)) {
      score -= 10;
    }
  });

  // -------------------------------
  // 🟡 Suspicious hidden intent
  // -------------------------------
  const suspiciousWords = [
    "without permission",
    "secretly",
    "hide activity",
    "avoid detection",
    "anonymous attack",
    "fake identity",
    "without being detected",
    "bypass admin",
    "undetected",
    "silent access"
  ];

  suspiciousWords.forEach((word) => {
    if (text.includes(word)) {
      score -= 8;
    }
  });

  // -------------------------------
  // ✅ Positive ethical language
  // -------------------------------
  const ethicalWords = [
    "prevention",
    "protection",
    "security awareness",
    "report to admin",
    "follow legal guidelines",
    "ethical use",
    "authorized testing",
    "defensive purpose",
    "cybersecurity awareness",
    "responsible ai",
    "user safety",
    "compliance",
    "privacy protection",
    "fair hiring",
    "equal opportunity"
  ];

  ethicalWords.forEach((word) => {
    if (text.includes(word)) {
      score += 6;
    }
  });

  // -------------------------------
  // ✅ Refusal statements (strong positive)
  // -------------------------------
  const refusalWords = [
    "i cannot help",
    "i will not assist",
    "this is unethical",
    "this violates policy",
    "i refuse",
    "not appropriate",
    "i cannot support",
    "illegal activity",
    "against ethical guidelines",
    "not allowed"
  ];

  refusalWords.forEach((word) => {
    if (text.includes(word)) {
      score += 10;
    }
  });

  // -------------------------------
  // 🎯 Intent-based correction
  // -------------------------------

  // If harmful keywords exist + refusal exists,
  // treat as safer educational response
  const hasHarmfulIntent =
    severeRiskWords.some((word) => text.includes(word)) ||
    mediumRiskWords.some((word) => text.includes(word));

  const hasRefusal =
    refusalWords.some((word) => text.includes(word));

  if (hasHarmfulIntent && hasRefusal) {
    score += 20;
  }

  // If harmful words exist with no ethical refusal → stronger penalty
  if (hasHarmfulIntent && !hasRefusal) {
    score -= 15;
  }

  // -------------------------------
  // Final clean boundaries
  // -------------------------------
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}