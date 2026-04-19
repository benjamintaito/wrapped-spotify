import { auth } from "@/lib/auth"
import { getRecentlyPlayed } from "@/lib/spotify"

export async function GET() {
  const session = await auth()
  if (!session?.accessToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const items = await getRecentlyPlayed(session.accessToken, 50)
    return Response.json(items)
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 })
  }
}
