"use client"

import { useState, useEffect } from "react"
import { StatCard } from "@/components/StatCard"
import { Skeleton } from "@/components/ui/skeleton"
import type { SpotifyRecentlyPlayed } from "@/lib/spotify"

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

function groupByHour(items: SpotifyRecentlyPlayed[]): { hour: number; count: number }[] {
  const counts: Record<number, number> = {}
  for (const item of items) {
    const h = new Date(item.played_at).getHours()
    counts[h] = (counts[h] ?? 0) + 1
  }
  return Array.from({ length: 24 }, (_, i) => ({ hour: i, count: counts[i] ?? 0 }))
}

function groupByDay(items: SpotifyRecentlyPlayed[]): { day: number; count: number }[] {
  const counts: Record<number, number> = {}
  for (const item of items) {
    const d = new Date(item.played_at).getDay()
    counts[d] = (counts[d] ?? 0) + 1
  }
  return Array.from({ length: 7 }, (_, i) => ({ day: i, count: counts[i] ?? 0 }))
}

function formatHour(h: number): string {
  if (h === 0) return "12am"
  if (h < 12) return `${h}am`
  if (h === 12) return "12pm"
  return `${h - 12}pm`
}

export default function HistoryPage() {
  const [items, setItems] = useState<SpotifyRecentlyPlayed[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/spotify/recently-played")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data)
        else setError(data.error ?? "Error al cargar historial")
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-48 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive">
          {error}
        </div>
      </div>
    )
  }

  const byHour = groupByHour(items)
  const byDay = groupByDay(items)
  const maxHour = Math.max(...byHour.map((h) => h.count), 1)
  const maxDay = Math.max(...byDay.map((d) => d.count), 1)

  const peakHour = byHour.reduce((a, b) => (b.count > a.count ? b : a), byHour[0])
  const peakDay = byDay.reduce((a, b) => (b.count > a.count ? b : a), byDay[0])

  const uniqueArtists = new Set(items.flatMap((i) => i.track.artists.map((a) => a.id)))
  const totalMs = items.reduce((s, i) => s + i.track.duration_ms, 0)
  const minutes = Math.round(totalMs / 60000)

  const trackCounts: Record<string, { name: string; artist: string; count: number }> = {}
  for (const item of items) {
    const id = item.track.id
    trackCounts[id] = {
      name: item.track.name,
      artist: item.track.artists[0]?.name ?? "",
      count: (trackCounts[id]?.count ?? 0) + 1,
    }
  }
  const topTrack = Object.values(trackCounts).sort((a, b) => b.count - a.count)[0]

  const GRADIENT_COLORS = [
    "from-primary to-emerald-400",
    "from-purple-500 to-pink-500",
    "from-blue-500 to-cyan-400",
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1">🕐 Historial Reciente</h1>
        <p className="text-muted-foreground text-sm">
          Basado en tus últimas 50 canciones escuchadas
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="⏱ Minutos" value={minutes} sub="estimado total" accent />
        <StatCard label="🎤 Artistas únicos" value={uniqueArtists.size} />
        <StatCard label="⏰ Hora pico" value={formatHour(peakHour.hour)} sub={`${peakHour.count} canciones`} />
        <StatCard label="📅 Día pico" value={DAYS[peakDay.day]} sub={`${peakDay.count} canciones`} />
      </div>

      {topTrack && topTrack.count > 1 && (
        <div className="bg-gradient-to-br from-primary/10 to-card border border-primary/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">🔥 Más repetida</p>
          <p className="font-bold">{topTrack.name}</p>
          <p className="text-sm text-muted-foreground">{topTrack.artist} · {topTrack.count}x</p>
        </div>
      )}

      {/* Heatmap by hour */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <h2 className="font-bold mb-4">Actividad por hora del día</h2>
        <div className="flex items-end gap-0.5 h-24">
          {byHour.map((h) => (
            <div key={h.hour} className="flex-1 flex flex-col items-center gap-1 group">
              <div
                className="w-full rounded-t bg-gradient-to-t from-primary to-emerald-400 transition-all"
                style={{ height: `${Math.max((h.count / maxHour) * 80, h.count > 0 ? 4 : 0)}px` }}
                title={`${formatHour(h.hour)}: ${h.count}`}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>12am</span>
          <span>6am</span>
          <span>12pm</span>
          <span>6pm</span>
          <span>11pm</span>
        </div>
      </div>

      {/* By day of week */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <h2 className="font-bold mb-4">Actividad por día de la semana</h2>
        <div className="space-y-2">
          {byDay.map((d, i) => (
            <div key={d.day} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-7 shrink-0">{DAYS[d.day]}</span>
              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${GRADIENT_COLORS[i % GRADIENT_COLORS.length]} transition-all`}
                  style={{ width: `${(d.count / maxDay) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground w-4 text-right">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
