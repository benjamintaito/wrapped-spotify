import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { SpotifyTrack } from "@/lib/spotify"

interface TrackCardProps {
  track: SpotifyTrack
  rank: number
}

export function TrackCard({ track, rank }: TrackCardProps) {
  const artwork = track.album.images[0]?.url
  const artists = track.artists.map((a) => a.name).join(", ")

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors group">
      <span className="w-6 text-center text-sm font-black text-muted-foreground shrink-0">
        {rank}
      </span>

      {artwork ? (
        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0 shadow-md">
          <Image src={artwork} alt={track.album.name} fill className="object-cover" sizes="48px" />
        </div>
      ) : (
        <div className="h-12 w-12 rounded-lg bg-secondary shrink-0 flex items-center justify-center">
          <span className="text-xl">🎵</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <a
          href={track.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
        >
          {track.name}
        </a>
        <p className="text-xs text-muted-foreground truncate">{artists}</p>
        <div className="flex items-center gap-2 mt-1">
          <Progress value={track.popularity} className="h-1 flex-1 max-w-[80px]" />
          <span className="text-xs text-muted-foreground">{track.popularity}</span>
        </div>
      </div>

      {rank <= 3 && (
        <Badge
          variant="outline"
          className={
            rank === 1
              ? "border-yellow-500/50 text-yellow-400 text-xs"
              : rank === 2
              ? "border-zinc-400/50 text-zinc-300 text-xs"
              : "border-orange-600/50 text-orange-500 text-xs"
          }
        >
          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
        </Badge>
      )}
    </div>
  )
}
