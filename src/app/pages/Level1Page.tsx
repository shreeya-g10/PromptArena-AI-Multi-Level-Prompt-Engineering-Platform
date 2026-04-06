import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { mockProblems } from '../utils/mockData';

export function Level1Page() {
  const [selectedProblem] = useState(mockProblems[0]);
  const [prompt, setPrompt] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setScore(null);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock output based on the problem
    const mockOutput = generateMockResponse(selectedProblem.id, prompt);
    setOutput(mockOutput);

    // Calculate mock score
    const calculatedScore = Math.floor(Math.random() * 30) + 70; // 70-100
    setScore(calculatedScore);

    setIsLoading(false);
  };

  const generateMockResponse = (problemId: string, userPrompt: string) => {
    if (problemId === '1') {
      return `Dear Valued Customer,

I sincerely apologize for the delay with your order. I understand how frustrating it must be to wait 2 weeks beyond the expected delivery date, and your concerns are completely valid.

I've immediately escalated your case to our shipping department for priority review. Here's what I can do for you right now:

1. I'll personally track your order and provide you with an update within 24 hours
2. We'll expedite the shipping at no additional cost once we locate your package
3. As an apology, I'm applying a 20% discount to your next order

Your order number is being flagged as urgent. Is there anything else I can help you with today?

Best regards,
Customer Support Team`;
    } else if (problemId === '2') {
      return `Let me break down this code in simple terms!

Think of this code like a factory assembly line with two stations:

**Station 1 - The Filter (arr.filter(x => x > 5))**
Imagine you have a bunch of boxes on a conveyor belt (the array). At this station, a worker checks each box and only lets through boxes with numbers greater than 5. All smaller numbers get removed.

Example: [3, 7, 2, 9, 5, 8] → becomes [7, 9, 8]

**Station 2 - The Map (map(x => x * 2))**
At this station, another worker takes each number that made it through and doubles it.

Example: [7, 9, 8] → becomes [14, 18, 16]

**Final Result**: You started with mixed numbers, filtered out the small ones, and doubled what remained!`;
    } else {
      return `{
  "name": "John Smith",
  "email": "john@techcorp.com",
  "phone": "555-0123",
  "company": "TechCorp"
}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-lg text-sm font-medium">
              Level 1
            </div>
            <div
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                selectedProblem.difficulty === 'Easy'
                  ? 'bg-green-500/20 text-green-500'
                  : selectedProblem.difficulty === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {selectedProblem.difficulty}
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {selectedProblem.title}
          </h1>
          <p className="text-muted-foreground">
            Craft an effective prompt to solve this challenge
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Statement */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
            <div className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-line leading-relaxed">
              {selectedProblem.description}
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Output</h2>
              {score !== null && (
                <div className="flex items-center gap-2">
                  {score >= 80 ? (
                    <CheckCircle className="size-5 text-green-500" />
                  ) : (
                    <XCircle className="size-5 text-yellow-500" />
                  )}
                  <span className="font-semibold text-lg">
                    Score: {score}/100
                  </span>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <Loader2 className="size-12 text-violet-500 animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Processing your prompt...
                </p>
              </div>
            ) : output ? (
              <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                {output}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                Submit a prompt to see the output
              </div>
            )}
          </div>
        </div>

        {/* Prompt Input Section */}
        <div className="mt-6 bg-card border border-border rounded-xl p-6">
          <label htmlFor="prompt" className="block text-lg font-semibold mb-3">
            Your Prompt
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt here... Be clear, specific, and provide context."
            className="w-full h-40 bg-accent border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {prompt.length} characters
            </p>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !prompt.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="size-5" />
                  Submit Prompt
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
