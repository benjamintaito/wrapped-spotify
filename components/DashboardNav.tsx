"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { signOut } from "next-auth/react"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", emoji: "🏠" },
  { href: "/dashboard/top-tracks", label: "Canciones", emoji: "🎵" },
  { href: "/dashboard/top-artists", label: "Artistas", emoji: "🎤" },
  { href: "/dashboard/genres", label: "Géneros", emoji: "🎸" },
  { href: "/dashboard/evolution", label: "Evolución", emoji: "📈" },
  { href: "/dashboard/history", label: "Historial", emoji: "🕐" },
]

export function DashboardNav({ userName }: { userName?: string | null }) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-card border-r border-border shrink-0">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="h-4 w-4 fill-primary-foreground">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
              </svg>
            </div>
            <span className="font-bold text-sm">Wrapped</span>
          </div>
          {userName && (
            <p className="text-xs text-muted-foreground mt-2 truncate">{userName}</p>
          )}
        </div>

        <nav className="flex-1 p-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-1",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border flex justify-around py-2 px-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <span className="text-lg leading-none">{item.emoji}</span>
            <span className="hidden sm:block">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
