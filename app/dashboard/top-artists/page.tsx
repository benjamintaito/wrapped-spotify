"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArtistCard } from "@/components/ArtistCard"
import { ArtistsSkeleton } from "@/components/TracksSkeleton"
import { useApi } from "@/lib/useApi"
import type { SpotifyArtist, TimeRange } from "@/lib/spotify"

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "4 semanas" },
  { value: "medium_term", label: "6 meses" },
  { value: "long_term", label: "Todo el tiempo" },
]

export default function TopArtistsPage() {
  const [range, setRange] = useState<TimeRange>("medium_term")
  const { data, error, loading } = useApi<SpotifyArtist[]>(
    `/api/spotify/top-artists?time_range=${range}&limit=10`,
    "Error al cargar artistas"
  )
  const artists = data ?? []

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1">🎤 Top Artistas</h1>
        <p className="text-muted-foreground text-sm">Los artistas que dominaron tu reproductor</p>
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

      <div className="bg-card border border-border rounded-xl divide-y divide-border">
        {loading ? (
          <ArtistsSkeleton count={10} />
        ) : (
          artists.map((a, i) => <ArtistCard key={a.id} artist={a} rank={i + 1} />)
        )}
      </div>

      {!loading && artists.length === 0 && !error && (
        <p className="text-center text-muted-foreground text-sm py-8">
          Sin datos para este período. Escucha más música en Spotify primero.
        </p>
      )}
    </div>
  )
}
