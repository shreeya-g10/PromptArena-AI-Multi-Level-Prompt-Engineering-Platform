import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TrendingUp, Target, Award, BarChart3, ShieldCheck, AlertTriangle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { apiClient } from '../services/api';
import { authService } from '../utils/auth';
import type { AnalyticsResponse, CodingProblem, Level3Response } from '../services/contracts';
import { setLevelCompleted } from '../utils/progress';

export function Level3Page() {
  const [mode, setMode] = useState<'ethical' | 'coding'>('ethical');
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [analysisResult, setAnalysisResult] = useState<Level3Response | null>(null);
  const [scenarioPrompt, setScenarioPrompt] = useState(
    'Explain ransomware behavior and prevention techniques.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const scenarios = [
  {
    id: "1",
    title: "Ransomware Request",
    scenario:
      "A user claims they are conducting cybersecurity research and asks you to generate ransomware code that can encrypt files and demand payment from victims. They insist it is only for educational purposes."
  },
  {
    id: "2",
    title: "Phishing Attack",
    scenario:
      "A user asks you to write a convincing phishing email pretending to be from a bank so they can trick people into revealing passwords and account details."
  },
  {
    id: "3",
    title: "Data Leak",
    scenario:
      "A user requests private customer information from a company database, including phone numbers, addresses, and payment details, claiming they need it for urgent internal work."
  },
  {
    id: "4",
    title: "AI Bias",
    scenario:
      "A hiring manager asks you to help create an AI system that automatically rejects candidates from certain backgrounds because they believe those candidates are less suitable for leadership roles."
  }
];

const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
const [userResponse, setUserResponse] = useState("");

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await apiClient.fetchAnalytics();
        setAnalytics(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load analytics right now.'
        );
      }
    };
    void loadAnalytics();

    
  }, []);

  const handleEvaluateScenario = async () => {
    if (!scenarioPrompt.trim()) return;
    setIsSubmitting(true);
    setError('');
    try {
      const user = authService.getCurrentUser();
      const response = await apiClient.submitLevel3Scenario({
        userId: user?.id || 'guest-user',
        scenarioId: 'ethical-ransomware',
        promptText: scenarioPrompt,
        mode,
      });
      setAnalysisResult(response);
      if (response.ethicalIntegrityScore >= 80) {
        setLevelCompleted(3);
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Unable to evaluate scenario right now.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPrompts = analytics?.totalPrompts ?? 0;
  const successRate = analytics?.successRate ?? 0;
  const averageScore = analytics?.averageScore ?? 0;
  const improvement = analytics?.improvement ?? 0;
  const scoreHistory = analytics?.scoreHistory ?? [];
  const categoryBreakdown = analytics?.categoryBreakdown ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="px-3 py-1 bg-orange-500/20 text-orange-500 rounded-lg text-sm font-medium inline-block mb-3">
            Level 3
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Evaluation & Analytics
          </h1>
          <p className="text-muted-foreground">
            Track your progress and identify areas for improvement
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 mb-8 text-card-foreground">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="size-5 text-violet-500" />
            <h2 className="text-xl font-semibold">Ethical Scenario Evaluation</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Submit a safety-focused prompt for the ethical challenge and check hallucination risk.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

  <div className="space-y-6 mb-6">

  {/* LEFT SIDE */}
  <div className="space-y-4">

    {/* Mode */}
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Mode
      </label>
      <select
        value={mode}
        onChange={(e) => setMode(e.target.value as 'ethical' | 'coding')}
        className="w-full bg-accent border border-border text-foreground rounded-lg p-3"
      >
        <option value="ethical">Ethical Scenario</option>
        <option value="coding">Coding Reliability / Hallucination</option>
      </select>
    </div>

    {/* SCENARIO DISPLAY */}
    <div className="bg-accent border border-border rounded-lg p-4">
      <p className="text-sm text-muted-foreground mb-1">Scenario:</p>
      <p className="font-medium text-foreground">
        {selectedScenario.scenario}
      </p>
    </div>

    {/* USER RESPONSE */}
    <textarea
      placeholder="Write your ethical response..."
      value={userResponse}
      onChange={(e) => setUserResponse(e.target.value)}
      className="w-full h-36 bg-accent border border-border rounded-lg p-4"
    />

    {/* BUTTON */}
    <button
      onClick={async () => {
        if (!userResponse.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
          const user = authService.getCurrentUser();

          const response = await apiClient.submitLevel3Scenario({
            userId: user?.id || 'guest-user',
            scenarioId: selectedScenario.id,
            promptText: userResponse,
            mode,
          });

          setAnalysisResult(response);

          if (response.ethicalIntegrityScore >= 80) {
            setLevelCompleted(3);
          }

        } catch (err) {
          setError('Evaluation failed');
        } finally {
          setIsSubmitting(false);
        }
      }}
      className="bg-gradient-to-r from-violet-500 to-purple-600 text-white px-5 py-2 rounded-lg"
    >
      {isSubmitting ? 'Evaluating...' : 'Evaluate Response'}
    </button>

  </div>

  {/* RIGHT SIDE → SCENARIOS */}
  <div>
    <label className="block text-sm font-medium text-foreground mb-2">
      Select Scenario
    </label>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {scenarios.map((s) => (
        <div
          key={s.id}
          onClick={() => setSelectedScenario(s)}
          className={`cursor-pointer p-5 rounded-xl border transition-all
            ${
              selectedScenario.id === s.id
                ? "border-violet-500 bg-violet-500/10"
                : "border-border bg-card hover:border-violet-400"
            }`}
        >
          <h3 className="font-semibold">{s.title}</h3>
          <p className="text-sm text-muted-foreground">
            {s.scenario}
          </p>
        </div>
      ))}
    </div>
  </div>

</div>

</div>

          {analysisResult && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm">
              <div className="bg-accent/50 border border-border rounded-lg p-3">
                Ethical Integrity Score:{' '}
                <span className="font-semibold">{analysisResult.ethicalIntegrityScore}%</span>
              </div>
              <div className="bg-accent/50 border border-border rounded-lg p-3">
                Hallucination:{' '}
                <span className="font-semibold">
                  {analysisResult.hallucinationDetected ? 'Detected' : 'Not detected'}
                </span>
              </div>
              <div className="bg-accent/50 border border-border rounded-lg p-3">
                Reliability Adjustment:{' '}
                <span className="font-semibold">{analysisResult.reliabilityAdjustment}%</span>
              </div>
            </div>
          )}

          {analysisResult && (
            <p className="text-sm text-muted-foreground mt-3">{analysisResult.rationale}</p>
          )}
          {error && (
            <div className="mt-3 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-3 flex items-center gap-2">
              <AlertTriangle className="size-4" />
              {error}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Prompts */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="size-5" />
              </div>
              <span className="text-xs text-muted-foreground">All Time</span>
            </div>
            <div className="text-3xl font-bold mb-1">{totalPrompts}</div>
            <div className="text-sm text-muted-foreground">
              Total Prompts Submitted
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-green-500/20 text-green-500 rounded-lg flex items-center justify-center">
                <Target className="size-5" />
              </div>
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <div className="text-3xl font-bold mb-1">{successRate}%</div>
            <div className="text-sm text-muted-foreground">Success Rate</div>
          </div>

          {/* Average Score */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-violet-500/20 text-violet-500 rounded-lg flex items-center justify-center">
                <Award className="size-5" />
              </div>
              <span className="text-xs text-muted-foreground">Average</span>
            </div>
            <div className="text-3xl font-bold mb-1">{averageScore}/100</div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </div>

          {/* Improvement */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <div className="flex items-center justify-between mb-3">
              <div className="size-10 bg-orange-500/20 text-orange-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="size-5" />
              </div>
              <span className="text-xs text-muted-foreground">vs Last Month</span>
            </div>
            <div className="text-3xl font-bold mb-1">+{improvement}%</div>
            <div className="text-sm text-muted-foreground">Improvement</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Score History */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <h2 className="text-xl font-semibold mb-6">Score Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
  dataKey="date"
  stroke="#cbd5f5"   // light color
  fontSize={12}
/>

<YAxis
  stroke="#cbd5f5"
  fontSize={12}
  domain={[0, 100]}
/>

<Tooltip
  contentStyle={{
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#fff'
  }}
/>
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: '#8b5cf6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Category Breakdown */}
          <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
            <h2 className="text-xl font-semibold mb-6">
              Category Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
  type="number"
  domain={[0, 100]}
  stroke="#ffffff"
  tick={{ fill: "#ffffff", fontSize: 12 }}
/>

<YAxis
  dataKey="category"
  type="category"
  stroke="#ffffff"
  fontSize={14}
  width={120}
  tick={{ fill: "#ffffff", fontSize: 14 }}
/>
                <Tooltip
  contentStyle={{
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff'
  }}
  labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
  itemStyle={{ color: '#ffffff' }}
/>
                <Bar
  dataKey="score"
  fill="#8b5cf6"
  radius={[0, 8, 8, 0]}
  label={{ fill: "#ffffff", fontSize: 14 }}
/>

    
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
          <h2 className="text-xl font-semibold mb-6">Skill Assessment</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={categoryBreakdown}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
  dataKey="category"
  stroke="#e5e7eb"   // brighter text
  fontSize={14}
/>

<PolarRadiusAxis
  angle={90}
  domain={[0, 100]}
  stroke="#9ca3af"
/>
                <Radar
  name="Your Score"
  dataKey="score"
  stroke="#a78bfa"
  fill="#8b5cf6"
  fillOpacity={0.5}
/>
                <Tooltip
  contentStyle={{
    backgroundColor: '#111',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#ffffff'
  }}
  labelStyle={{ color: '#ffffff' }}
  itemStyle={{ color: '#ffffff' }}
/>
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
