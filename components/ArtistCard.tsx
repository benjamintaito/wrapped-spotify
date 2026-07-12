import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import type { SpotifyArtist } from "@/lib/spotify"

interface ArtistCardProps {
  artist: SpotifyArtist
  rank: number
}

export function ArtistCard({ artist, rank }: ArtistCardProps) {
  const image = artist.images[0]?.url
  const topGenres = artist.genres.slice(0, 2)

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
      <span className="w-6 text-center text-sm font-black text-muted-foreground shrink-0">
        {rank}
      </span>

      {image ? (
        <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 shadow-md ring-2 ring-border">
          <Image src={image} alt={artist.name} fill className="object-cover" sizes="48px" />
        </div>
      ) : (
        <div className="h-12 w-12 rounded-full bg-secondary shrink-0 flex items-center justify-center">
          <span className="text-xl">🎤</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <a
          href={artist.external_urls.spotify}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sm text-foreground hover:text-primary transition-colors truncate block"
        >
          {artist.name}
        </a>
        <div className="flex flex-wrap gap-1 mt-1">
          {topGenres.map((g) => (
            <Badge key={g} variant="secondary" className="text-xs py-0 px-1.5 capitalize">
              {g}
            </Badge>
          ))}
          {artist.genres.length === 0 && (
            <span className="text-xs text-muted-foreground">sin géneros</span>
          )}
        </div>
      </div>

      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground">
          {new Intl.NumberFormat("es", { notation: "compact" }).format(artist.followers.total)}
        </p>
        <p className="text-xs text-muted-foreground">seguidores</p>
      </div>
    </div>
  )
}
