import { AlertCircle, CheckCircle } from 'lucide-react'

interface InsightsListProps {
  insights: string[]
}

export function InsightsList({ insights }: InsightsListProps) {
  return (
    <div className="glass rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
        💡 Insights IA détectés
      </h3>
      <ul className="space-y-2">
        {insights.map((insight, index) => {
          const isPositive = insight.includes('SUCCÈS')
          return (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300"
            >
              {isPositive ? (
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
              )}
              <span>{insight}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

