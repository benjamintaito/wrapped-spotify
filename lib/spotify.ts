const API = "https://api.spotify.com/v1"

export type TimeRange = "short_term" | "medium_term" | "long_term"

export interface SpotifyImage {
  url: string
  width: number
  height: number
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: { id: string; name: string }[]
  album: { name: string; images: SpotifyImage[] }
  popularity: number
  duration_ms: number
  external_urls: { spotify: string }
}

export interface SpotifyArtist {
  id: string
  name: string
  genres: string[]
  images: SpotifyImage[]
  popularity: number
  followers: { total: number }
  external_urls: { spotify: string }
}

export interface SpotifyRecentlyPlayed {
  track: SpotifyTrack
  played_at: string
}

async function spotifyFetch<T>(path: string, token: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    next: { revalidate: 300 },
  })
  if (res.status === 429) {
    throw new Error("Rate limited by Spotify. Try again in a moment.")
  }
  if (!res.ok) throw new Error(`Spotify API ${res.status}`)
  return res.json()
}

export async function getTopTracks(token: string, range: TimeRange, limit = 10) {
  const data = await spotifyFetch<{ items: SpotifyTrack[] }>(
    `/me/top/tracks?time_range=${range}&limit=${limit}`,
    token
  )
  return data.items
}

export async function getTopArtists(token: string, range: TimeRange, limit = 10) {
  const data = await spotifyFetch<{ items: SpotifyArtist[] }>(
    `/me/top/artists?time_range=${range}&limit=${limit}`,
    token
  )
  return data.items
}

export async function getRecentlyPlayed(token: string, limit = 50) {
  const data = await spotifyFetch<{ items: SpotifyRecentlyPlayed[] }>(
    `/me/player/recently-played?limit=${limit}`,
    token
  )
  return data.items
}

export function computeTopGenres(artists: SpotifyArtist[]): { genre: string; count: number }[] {
  const counts: Record<string, number> = {}
  for (const artist of artists) {
    for (const genre of artist.genres) {
      counts[genre] = (counts[genre] ?? 0) + 1
    }
  }
  return Object.entries(counts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
}

export function msToMinutes(ms: number) {
  return Math.round(ms / 60000)
}
