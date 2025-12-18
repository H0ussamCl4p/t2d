'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface AnalysisChartProps {
  results: {
    scores_moyens: [string, number][]
    sentiments: Record<string, number>
  }
}

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#ef4444']

export function AnalysisChart({ results }: AnalysisChartProps) {
  const scoresData = results.scores_moyens.map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number(value.toFixed(2)),
  }))

  const sentimentsData = Object.entries(results.sentiments).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Scores Chart */}
      <div className="glass rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Scores Moyens
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={scoresData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" className="dark:stroke-zinc-800" />
            <XAxis dataKey="name" stroke="#71717a" />
            <YAxis stroke="#71717a" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background)',
                border: '1px solid var(--border)',
                borderRadius: '0.5rem',
              }}
            />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sentiments Chart */}
      <div className="glass rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Répartition des Sentiments
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sentimentsData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sentimentsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

