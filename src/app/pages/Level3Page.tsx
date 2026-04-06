import { Navbar } from '../components/Navbar';
import { TrendingUp, Target, Award, BarChart3 } from 'lucide-react';
import { mockAnalytics } from '../utils/mockData';
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

export function Level3Page() {
  const { totalPrompts, successRate, averageScore, improvement, scoreHistory, categoryBreakdown } =
    mockAnalytics;

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Prompts */}
          <div className="bg-card border border-border rounded-xl p-6">
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
          <div className="bg-card border border-border rounded-xl p-6">
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
          <div className="bg-card border border-border rounded-xl p-6">
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
          <div className="bg-card border border-border rounded-xl p-6">
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
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">Score Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
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
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-6">
              Category Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="category" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">Skill Assessment</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={categoryBreakdown}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis
                  dataKey="category"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={14}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
                <Radar
                  name="Your Score"
                  dataKey="score"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
