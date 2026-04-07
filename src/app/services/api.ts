import {
  type AnalyticsResponse,
  type ApiClient,
  type CodingProblem,
  type LeaderboardEntry,
  type Level1Request,
  type Level1Response,
  type Level2Request,
  type Level2Response,
  type Level3Request,
  type Level3Response,
  type PromptVersion,
} from './contracts';
import { mockAnalytics, mockLeaderboard } from '../utils/mockData';
import { problems20 } from '../data/problems';

const API_MODE = (import.meta.env.VITE_API_MODE || 'mock').toLowerCase();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const computeStructureScore = (promptText: string) => {
  const text = promptText.toLowerCase();
  const checks = [
    /python|javascript|java|c\+\+|typescript|language/.test(text),
    /input|output|return|format/.test(text),
    /edge case|negative|zero|null|empty|constraint|limit/.test(text),
    /function|behavior|steps|requirements|should/.test(text),
  ];
  const present = checks.filter(Boolean).length;
  return clamp(Math.round((present / checks.length) * 10), 1, 10);
};

const buildGeneratedCode = (problemId: string) => {
  if (problemId === '1') {
    return `def respond_to_customer_complaint(message: str) -> str:
    return (
        "I am sorry for the delay. I understand your frustration. "
        "I have escalated your order to priority support and will update you within 24 hours."
    )`;
  }
  if (problemId === '2') {
    return `def explain_code_snippet(snippet: str) -> str:
    return "The code first filters values greater than 5, then doubles each remaining value."`;
  }
  return `def extract_contact_data(text: str) -> dict:
    return {"name": "John Smith", "email": "john@techcorp.com", "phone": "555-0123", "company": "TechCorp"}`;
};

const mockApi: ApiClient = {
  async fetchProblems(): Promise<CodingProblem[]> {
    await wait(250);
    return problems20.map((problem) => ({ ...problem }));
  },

  async submitLevel1Prompt(payload: Level1Request): Promise<Level1Response> {
    await wait(900);

    const structureScore = computeStructureScore(payload.promptText);
    const successProbability = clamp(structureScore * 10, 10, 100);
    const totalTestCases = 5;
    const testCasesPassed = clamp(
      Math.round((successProbability / 100) * totalTestCases),
      1,
      totalTestCases
    );
    const reliabilityScore = Math.round((testCasesPassed / totalTestCases) * 100);
    const effectivenessScore = clamp(
      Math.round(structureScore * 5 + reliabilityScore * 0.5),
      0,
      100
    );

    return {
      structureScore,
      successProbability,
      reliabilityScore,
      effectivenessScore,
      testCasesPassed,
      totalTestCases,
      generatedCode: buildGeneratedCode(payload.problemId),
      testCaseResults: [
        { input: '2', expectedOutput: 'True', actualOutput: 'True', passed: true },
        { input: '3', expectedOutput: 'True', actualOutput: 'True', passed: true },
        { input: '4', expectedOutput: 'False', actualOutput: 'False', passed: true },
        { input: '-1', expectedOutput: 'False', actualOutput: 'False', passed: testCasesPassed >= 4 },
        { input: '0', expectedOutput: 'False', actualOutput: testCasesPassed === 5 ? 'False' : 'Error', passed: testCasesPassed === 5 },
      ],
      suggestion:
        structureScore < 6
          ? 'Specify language, expected input/output, and edge cases to improve reliability.'
          : 'Great prompt structure. Add constraints like complexity limits for even better consistency.',
    };
  },

  async submitLevel2Prompt(payload: Level2Request): Promise<Level2Response> {
    await wait(800);

    const structureScore = computeStructureScore(payload.promptText);
    const newVersion: PromptVersion = {
      version: payload.previousVersions.length + 1,
      promptText: payload.promptText,
      structureScore,
      timestamp: new Date().toISOString(),
    };

    const evolutionHistory = [...payload.previousVersions, newVersion];
    const reliabilityScore = clamp(50 + structureScore * 5, 0, 100);
    const attempts = Math.max(evolutionHistory.length, 1);
    const efficiencyIndex = Math.round(reliabilityScore / attempts);
    const firstPrompt = evolutionHistory[0]?.promptText || payload.promptText;
    const firstScore = evolutionHistory[0]?.structureScore || structureScore;
    const improvementPercent = clamp((structureScore - firstScore) * 10, 0, 100);

    const feedback: string[] = [];
    if (structureScore < 5) feedback.push('Add clear language and output format requirements.');
    if (!/edge case|constraint|negative|limit/i.test(payload.promptText)) {
      feedback.push('Mention edge cases and constraints explicitly.');
    }
    if (!/return|output|json|true|false/i.test(payload.promptText)) {
      feedback.push('Define expected output shape to reduce ambiguity.');
    }
    if (payload.problemContext?.expected_output) {
      feedback.push(
        `Align the response format with expected output: ${payload.problemContext.expected_output}.`
      );
    }
    if (payload.problemContext?.tags?.length) {
      feedback.push(
        `Include constraints relevant to: ${payload.problemContext.tags.join(', ')}.`
      );
    }
    if (feedback.length === 0) {
      feedback.push('Prompt quality is strong. Consider adding performance constraints.');
    }

    return {
      newVersion,
      evolutionHistory,
      reliabilityScore,
      efficiencyIndex,
      feedback,
      comparison: {
        before: firstPrompt,
        after: payload.promptText,
        improvementPercent,
      },
    };
  },

  async submitLevel3Scenario(payload: Level3Request): Promise<Level3Response> {
    await wait(700);
    const text = payload.promptText.toLowerCase();
    const unsafePattern = /hack|exploit|malware|ransomware code|bypass/;
    const safePattern = /explain|prevention|protection|safety|awareness/;
    const hallucinationDetected =
      !!payload.generatedCode && /undefined|syntaxerror|exception|todo/i.test(payload.generatedCode);

    const ethicalIntegrityScore =
      payload.mode === 'coding'
        ? 80
        : unsafePattern.test(text)
        ? 20
        : safePattern.test(text)
        ? 95
        : 70;

    return {
      ethicalIntegrityScore,
      hallucinationDetected,
      reliabilityAdjustment: hallucinationDetected ? -20 : 5,
      rationale: hallucinationDetected
        ? 'Potential hallucination detected due to invalid or inconsistent generated code.'
        : ethicalIntegrityScore > 90
        ? 'Prompt is safety-oriented and aligned with responsible AI usage.'
        : 'Prompt is partially safe but can be improved by emphasizing prevention and ethical framing.',
    };
  },

  async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    await wait(300);
    return mockLeaderboard.map((entry) => ({ ...entry }));
  },

  async fetchAnalytics(): Promise<AnalyticsResponse> {
    await wait(300);
    return {
      totalPrompts: mockAnalytics.totalPrompts,
      successRate: mockAnalytics.successRate,
      averageScore: mockAnalytics.averageScore,
      improvement: mockAnalytics.improvement,
      scoreHistory: [...mockAnalytics.scoreHistory],
      categoryBreakdown: [...mockAnalytics.categoryBreakdown],
    };
  },
};

const postJson = async <TResponse>(
  path: string,
  payload: unknown
): Promise<TResponse> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as TResponse;
};

const httpApi: ApiClient = {
  async fetchProblems() {
    const response = await fetch(`${API_BASE_URL}/problems`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return (await response.json()) as CodingProblem[];
  },
  submitLevel1Prompt(payload) {
    return postJson<Level1Response>('/level1', payload);
  },
  submitLevel2Prompt(payload) {
    return postJson<Level2Response>('/level2', payload);
  },
  submitLevel3Scenario(payload) {
    return postJson<Level3Response>('/level3', payload);
  },
  async fetchLeaderboard() {
    const response = await fetch(`${API_BASE_URL}/leaderboard`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return (await response.json()) as LeaderboardEntry[];
  },
  async fetchAnalytics() {
    const response = await fetch(`${API_BASE_URL}/analytics`);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    return (await response.json()) as AnalyticsResponse;
  },
};

export const apiClient: ApiClient = API_MODE === 'http' ? httpApi : mockApi;
