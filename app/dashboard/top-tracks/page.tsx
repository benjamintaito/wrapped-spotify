"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrackCard } from "@/components/TrackCard"
import { TracksSkeleton } from "@/components/TracksSkeleton"
import type { SpotifyTrack, TimeRange } from "@/lib/spotify"

const RANGES: { value: TimeRange; label: string }[] = [
  { value: "short_term", label: "4 semanas" },
  { value: "medium_term", label: "6 meses" },
  { value: "long_term", label: "Todo el tiempo" },
]

export default function TopTracksPage() {
  const [range, setRange] = useState<TimeRange>("medium_term")
  const [tracks, setTracks] = useState<SpotifyTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/spotify/top-tracks?time_range=${range}&limit=10`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setTracks(data)
        else setError(data.error ?? "Error al cargar canciones")
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false))
  }, [range])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1">🎵 Top Canciones</h1>
        <p className="text-muted-foreground text-sm">Las canciones que más escuchaste en cada período</p>
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
          <TracksSkeleton count={10} />
        ) : (
          tracks.map((t, i) => <TrackCard key={t.id} track={t} rank={i + 1} />)
        )}
      </div>

      {!loading && tracks.length === 0 && !error && (
        <p className="text-center text-muted-foreground text-sm py-8">
          Sin datos para este período. Escucha más música en Spotify primero.
        </p>
      )}
    </div>
  )
}
