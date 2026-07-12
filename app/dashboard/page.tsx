import { auth } from "@/lib/auth"
import { getTopTracks, getTopArtists, getRecentlyPlayed, computeTopGenres, msToMinutes } from "@/lib/spotify"
import { StatCard } from "@/components/StatCard"
import { TrackCard } from "@/components/TrackCard"
import { ArtistCard } from "@/components/ArtistCard"
import Link from "next/link"
import Image from "next/image"

export default async function DashboardPage() {
  const session = await auth()
  const token = session!.accessToken

  const [tracks, artists, recentItems] = await Promise.all([
    getTopTracks(token, "medium_term", 10).catch(() => []),
    getTopArtists(token, "medium_term", 10).catch(() => []),
    getRecentlyPlayed(token, 50).catch(() => []),
  ])

  const genres = computeTopGenres(artists)
  const uniqueArtistIds = new Set(recentItems.flatMap((i) => i.track.artists.map((a) => a.id)))
  const totalMs = recentItems.reduce((s, i) => s + i.track.duration_ms, 0)
  const minutes = msToMinutes(totalMs)

  const firstName = session?.user?.name?.split(" ")[0] ?? "de vuelta"

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 via-card to-purple-900/20 p-6 md:p-8 border border-border">
        <div className="relative z-10">
          <p className="text-muted-foreground text-sm mb-1">Bienvenido,</p>
          <h1 className="text-3xl md:text-5xl font-black mb-2">{firstName} 👋</h1>
          <p className="text-muted-foreground">
            Aquí está tu resumen musical personalizado
          </p>
        </div>
        {session?.user?.image && (
          <div className="absolute right-6 top-6 h-16 w-16 rounded-full overflow-hidden ring-2 ring-primary/50 hidden md:block">
            <Image src={session.user.image} alt="avatar" fill className="object-cover" sizes="64px" />
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div>
        <h2 className="text-lg font-bold mb-4">Estadísticas recientes</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            label="Canción #1"
            value={tracks[0]?.name ?? "—"}
            sub={tracks[0]?.artists[0]?.name}
            accent
          />
          <StatCard
            label="Artista #1"
            value={artists[0]?.name ?? "—"}
            sub={artists[0] ? `${artists[0].followers.total.toLocaleString()} seguidores` : undefined}
            accent
          />
          <StatCard
            label="Género top"
            value={genres[0]?.genre ?? "—"}
            sub={`${genres[0]?.count ?? 0} artistas`}
          />
          <StatCard
            label="Artistas únicos"
            value={uniqueArtistIds.size}
            sub="en últimas 50 canciones"
          />
        </div>
      </div>

      {/* History highlight */}
      <StatCard
        label="⏱ Tiempo estimado"
        value={`${minutes} min`}
        sub="basado en tus últimas 50 canciones escuchadas"
        className="border-primary/20 bg-primary/5"
      />

      {/* Top 3 preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Top Canciones</h2>
            <Link href="/dashboard/top-tracks" className="text-sm text-primary hover:underline">
              Ver todo →
            </Link>
          </div>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {tracks.slice(0, 3).map((t, i) => (
              <TrackCard key={t.id} track={t} rank={i + 1} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">Top Artistas</h2>
            <Link href="/dashboard/top-artists" className="text-sm text-primary hover:underline">
              Ver todo →
            </Link>
          </div>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {artists.slice(0, 3).map((a, i) => (
              <ArtistCard key={a.id} artist={a} rank={i + 1} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { href: "/dashboard/genres", label: "Géneros", emoji: "🎸", desc: "Tu mapa de géneros" },
          { href: "/dashboard/evolution", label: "Evolución", emoji: "📈", desc: "Cómo cambiaron tus gustos" },
          { href: "/dashboard/history", label: "Historial", emoji: "🕐", desc: "Últimas 50 canciones" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
          >
            <span className="text-2xl">{item.emoji}</span>
            <p className="font-bold mt-2">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
