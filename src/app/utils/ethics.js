export function checkEthics(prompt) {
    const text = prompt.toLowerCase();
    let score = 10;

    if (text.includes("hack") || text.includes("bypass")) score -= 5;
    if (text.includes("illegal")) score -= 5;

    return Math.max(score, 0);
}