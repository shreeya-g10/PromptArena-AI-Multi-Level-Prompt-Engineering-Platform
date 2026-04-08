import { useEffect, useMemo, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Send, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { apiClient } from '../services/api';
import { authService } from '../utils/auth';
import type { CodingProblem, Level1Response } from '../services/contracts';
import { setLevelCompleted } from '../utils/progress';

export function Level1Page() {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblemId, setSelectedProblemId] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<Level1Response | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isProblemsLoading, setIsProblemsLoading] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [lowScoreAttempts, setLowScoreAttempts] = useState(0);

  useEffect(() => {
    const loadProblems = async () => {
      try {
        const data = await apiClient.fetchProblems();
        const normalized = Array.isArray(data) ? data : [];
        setProblems(normalized);
        setSelectedProblemId(normalized[0]?.problem_id || '');
      } catch {
        setError('Unable to load problems.');
      } finally {
        setIsProblemsLoading(false);
      }
    };
    void loadProblems();
  }, []);

  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.problem_id === selectedProblemId) || null,
    [problems, selectedProblemId]
  );

  const handleSubmit = async () => {
    if (!prompt.trim() || !selectedProblem) return;

    setIsLoading(true);
    setError('');

    try {
      const currentUser = authService.getCurrentUser();
      const nextAttempts = attempts + 1;
      const response = await apiClient.submitLevel1Prompt({
        userId: currentUser?.id || 'guest-user',
        problemId: selectedProblem.problem_id,
        promptText: prompt,
        language: selectedProblem.language,
        attempts: nextAttempts,
      });
      setResult(response);
      setAttempts(nextAttempts);
      setLowScoreAttempts((count) =>
        response.structureScore < 4 ? count + 1 : 0
      );
      if (response.reliabilityScore >= 80) {
        setLevelCompleted(1);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to evaluate prompt. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const safeTestCases = selectedProblem?.test_cases ?? [];

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
                selectedProblem?.difficulty === 'Easy'
                  ? 'bg-green-500/20 text-green-500'
                  : selectedProblem?.difficulty === 'Medium'
                  ? 'bg-yellow-500/20 text-yellow-500'
                  : 'bg-red-500/20 text-red-500'
              }`}
            >
              {selectedProblem?.difficulty || 'N/A'}
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {selectedProblem?.title || 'Select a problem'}
          </h1>
          <p className="text-muted-foreground">
            Craft an effective prompt to solve this challenge
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
        setPrompt('');
        setResult(null);
        setAttempts(0);
        setLowScoreAttempts(0);
      }}
      className={`cursor-pointer p-4 rounded-xl border transition-all
        ${
          selectedProblemId === problem.problem_id
            ? "border-violet-500 bg-violet-500/10"
            : "border-border bg-card hover:border-violet-400"
        }`}
    >
      <div className="flex justify-between items-center mb-2">
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
            <div className="mt-3 text-sm text-muted-foreground">
              <p className="text-foreground mb-1">Expected Output: {selectedProblem.expected_output}</p>
              <details className="bg-accent/40 border border-border rounded-lg p-3">
                <summary className="cursor-pointer text-foreground font-medium">View Test Cases</summary>
                <ul className="mt-2 space-y-1">
                  {safeTestCases.map((testCase, index) => (
                    <li key={index}>
                      Input: <span className="text-foreground">{testCase.input}</span> {'->'} Expected:{' '}
                      <span className="text-foreground">{testCase.expectedOutput}</span>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Problem Statement */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
            <div className="prose prose-sm max-w-none text-foreground/80 whitespace-pre-line leading-relaxed">
              {selectedProblem?.description ||
                (isProblemsLoading
                  ? 'Loading problem...'
                  : 'Select a problem to view its statement.')}
            </div>
          </div>

          {/* Right Panel - Output */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Output</h2>
              {result && (
                <div className="flex items-center gap-2">
                  {result.reliabilityScore >= 80 ? (
                    <CheckCircle className="size-5 text-green-500" />
                  ) : (
                    <XCircle className="size-5 text-yellow-500" />
                  )}
                  <span className="font-semibold text-lg text-foreground">
                    Reliability: {result.reliabilityScore}%
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
            ) : error ? (
              <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 text-sm text-destructive">
                {error}
              </div>
            ) : result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-accent/50 rounded-lg p-3">
                    Prompt Structure Score: <span className="font-semibold">{result.structureScore}/10</span>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-3">
                    Predicted Success: <span className="font-semibold">{result.successProbability}%</span>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-3">
                    Reliability Score: <span className="font-semibold">{result.reliabilityScore}%</span>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-3">
                    Effectiveness Score: <span className="font-semibold">{result.effectivenessScore}%</span>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-3 sm:col-span-2">
                    Test Cases Passed:{' '}
                    <span className="font-semibold">
                      {result.testCasesPassed}/{result.totalTestCases}
                    </span>
                  </div>
                </div>

                <div className="bg-accent/50 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {result.generatedCode}
                </div>

                <p className="text-sm text-muted-foreground">{result.suggestion}</p>

                {(attempts >= 3 || lowScoreAttempts >= 2) && (
                  <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4 text-sm">
                    <p className="font-semibold text-foreground mb-2">Prompt Template Builder</p>
                    <p className="text-muted-foreground">Language: ___ | Input: ___ | Output: ___ | Constraints: ___</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                Submit a prompt to see the output
              </div>
            )}
          </div>
        </div>

        {/* Prompt Input Section */}
        <div className="mt-6 bg-card border border-border rounded-xl p-6 text-card-foreground">
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
