import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { apiClient } from '../services/api';
import { authService } from '../utils/auth';
import type { CodingProblem, Level2Response, PromptVersion } from '../services/contracts';
import { setLevelCompleted } from '../utils/progress';
import { level2Problems } from "../data/problems";
import { evaluatePrompt } from "../utils";

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
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState(suggestions[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [result, setResult] = useState<Level2Response | null>(null);
  const [versionMap, setVersionMap] = useState<Record<string, PromptVersion[]>>({});
  const [attemptMap, setAttemptMap] = useState<Record<string, number>>({});
  const [localAttempts, setLocalAttempts] = useState<any[]>([]);

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProblems = async () => {
      try {
        setProblems(level2Problems);
setSelectedProblemId(level2Problems[0]?.problem_id || '');
      } catch {
        setError('Unable to load problems.');
      }
    };
    void loadProblems();
  }, []);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.problem_id === selectedProblemId) || null,
    [problems, selectedProblemId]
  );

  const currentAttempts = attemptMap[selectedProblemId] || 0;

  const handleOptimize = async () => {
  if (!customPrompt.trim() || !selectedProblem) return;

  setIsOptimizing(true);
  setError("");

  try {
    const currentUser = authService.getCurrentUser();

    const res = await fetch("http://localhost:3000/api/level2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: currentUser?.id || "guest-user",
        prompt: customPrompt,
        problem: selectedProblem,

        // 🔥 TEMP until AI integrated
        generatedCode: "print('test')",
      }),
    });

    const data = await res.json();

    console.log("Level2 API Response:", data);

    // ✅ SET BACKEND RESPONSE
    setResult({
      ...data,
      newVersion: {
        version: (versionMap[selectedProblemId]?.length || 0) + 1,
      },
    });

    // 🔥 KEEP YOUR LOCAL LOGIC (NO CONFLICT)
    const newAttempt = {
      prompt: customPrompt,
      score: data.reliabilityScore / 10,
      timestamp: new Date(),
    };

    setLocalAttempts((prev) => [...prev, newAttempt]);

    setAttemptMap((prev) => ({
      ...prev,
      [selectedProblemId]: (prev[selectedProblemId] || 0) + 1,
    }));

    if (data.reliabilityScore >= 80) {
      setLevelCompleted(2);
    }

  } catch (err: any) {
    console.error(err);
    setError("Something went wrong");
  } finally {
    setIsOptimizing(false);
  }
};
  // 🔥 FRONTEND EVOLUTION LOGIC
const evolution = localAttempts.map((a, index) => ({
  version: index + 1,
  score: a.score
}));

// 🔥 EFFICIENCY
const success = result ? result.reliabilityScore >= 80 : false;
const efficiency =
  success && localAttempts.length > 0
    ? Math.round(100 / localAttempts.length)
    : null;

// 🔥 IMPROVEMENT FEEDBACK (simple logic)
let improvementFeedback = [];
if (localAttempts.length >= 2) {
  const prev = localAttempts[localAttempts.length - 2].prompt;
  const curr = localAttempts[localAttempts.length - 1].prompt;

  if (curr.length > prev.length) improvementFeedback.push("Improved prompt detail");
  if (curr.includes("function")) improvementFeedback.push("Defined function clearly");
  if (curr.includes("input")) improvementFeedback.push("Added input constraints");
}

// 🔥 COMPARISON
const comparison =
  localAttempts.length >= 2
    ? {
        before: localAttempts[0].prompt,
        after: localAttempts[localAttempts.length - 1].prompt,
        improvementPercent: Math.round(
          ((localAttempts[localAttempts.length - 1].prompt.length -
            localAttempts[0].prompt.length) /
            localAttempts[0].prompt.length) * 100
        )
      }
    : null;

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

        <div className="mb-6 bg-card border border-border rounded-xl p-5">
          <label className="block text-sm font-medium text-foreground mb-2">Select Problem</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {problems.map((problem) => (
    <div
      key={problem.problem_id}
      onClick={() => {
        setSelectedProblemId(problem.problem_id);
        setResult(null);
        setCustomPrompt('');
      }}
      className={`cursor-pointer p-6 rounded-xl border transition-all
        ${
          selectedProblemId === problem.problem_id
            ? "border-violet-500 bg-violet-500/10"
            : "border-border bg-card hover:border-violet-400 hover:scale-[1.02]"
        }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-foreground">
          {problem.problem_id}
        </h3>

        <span
          className={`text-xs px-2 py-1 rounded ${
            problem.difficulty === "Easy"
              ? "bg-green-500/20 text-green-500"
              : problem.difficulty === "Medium"
              ? "bg-yellow-500/20 text-yellow-500"
              : "bg-red-500/20 text-red-500"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <p className="text-xl font-bold text-foreground">
        {problem.title}
      </p>
    </div>
  ))}
</div>
          {selectedProblem && (
            <p className="mt-2 text-sm text-muted-foreground">
              {selectedProblem.description}
            </p>
          )}
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
                className={`text-left p-5 rounded-xl border-2 text-card-foreground transition-all ${
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

        {/* Static Educational Sample */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8 text-card-foreground">
          <div className="flex items-center justify-between mb-6 gap-2">
            <h2 className="text-xl font-semibold">Sample Technique Example</h2>
            <span className="text-xs bg-amber-500/15 text-amber-500 border border-amber-500/30 rounded px-2 py-1">
              Static sample - not your selected problem output
            </span>
          </div>

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
        <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
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

            {error && (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                {error}
              </div>
            )}

            {result && (
              <div className="mt-6">
                <label className="block font-medium mb-2">Optimization Result (Your Run)</label>
                {selectedProblem && (
                  <p className="text-sm text-muted-foreground mb-3">
                    Problem: <span className="text-foreground">{selectedProblem.problem_id} - {selectedProblem.title}</span>
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-3">
                  Submitted Prompt: <span className="text-foreground">{customPrompt.slice(0, 140)}{customPrompt.length > 140 ? '...' : ''}</span>
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="bg-accent/50 border border-border rounded-lg p-3">
                    Version: <span className="font-semibold">v{result.newVersion.version}</span>
                  </div>
                  <div className="bg-accent/50 border border-border rounded-lg p-3">
                    Reliability: <span className="font-semibold">{result?.reliabilityScore ?? 0}%</span>
                  </div>
                  {(result.reliabilityScore >= 80 || currentAttempts >= 3) && (
                    <div className="bg-accent/50 border border-border rounded-lg p-3">
                      Efficiency Index: <span className="font-semibold">{result.efficiencyIndex}%</span>
                    </div>
                  )}
                </div>
                {(typeof result.problemRelevanceScore === 'number' || result.relevanceNotes?.length) && (
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm mb-4">
                    <p className="font-semibold text-foreground mb-1">
                      Problem Relevance Score: {result.problemRelevanceScore ?? 0}%
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      {(result.relevanceNotes || []).map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {(result.reliabilityScore >= 80 || currentAttempts >= 3) && (
                  <div className="bg-accent/50 border border-border rounded-lg p-4 whitespace-pre-wrap text-sm mb-4">
                    <p className="font-semibold mb-2 text-foreground">Prompt Comparison</p>
                    <p className="text-muted-foreground mb-2">
                      Improvement: <span className="font-semibold text-green-500">{result.comparison.improvementPercent}%</span>
                    </p>
                    <p className="mb-1"><span className="font-medium">Before:</span> {result.comparison.before}</p>
                    <p><span className="font-medium">After:</span> {result.comparison.after}</p>
                  </div>
                )}

                <div className="bg-card border border-border rounded-lg p-4 mb-4">
                  <p className="font-semibold mb-2">Improvement Feedback</p>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {result.feedback.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="font-semibold mb-2">Prompt Evolution Timeline</p>
                  <div className="space-y-2">
                    {result?.evolutionHistory?.map((version: any) => (
                      <div
                        key={version.version}
                        className="text-sm bg-accent/40 rounded p-2 flex items-center justify-between gap-4"
                      >
                        <span>v{version.version} - Score {version.structureScore ?? version.score}/10</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(version.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* 🔥 LOCAL EVOLUTION (YOUR FEATURE) */}
<div className="bg-card border border-border rounded-lg p-4 mt-4">
  <p className="font-semibold mb-2">Frontend Evolution (Your Logic)</p>
  {evolution.map((e) => (
    <div key={e.version} className="text-sm">
      Version {e.version} → Score {e.score}
    </div>
  ))}
</div>

{/* 🔥 EFFICIENCY */}
{efficiency && (
  <div className="bg-card border border-border rounded-lg p-4 mt-4">
    <p className="font-semibold">Efficiency (Frontend)</p>
    <p>{efficiency}%</p>
  </div>
)}

{/* 🔥 FEEDBACK */}
{improvementFeedback.length > 0 && (
  <div className="bg-card border border-border rounded-lg p-4 mt-4">
    <p className="font-semibold">AI Feedback (Frontend)</p>
    <ul className="list-disc list-inside text-sm">
      {improvementFeedback.map((f, i) => (
        <li key={i}>{f}</li>
      ))}
    </ul>
  </div>
)}

{/* 🤖 AI GENERATED CODE */}
{(result as any)?.aiOutput && (
  <div className="bg-black text-green-400 border border-border rounded-lg p-4 mt-4">
    <p className="font-semibold mb-2">🤖 AI Generated Code</p>

    <pre className="text-sm whitespace-pre-wrap overflow-x-auto">
      {(result as any)?.aiOutput}
    </pre>
  </div>
)}

{/* 🔥 COMPARISON */}
{comparison && (
  <div className="bg-card border border-border rounded-lg p-4 mt-4">
    <p className="font-semibold">Prompt Comparison (Frontend)</p>
    <p>Improvement: {comparison.improvementPercent}%</p>
    <p><b>Before:</b> {comparison.before}</p>
    <p><b>After:</b> {comparison.after}</p>
  </div>
)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
