interface KPICardProps {
  title: string
  value: string
}

export function KPICard({ title, value }: KPICardProps) {
  return (
    <div className="glass rounded-lg p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{title}</div>
      <div className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{value}</div>
    </div>
  )
}

