import { auth } from "@/lib/auth"
import { getTopTracks, parseLimit, parseTimeRange } from "@/lib/spotify"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.accessToken || session.error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const range = parseTimeRange(req.nextUrl.searchParams.get("time_range"))
  const limit = parseLimit(req.nextUrl.searchParams.get("limit"))

  try {
    const tracks = await getTopTracks(session.accessToken, range, limit)
    return Response.json(tracks)
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 502 })
  }
}
