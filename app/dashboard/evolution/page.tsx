import { auth } from "@/lib/auth"
import { getTopArtists, type SpotifyArtist } from "@/lib/spotify"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface ArtistRanks {
  artist: SpotifyArtist
  shortRank: number | null
  mediumRank: number | null
  longRank: number | null
}

function getTrend(a: ArtistRanks): { label: string; color: string; emoji: string } {
  const { shortRank, mediumRank, longRank } = a
  if (shortRank !== null && mediumRank === null && longRank === null) {
    return { label: "Nuevo favorito", color: "border-primary/50 text-primary", emoji: "⭐" }
  }
  if (longRank !== null && mediumRank !== null && shortRank !== null) {
    if (shortRank < mediumRank) return { label: "Subiendo", color: "border-green-500/50 text-green-400", emoji: "📈" }
    if (shortRank > mediumRank) return { label: "Bajando", color: "border-orange-500/50 text-orange-400", emoji: "📉" }
    return { label: "Constante", color: "border-zinc-500/50 text-zinc-400", emoji: "➡️" }
  }
  if (longRank !== null && shortRank === null) {
    return { label: "Clásico tuyo", color: "border-purple-500/50 text-purple-400", emoji: "👑" }
  }
  return { label: "En rotación", color: "border-blue-500/50 text-blue-400", emoji: "🔄" }
}

export default async function EvolutionPage() {
  const session = await auth()
  const token = session!.accessToken

  const [short, medium, long] = await Promise.all([
    getTopArtists(token, "short_term", 5).catch(() => [] as SpotifyArtist[]),
    getTopArtists(token, "medium_term", 5).catch(() => [] as SpotifyArtist[]),
    getTopArtists(token, "long_term", 5).catch(() => [] as SpotifyArtist[]),
  ])

  const allIds = new Set([...short, ...medium, ...long].map((a) => a.id))
  const artistMap = new Map<string, SpotifyArtist>()
  for (const a of [...short, ...medium, ...long]) artistMap.set(a.id, a)

  const ranked: ArtistRanks[] = Array.from(allIds).map((id) => ({
    artist: artistMap.get(id)!,
    shortRank: short.findIndex((a) => a.id === id) + 1 || null,
    mediumRank: medium.findIndex((a) => a.id === id) + 1 || null,
    longRank: long.findIndex((a) => a.id === id) + 1 || null,
  }))

  function RankBadge({ rank }: { rank: number | null }) {
    if (!rank) return <span className="text-xs text-muted-foreground">—</span>
    return (
      <span className={`text-sm font-black ${rank === 1 ? "text-primary" : "text-foreground"}`}>
        #{rank}
      </span>
    )
  }

  const periods = [
    { key: "short", label: "4 semanas", artists: short },
    { key: "medium", label: "6 meses", artists: medium },
    { key: "long", label: "Siempre", artists: long },
  ] as const

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-black mb-1">📈 Evolución de Gustos</h1>
        <p className="text-muted-foreground text-sm">
          Cómo han cambiado tus top 5 artistas a lo largo del tiempo
        </p>
      </div>

      {/* Period columns */}
      <div className="grid grid-cols-3 gap-3">
        {periods.map((p) => (
          <div key={p.key} className="bg-card border border-border rounded-xl p-3 md:p-4">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
              {p.label}
            </p>
            <div className="space-y-2">
              {p.artists.length === 0 ? (
                <p className="text-xs text-muted-foreground">Sin datos</p>
              ) : (
                p.artists.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-4 shrink-0">#{i + 1}</span>
                    {a.images[0]?.url ? (
                      <div className="relative h-7 w-7 rounded-full overflow-hidden shrink-0">
                        <Image src={a.images[0].url} alt={a.name} fill className="object-cover" sizes="28px" />
                      </div>
                    ) : (
                      <div className="h-7 w-7 rounded-full bg-secondary shrink-0" />
                    )}
                    <span className="text-xs font-medium truncate">{a.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Combined analysis table */}
      <div>
        <h2 className="text-lg font-bold mb-3">Análisis de tendencias</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-0 text-xs font-bold text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border bg-secondary/30">
            <span>Artista</span>
            <span className="text-center px-2">4 sem</span>
            <span className="text-center px-2">6 mes</span>
            <span className="text-center px-2">Siempre</span>
            <span className="text-center px-2">Estado</span>
          </div>
          {ranked.map((r) => {
            const trend = getTrend(r)
            return (
              <div
                key={r.artist.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-0 px-4 py-3 border-b border-border last:border-0 hover:bg-secondary/20 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {r.artist.images[0]?.url ? (
                    <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                      <Image src={r.artist.images[0].url} alt={r.artist.name} fill className="object-cover" sizes="32px" />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-secondary shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate">{r.artist.name}</span>
                </div>
                <div className="text-center px-2 w-12"><RankBadge rank={r.shortRank} /></div>
                <div className="text-center px-2 w-12"><RankBadge rank={r.mediumRank} /></div>
                <div className="text-center px-2 w-12"><RankBadge rank={r.longRank} /></div>
                <div className="px-2">
                  <Badge variant="outline" className={`text-xs ${trend.color} whitespace-nowrap`}>
                    {trend.emoji} <span className="hidden md:inline ml-1">{trend.label}</span>
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
