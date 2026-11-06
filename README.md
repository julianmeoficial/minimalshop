# MinimalShop

Storefront Next.js de la plataforma Minimal Ecommerce. Consume la API versionada bajo `/api/v1` y aplica el sistema de diseño editorial «papel e tinta» definido en [`DESIGN.md`](./DESIGN.md).

Cliente web independiente del monolito NestJS: tres roles (comprador, vendedor, superadmin), catálogo, carrito, checkout con pasarela externa y paneles mínimos.

## Stack

- Next.js (App Router) + React + TypeScript (strict)
- CSS Modules + tokens en [`styles/tokens.css`](./styles/tokens.css)
- Motion (componentes) y GSAP + ScrollTrigger (secuencias / scroll)
- Lucide; fuentes Atkinson Hyperlegible Next, Newsreader, IBM Plex Mono
- Cliente HTTP tipado en [`lib/api/`](./lib/api/)

## Requisitos

- Node.js 20+
- pnpm 9+ (el repo declara `packageManager`)

## Arranque

```bash
cp .env.example .env.local
cp -R docs/api-connect.example docs/api-connect
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000). La base de la API va en `NEXT_PUBLIC_API_URL` (incluye `/api`, sin barra final).

La guía **local** de conexión (URLs, cuentas demo, CORS) vive en `docs/api-connect/` y **no se versiona**. Empieza desde la plantilla en `docs/api-connect.example/`.

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | Tests unitarios (Vitest) |
| `pnpm api:types` | Regenera tipos desde OpenAPI (`lib/api/schema.d.ts`) |

## Documentación

| Doc | Contenido |
|-----|-----------|
| [`DESIGN.md`](./DESIGN.md) | Contrato visual (tokens, glass, componentes) |
| [`docs/API.md`](./docs/API.md) | Mapa de recursos y convenciones HTTP |
| [`docs/CAPABILITIES.md`](./docs/CAPABILITIES.md) | Módulos activables y degradación UX |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Flujo de contribución |
| [`CHANGELOG.md`](./CHANGELOG.md) | Historial de cambios |
| [`docs/api-connect.example/`](./docs/api-connect.example/) | Plantilla de conexión (copiar a `docs/api-connect/`) |

Contexto de arquitectura: [MinimalShop en Notion](https://app.notion.com/p/julianmeoficial/MinimalShop-bf5f28e0ac4a4bcfb7a3b398077cb5bc).

## Despliegue

Hosting previsto del frontend: **Vercel**. La API se despliega aparte (p. ej. Railway). Asegura que `CORS_ORIGINS` en la API incluya el origen exacto del storefront.

## Licencia

Proyecto privado. Sin licencia open source publicada por ahora.
