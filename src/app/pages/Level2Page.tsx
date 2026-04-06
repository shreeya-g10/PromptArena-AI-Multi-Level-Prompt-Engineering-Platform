import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

interface PromptSuggestion {
  title: string;
  description: string;
  before: string;
  after: string;
  improvement: string;
}

const suggestions: PromptSuggestion[] = [
  {
    title: 'Add Context',
    description: 'Provide background information to improve accuracy',
    before: 'Write a product description.',
    after:
      'Write a compelling product description for a premium noise-cancelling headphone targeted at remote workers. Highlight comfort, battery life, and audio quality. Keep it under 100 words.',
    improvement: '+35% accuracy',
  },
  {
    title: 'Specify Format',
    description: 'Define the exact output format you need',
    before: 'Explain how photosynthesis works.',
    after:
      'Explain how photosynthesis works using: 1) A one-sentence summary, 2) Three key steps in bullet points, 3) One real-world application. Write for a 10-year-old audience.',
    improvement: '+42% clarity',
  },
  {
    title: 'Add Constraints',
    description: 'Set boundaries to guide the AI response',
    before: 'Generate creative names for my app.',
    after:
      'Generate 5 creative names for a fitness tracking app. Requirements: 1) Easy to pronounce, 2) Available as .com domain, 3) Under 10 letters, 4) Conveys energy and motivation. Avoid generic terms like "fit" or "track".',
    improvement: '+48% relevance',
  },
];

export function Level2Page() {
  const [selectedSuggestion, setSelectedSuggestion] = useState(suggestions[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    if (!customPrompt.trim()) return;

    setIsOptimizing(true);

    // Simulate AI optimization
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const optimized = `${customPrompt}

**Optimization suggestions applied:**
• Added specific context about the target audience
• Defined clear output format requirements
• Included measurable constraints (word count, structure)
• Specified tone and style preferences
• Added examples of desired outcomes

**Enhanced version:**
${customPrompt} Please structure your response with: 1) A brief introduction, 2) Main points in bullet format, 3) A practical example. Use professional tone, keep it under 200 words, and ensure it's actionable for beginners.`;

    setOptimizedPrompt(optimized);
    setIsOptimizing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="px-3 py-1 bg-violet-500/20 text-violet-500 rounded-lg text-sm font-medium inline-block mb-3">
            Level 2
          </div>
          <h1 className="text-3xl font-bold mb-2">Prompt Optimization</h1>
          <p className="text-muted-foreground">
            Learn how to refine prompts for better AI responses
          </p>
        </div>

        {/* Improvement Techniques */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Optimization Techniques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setSelectedSuggestion(suggestion)}
                className={`text-left p-5 rounded-xl border-2 transition-all ${
                  selectedSuggestion.title === suggestion.title
                    ? 'border-violet-500 bg-violet-500/5'
                    : 'border-border bg-card hover:border-violet-500/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="size-5 text-violet-500" />
                  <h3 className="font-semibold">{suggestion.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {suggestion.description}
                </p>
                <div className="inline-flex items-center gap-1 text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">
                  {suggestion.improvement}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Before & After Comparison */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Before & After</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Before */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-6 bg-red-500/20 text-red-500 rounded flex items-center justify-center text-xs font-bold">
                  ✕
                </div>
                <span className="font-semibold text-red-500">
                  Original Prompt
                </span>
              </div>
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 font-mono text-sm">
                {selectedSuggestion.before}
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
              <ArrowRight className="size-8 text-violet-500" />
            </div>

            {/* After */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="size-6 bg-green-500/20 text-green-500 rounded flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
                <span className="font-semibold text-green-500">
                  Optimized Prompt
                </span>
              </div>
              <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 font-mono text-sm">
                {selectedSuggestion.after}
              </div>
            </div>
          </div>
        </div>

        {/* Try It Yourself */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Try It Yourself</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="custom" className="block font-medium mb-2">
                Your Prompt
              </label>
              <textarea
                id="custom"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter a basic prompt you'd like to optimize..."
                className="w-full h-32 bg-accent border border-border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            <button
              onClick={handleOptimize}
              disabled={isOptimizing || !customPrompt.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-violet-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <>
                  <RefreshCw className="size-5 animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  Optimize Prompt
                </>
              )}
            </button>

            {optimizedPrompt && (
              <div className="mt-6">
                <label className="block font-medium mb-2">
                  Optimized Result
                </label>
                <div className="bg-accent/50 border border-border rounded-lg p-4 whitespace-pre-wrap text-sm">
                  {optimizedPrompt}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
