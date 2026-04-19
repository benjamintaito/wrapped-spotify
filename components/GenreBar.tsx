interface GenreBarProps {
  genre: string
  count: number
  max: number
  rank: number
}

const GRADIENT_COLORS = [
  "from-primary to-emerald-400",
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-400",
  "from-orange-500 to-yellow-400",
  "from-rose-500 to-pink-400",
  "from-indigo-500 to-violet-400",
  "from-teal-500 to-green-400",
  "from-amber-500 to-orange-400",
]

export function GenreBar({ genre, count, max, rank }: GenreBarProps) {
  const pct = Math.round((count / max) * 100)
  const gradient = GRADIENT_COLORS[(rank - 1) % GRADIENT_COLORS.length]

  return (
    <div className="flex items-center gap-3 group">
      <span className="w-6 text-sm font-black text-muted-foreground shrink-0 text-center">
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium capitalize truncate">{genre}</span>
          <span className="text-xs text-muted-foreground ml-2 shrink-0">{count} artistas</span>
        </div>
        <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  )
}
