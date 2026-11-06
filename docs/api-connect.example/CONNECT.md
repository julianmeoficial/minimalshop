# Conexión a la API (plantilla)

Copia esta carpeta antes de desarrollar:

```bash
cp -R docs/api-connect.example docs/api-connect
```

`docs/api-connect/` está en `.gitignore`. Aquí solo va información de **cómo conectar** (URLs, demo, CORS). El mapa de recursos vive en [`docs/API.md`](../API.md).

## Base URL

| Entorno | `NEXT_PUBLIC_API_URL` |
|---------|------------------------|
| Local HTTP | `http://localhost:8080/api` |
| Local HTTPS (`pnpm certs:dev` en la API) | `https://localhost:8080/api` |
| Producción (Railway) | `https://minimalshopapi.up.railway.app/api` |

Sin barra final. Rutas de negocio: `${NEXT_PUBLIC_API_URL}/v1/...`.

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## OpenAPI y salud

| Recurso | URL (producción) |
|---------|------------------|
| OpenAPI UI | https://minimalshopapi.up.railway.app/docs |
| OpenAPI JSON | https://minimalshopapi.up.railway.app/docs-json |
| Liveness | https://minimalshopapi.up.railway.app/api/salud/vida |
| Readiness | https://minimalshopapi.up.railway.app/api/salud/listo |

Local: sustituye el host por `http://localhost:8080`.

Regenerar tipos del FE:

```bash
pnpm api:types
# o NEXT_PUBLIC_API_DOCS_JSON=http://localhost:8080/docs-json pnpm api:types
```

## Cuentas demo (seed)

Disponibles tras `prisma db seed` en la API (y en el entorno Railway de demo):

| Email | Password | Rol |
|-------|----------|-----|
| `comprador@demo.com` | `demo12345` | COMPRADOR |
| `vendedor@demo.com` | `demo12345` | VENDEDOR |
| `admin@demo.com` | `demo12345` | SUPERADMIN |

Cupón demo: `WELCOME10` (10 %).

## CORS

La API exige el **origen exacto** del frontend en `CORS_ORIGINS` (sin barra final), p. ej.:

- `http://localhost:3000`
- `https://tu-app.vercel.app`

Varios orígenes: lista separada por comas. Si el origen no está, el navegador bloquea aunque `curl` funcione.

## Checklist rápido

1. `GET /api/salud/vida` → 200
2. `GET /api/salud/listo` → 200 (Postgres + Redis ok)
3. `POST /api/v1/auth/ingreso` con cuenta demo
4. `GET /api/v1/catalogo/productos?pagina=0&tamano=20`

## Notas personales (editar en la copia local)

- Origen FE en uso:
- Base URL activa:
- Observaciones CORS / red:
