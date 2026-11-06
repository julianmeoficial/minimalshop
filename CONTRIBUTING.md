# Contribuir a MinimalShop

## Antes de tocar UI

1. Lee [`DESIGN.md`](./DESIGN.md) — es el contrato, no una sugerencia.
2. No hardcodees color, espacio, radio, sombra ni duración: usa tokens de [`styles/tokens.css`](./styles/tokens.css).
3. Glass solo en superficies flotantes; nunca glass sobre glass; máximo dos por pantalla.
4. No inventes componentes que no estén en `DESIGN.md`; propón primero.

## API

- Todo el tráfico de red pasa por [`lib/api/`](./lib/api/). Sin `fetch` en componentes.
- Base: `NEXT_PUBLIC_API_URL` (incluye `/api`). Rutas de negocio: `/v1/...`.
- Errores: unión tipada en `lib/api/errors.ts`; mensajes de UI vía `userFacingMessage`.
- Paginación obligatoria; `tamano` ≤ 50.
- Propaga `x-correlation-id` a logs; no lo descartes.
- Detalle de contrato: [`docs/API.md`](./docs/API.md). Conexión local: `docs/api-connect/` (no versionada).

## Flujo local

```bash
cp .env.example .env.local
cp -R docs/api-connect.example docs/api-connect
pnpm install
pnpm lint && pnpm typecheck && pnpm test
pnpm dev
```

## Estilo de código

- Un componente por archivo; export nombrado = nombre del archivo.
- Props: interfaz `<ComponentName>Props`.
- Server Components por defecto; `'use client'` solo con estado, efectos o motion.
- Animaciones reutilizables en `lib/motion/`. Motion y GSAP no en el mismo elemento.
- Tests colocalizados: `<archivo>.test.ts(x)`.
- TypeScript strict: sin `any`, sin `@ts-ignore`, sin non-null assertions para silenciar errores.

## Secretos

Nunca subas `.env.local`, tokens ni la carpeta `docs/api-connect/`. Usa `.env.example` y la plantilla `docs/api-connect.example/`.

## Checklist antes de pedir revisión

1. `pnpm lint` y `pnpm typecheck` limpios
2. `pnpm test` en verde
3. Sin `#` ni `px` hardcodeados fuera de tokens (revisa el diff)
4. Teclado y foco visibles; respeta `prefers-reduced-motion` / `prefers-reduced-transparency`
5. Vista a 360, 768 y 1024
