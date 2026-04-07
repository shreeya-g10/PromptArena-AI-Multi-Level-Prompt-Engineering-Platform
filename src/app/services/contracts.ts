export interface TestCaseResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface CodingProblem {
  problem_id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  language: 'Python';
  expected_output: string;
  tags: string[];
  test_cases: { input: string; expectedOutput: string }[];
}

export interface Level1Request {
  userId: string;
  problemId: string;
  promptText: string;
  language: string;
  attempts: number;
}

export interface Level1Response {
  structureScore: number;
  successProbability: number;
  reliabilityScore: number;
  effectivenessScore: number;
  testCasesPassed: number;
  totalTestCases: number;
  generatedCode: string;
  testCaseResults: TestCaseResult[];
  suggestion: string;
}

export interface PromptVersion {
  version: number;
  promptText: string;
  structureScore: number;
  timestamp: string;
}

export interface PromptComparison {
  before: string;
  after: string;
  improvementPercent: number;
}

export interface Level2Request {
  userId: string;
  problemId: string;
  promptText: string;
  previousVersions: PromptVersion[];
  problemContext?: Pick<
    CodingProblem,
    'title' | 'description' | 'expected_output' | 'tags'
  >;
}

export interface Level2Response {
  newVersion: PromptVersion;
  evolutionHistory: PromptVersion[];
  reliabilityScore: number;
  efficiencyIndex: number;
  problemRelevanceScore?: number;
  relevanceNotes?: string[];
  feedback: string[];
  comparison: PromptComparison;
}

export interface Level3Request {
  userId: string;
  scenarioId: string;
  promptText: string;
  problemId?: string;
  mode?: 'ethical' | 'coding';
  generatedCode?: string;
}

export interface Level3Response {
  ethicalIntegrityScore: number;
  hallucinationDetected: boolean;
  reliabilityAdjustment: number;
  rationale: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
}

export interface AnalyticsPoint {
  date: string;
  score: number;
}

export interface CategoryScore {
  category: string;
  score: number;
}

export interface AnalyticsResponse {
  totalPrompts: number;
  successRate: number;
  averageScore: number;
  improvement: number;
  scoreHistory: AnalyticsPoint[];
  categoryBreakdown: CategoryScore[];
}

export interface ApiClient {
  fetchProblems(): Promise<CodingProblem[]>;
  submitLevel1Prompt(payload: Level1Request): Promise<Level1Response>;
  submitLevel2Prompt(payload: Level2Request): Promise<Level2Response>;
  submitLevel3Scenario(payload: Level3Request): Promise<Level3Response>;
  fetchLeaderboard(): Promise<LeaderboardEntry[]>;
  fetchAnalytics(): Promise<AnalyticsResponse>;
}
