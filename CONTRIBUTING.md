# Contribuir

¡Gracias por tu interés en contribuir! Este es un proyecto pequeño, así que el proceso es simple.

## Cómo empezar

1. Haz un fork y clona el repositorio.
2. Sigue la sección **Puesta en marcha** del [README](README.md) (necesitas tu propia app de Spotify para desarrollo).
3. Crea una rama descriptiva: `git checkout -b fix/nombre-del-fix`.

## Antes de abrir un PR

- Ejecuta `npm run lint` y `npm run build`; ambos deben pasar sin errores.
- Mantén el estilo del código existente (TypeScript estricto, componentes de servidor por defecto, UI en español).
- Si agregas una llamada nueva a la API de Spotify, hazla a través de `lib/spotify.ts` y sin cachear datos de usuario.
- Describe en el PR qué cambia y por qué; capturas de pantalla si es un cambio visual.

## Reportar bugs o proponer ideas

Abre un issue con pasos para reproducir (o una descripción de la funcionalidad propuesta). No incluyas tokens, client secrets ni datos personales en los issues.

## Nota sobre Next.js 16

Este proyecto usa Next.js 16, que tiene cambios importantes respecto a versiones anteriores (por ejemplo, `proxy.ts` en lugar de `middleware.ts`, y APIs de request asíncronas). Consulta la documentación incluida en `node_modules/next/dist/docs/` antes de escribir código.
