// Mock data for the platform
export interface LeaderboardUser {
  rank: number;
  username: string;
  score: number;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  expectedOutput: string;
}

export interface AnalyticsData {
  totalPrompts: number;
  successRate: number;
  averageScore: number;
  improvement: number;
  scoreHistory: { date: string; score: number }[];
  categoryBreakdown: { category: string; score: number }[];
}

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, username: 'PromptMaster', score: 2850 },
  { rank: 2, username: 'AIWhisperer', score: 2720 },
  { rank: 3, username: 'CodeNinja', score: 2580 },
  { rank: 4, username: 'TechSavvy', score: 2340 },
  { rank: 5, username: 'DevGuru', score: 2150 },
  { rank: 6, username: 'DataWizard', score: 1980 },
  { rank: 7, username: 'ByteWarrior', score: 1850 },
  { rank: 8, username: 'AlgoExpert', score: 1720 },
];

export const mockProblems: Problem[] = [
  {
    id: '1',
    title: 'Customer Service Bot',
    description: `Create a prompt that makes an AI assistant respond professionally to customer complaints about delayed shipping. The AI should:

- Acknowledge the customer's frustration
- Apologize sincerely
- Provide a solution or next steps
- Maintain a professional yet empathetic tone

Test Case: "My order is 2 weeks late and I'm extremely upset!"`,
    difficulty: 'Easy',
    expectedOutput: 'A professional, empathetic response with solution',
  },
  {
    id: '2',
    title: 'Code Explainer',
    description: `Write a prompt that makes an AI explain complex code in simple terms for beginners. The explanation should:

- Break down the logic step by step
- Use analogies where helpful
- Avoid technical jargon
- Be clear and concise

Test Code: "const result = arr.filter(x => x > 5).map(x => x * 2);"`,
    difficulty: 'Medium',
    expectedOutput: 'Clear, beginner-friendly code explanation',
  },
  {
    id: '3',
    title: 'JSON Data Extractor',
    description: `Create a prompt that makes an AI extract specific fields from unstructured text and output valid JSON. Requirements:

- Extract: name, email, phone, company
- Handle missing fields gracefully
- Output valid JSON format
- No extra commentary

Test Input: "John Smith works at TechCorp. Reach him at john@techcorp.com or 555-0123."`,
    difficulty: 'Hard',
    expectedOutput: 'Valid JSON with extracted fields',
  },
];

export const mockAnalytics: AnalyticsData = {
  totalPrompts: 47,
  successRate: 78,
  averageScore: 82,
  improvement: 23,
  scoreHistory: [
    { date: '2026-03-01', score: 65 },
    { date: '2026-03-08', score: 70 },
    { date: '2026-03-15', score: 73 },
    { date: '2026-03-22', score: 78 },
    { date: '2026-03-29', score: 82 },
    { date: '2026-04-05', score: 85 },
  ],
  categoryBreakdown: [
    { category: 'Clarity', score: 85 },
    { category: 'Specificity', score: 78 },
    { category: 'Context', score: 82 },
    { category: 'Constraints', score: 80 },
    { category: 'Format', score: 88 },
  ],
};
