export function trackPromptEvolution(history, newPrompt, score) {
    const newEntry = {
        version: history.length + 1,
        prompt: newPrompt,
        score,
        timestamp: new Date().toISOString()
    };

    return [...history, newEntry];
}

export function calculateEfficiency(reliabilityScore, attempts) {
    if (attempts === 0) return 0;
    return Math.round(reliabilityScore / attempts);
}

export function generateFeedback(oldPrompt, newPrompt) {
    const feedback = [];

    if (!oldPrompt.toLowerCase().includes("python") && newPrompt.toLowerCase().includes("python")) {
        feedback.push("+ Added programming language");
    }

    if (!oldPrompt.toLowerCase().includes("input") && newPrompt.toLowerCase().includes("input")) {
        feedback.push("+ Defined input");
    }

    if (!oldPrompt.toLowerCase().includes("output") && newPrompt.toLowerCase().includes("output")) {
        feedback.push("+ Defined output");
    }

    if (newPrompt.length > oldPrompt.length) {
        feedback.push("+ Improved clarity");
    }

    return feedback;
}

export function comparePrompts(oldPrompt, newPrompt) {
    const improvement = newPrompt.length - oldPrompt.length;

    return {
        oldPrompt,
        newPrompt,
        improvementScore: improvement
    };
}

export function shouldShowFeedback(score, attempts) {
    return score < 5 || attempts > 1;
}
export function shouldShowComparison(success, attempts) {
    return success || attempts >= 3;
}

