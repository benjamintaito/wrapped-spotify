# 🎧 Spotify Wrapped

Dashboard personal estilo *Spotify Wrapped* que analiza tu historial de Spotify en cualquier momento del año: top canciones, top artistas, géneros dominantes, evolución de tus gustos y patrones de escucha por hora y día.

La interfaz está en español. No almacena datos: todo se consulta en vivo contra la API de Spotify con tu propia sesión.

## Características

- **Top canciones y artistas** en tres períodos (4 semanas, 6 meses, histórico)
- **Top géneros** derivados de tus artistas favoritos
- **Evolución de gustos**: cómo cambia tu top 5 de artistas entre períodos (nuevos favoritos, clásicos, subiendo/bajando)
- **Historial reciente**: actividad por hora del día y día de la semana, hora pico, canción más repetida
- Diseño oscuro responsive (sidebar en desktop, bottom nav en móvil)

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) + React 19
- [Auth.js (NextAuth v5)](https://authjs.dev) con el proveedor de Spotify (OAuth + PKCE, refresh de tokens)
- [Tailwind CSS 4](https://tailwindcss.com) + componentes [shadcn](https://ui.shadcn.com)
- TypeScript

## Puesta en marcha

### 1. Crea una app en Spotify

1. Entra al [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) y crea una app.
2. En **Redirect URIs** agrega:
   ```
   http://127.0.0.1:3000/api/auth/callback/spotify
   ```
   (Spotify ya no acepta `localhost`; por eso `npm run dev` sirve en `127.0.0.1`.)
3. Copia el **Client ID** y el **Client Secret**.

> Nota: mientras tu app de Spotify esté en *Development mode*, solo podrán iniciar sesión los usuarios que agregues en **User Management**.

### 2. Configura las variables de entorno

```bash
cp .env.example .env.local
npx auth secret   # genera AUTH_SECRET
```

Rellena `SPOTIFY_CLIENT_ID` y `SPOTIFY_CLIENT_SECRET` en `.env.local`.

### 3. Instala y ejecuta

```bash
npm install
npm run dev
```

Abre [http://127.0.0.1:3000](http://127.0.0.1:3000) y conecta tu cuenta de Spotify.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en `127.0.0.1:3000` |
| `npm run build` | Build de producción |
| `npm run start` | Sirve el build de producción |
| `npm run lint` | ESLint |

## Estructura

```
app/
  page.tsx                  # Landing + login con Spotify
  dashboard/                # Páginas del dashboard (resumen, tops, géneros, evolución, historial)
  api/auth/[...nextauth]/   # Handlers de Auth.js
  api/spotify/              # Rutas proxy a la API de Spotify (usan el token de sesión)
components/                 # UI (cards, nav, skeletons, componentes shadcn)
lib/
  auth.ts                   # Configuración de Auth.js + refresh de tokens
  spotify.ts                # Cliente tipado de la API de Spotify
  useApi.ts                 # Hook de fetching para las páginas cliente
proxy.ts                    # Protege /dashboard (convención proxy de Next 16)
```

## Privacidad

- Los tokens de Spotify viven cifrados en la cookie de sesión (JWT de Auth.js); no hay base de datos.
- Las respuestas de la API de Spotify no se cachean en el servidor (`cache: "no-store"`).
- Scopes usados: `user-top-read`, `user-read-recently-played`, `user-read-private`.
