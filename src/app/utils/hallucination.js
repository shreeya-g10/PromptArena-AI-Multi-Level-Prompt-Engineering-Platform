export function detectHallucination(code) {
    const riskyPatterns = ["always", "guaranteed", "100%"];

    return riskyPatterns.some(word =>
        code.toLowerCase().includes(word)
    );
}