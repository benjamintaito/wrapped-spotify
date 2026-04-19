import NextAuth from "next-auth"
import Spotify from "next-auth/providers/spotify"

const SCOPES = "user-top-read user-read-recently-played user-read-private"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers: [
    Spotify({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: { scope: SCOPES },
      },
      redirectProxyUrl: "http://127.0.0.1:3000/api/auth/callback/spotify",
      checks: ["pkce", "state"],
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          expiresAt: (account.expires_at ?? 0) * 1000,
          refreshToken: account.refresh_token,
        }
      }
      if (Date.now() < (token.expiresAt as number)) {
        return token
      }
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.error = token.error as string | undefined
      return session
    },
  },
})

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    })
    const data = await res.json()
    if (!res.ok) throw data
    return {
      ...token,
      accessToken: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
      refreshToken: data.refresh_token ?? token.refreshToken,
    }
  } catch {
    return { ...token, error: "RefreshAccessTokenError" }
  }
}
