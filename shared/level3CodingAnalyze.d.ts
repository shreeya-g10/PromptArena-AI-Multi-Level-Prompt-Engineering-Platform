export type ReasonQualityLabel = 'correct' | 'partial' | 'incorrect';

export interface ReasonExplanationScore {
  reasonQualityScore: number;
  reasonQualityLabel: ReasonQualityLabel;
  matchedKeywords: string[];
  hitAntiPatterns: string[];
}

export interface AiSnippetAnalysis {
  intrinsicHallucination: boolean;
  reliabilityScore: number;
  outputQualityScore: number;
  securityRating: number;
  compositeScore: number;
}

export function analyzeAiResponseSnippet(text: string): AiSnippetAnalysis;

export function scoreReasonExplanation(
  reasonExplanation: string,
  problemMeta?: {
    expectedReasonKeywords?: string[];
    antiPatterns?: string[];
    title?: string;
    groundTruthHallucination?: boolean;
  }
): ReasonExplanationScore;
