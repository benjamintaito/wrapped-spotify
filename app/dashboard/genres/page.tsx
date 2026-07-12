"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GenreBar } from "@/components/GenreBar"
import { Skeleton } from "@/components/ui/skeleton"
import { useApi } from "@/lib/useApi"
import { computeTopGenres, type SpotifyArtist, type TimeRange } from "@/lib/spotify"

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "4 semanas" },
  { value: "medium_term", label: "6 meses" },
  { value: "long_term", label: "Todo el tiempo" },
]

export default function GenresPage() {
  const [range, setRange] = useState<TimeRange>("medium_term")
  const { data, error, loading } = useApi<SpotifyArtist[]>(
    `/api/spotify/top-artists?time_range=${range}&limit=20`,
    "Error al cargar géneros"
  )
  const genres = data ? computeTopGenres(data).slice(0, 15) : []
  const max = genres[0]?.count ?? 1

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1">🎸 Top Géneros</h1>
        <p className="text-muted-foreground text-sm">
          Derivado de los géneros de tus artistas favoritos
        </p>
      </div>

      <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)}>
        <TabsList className="w-full">
          {RANGES.map((r) => (
            <TabsTrigger key={r.value} value={r.value} className="flex-1 text-xs md:text-sm">
              {r.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-4 md:p-6 space-y-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-2.5 rounded-full" />
                </div>
              </div>
            ))
          : genres.map((g, i) => (
              <GenreBar key={g.genre} genre={g.genre} count={g.count} max={max} rank={i + 1} />
            ))}
      </div>

      {!loading && genres.length === 0 && !error && (
        <p className="text-center text-muted-foreground text-sm py-8">
          Sin géneros disponibles. Necesitas tener artistas favoritos con géneros en Spotify.
        </p>
      )}
    </div>
  )
}
