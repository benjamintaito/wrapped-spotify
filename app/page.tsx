import { auth, signIn } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function HomePage() {
  const session = await auth()
  // Sessions with a failed token refresh stay here so the user can re-connect.
  if (session && !session.error) redirect("/dashboard")

  return (
    <main className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-6">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-purple-600/15 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[100px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary shadow-[0_0_60px_oklch(0.72_0.19_152/0.4)]">
          <svg viewBox="0 0 24 24" className="h-10 w-10 fill-primary-foreground">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-br from-primary via-emerald-400 to-green-300 bg-clip-text text-transparent mb-4">
          Wrapped
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
          Tu año en música
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10 max-w-md">
          Descubre tus canciones, artistas y géneros favoritos. Analiza cómo han
          evolucionado tus gustos a lo largo del tiempo.
        </p>

        <form
          action={async () => {
            "use server"
            await signIn("spotify", { redirectTo: "/dashboard" })
          }}
        >
          <button
            type="submit"
            className="group flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-primary-foreground font-bold text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_oklch(0.72_0.19_152/0.5)] active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            Conectar con Spotify
          </button>
        </form>

        <p className="mt-6 text-xs text-muted-foreground">
          Requiere cuenta de Spotify · Sin almacenamiento de datos
        </p>
      </div>
    </main>
  )
}
