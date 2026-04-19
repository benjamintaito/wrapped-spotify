import { auth } from "@/lib/auth"
import { getTopTracks, type TimeRange } from "@/lib/spotify"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const range = (req.nextUrl.searchParams.get("time_range") ?? "medium_term") as TimeRange
  const limit = Number(req.nextUrl.searchParams.get("limit") ?? "10")

  try {
    const tracks = await getTopTracks(session.accessToken, range, limit)
    return Response.json(tracks)
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 })
  }
}
