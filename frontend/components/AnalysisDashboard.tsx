'use client'

import { useState } from 'react'
import { Upload, AlertCircle, CheckCircle } from 'lucide-react'
import axios from 'axios'
import { KPICard } from './KPICard'
import { InsightsList } from './InsightsList'
import { AnalysisChart } from './AnalysisChart'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AnalysisResult {
  scores_moyens: [string, number][]
  sentiments: Record<string, number>
  keywords: string[]
  insights: string[]
  total_evaluations: number
  satisfaction_moyenne: number
  taux_positifs: number | null
}

export function AnalysisDashboard() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError('')
      setResults(null)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a CSV file')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post<AnalysisResult>(
        `${API_URL}/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      setResults(response.data)
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Analyse Automatisée des Évaluations
        </h2>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {file ? file.name : 'Choisir un fichier CSV'}
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 rounded-md font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Analyse en cours...' : 'Analyser'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>

      {results && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Satisfaction Moyenne"
              value={`${results.satisfaction_moyenne.toFixed(2)}/5`}
            />
            <KPICard
              title="Nb Évaluations"
              value={results.total_evaluations.toString()}
            />
            <KPICard
              title="Taux de Positifs"
              value={results.taux_positifs?.toString() || '0'}
            />
          </div>

          {/* Insights */}
          {results.insights.length > 0 && (
            <InsightsList insights={results.insights} />
          )}

          {/* Charts */}
          <AnalysisChart results={results} />
        </>
      )}
    </div>
  )
}

