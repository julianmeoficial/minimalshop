# Changelog

Todos los cambios relevantes de MinimalShop se documentan aquí.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/),
y el versionado sigue [SemVer](https://semver.org/lang/es/).

## [Unreleased]

### Added

- Preguntas frecuentes: página `/preguntas-frecuentes` (índice por temas), sección en el home y
  bloque compacto en cada ficha; acordeón nativo `<details>` y JSON-LD `FAQPage`.
- SEO e-commerce: `metadataBase` y Open Graph, canonical por página, título por categoría,
  `noindex` en resultados de búsqueda, JSON-LD `Product` (precio COP, disponibilidad,
  preventa) y `BreadcrumbList`, `WebSite` con `SearchAction`, `sitemap.xml` y `robots.txt`.
  Nueva variable `NEXT_PUBLIC_SITE_URL`.
- `ProductPlaceholder`: icono por categoría y «Foto pendiente» cuando no hay foto utilizable.
- Miniaturas reales en el carrito (`obtenerVisuales`).
- Botón «Compartir» (Web Share o copiar enlace) y «Vistos recientemente» (solo en el navegador).
- Búsqueda sin resultados con sugerencias de productos.
- Catálogo COP de la API (24 productos, 6 categorías): categorías reales en el home con la foto
  de su producto más reciente y etiqueta crystal; chips de categoría crystal en el catálogo.
- Tarjeta «Recién llegado» en liquid glass sobre la foto del hero (elige un producto con foto
  accesible).
- `ProductImage`: si la foto del vendedor falla prueba alternativas y luego muestra un
  placeholder diseñado, nunca el ícono roto.
- `BottomBar`: barra inferior en liquid glass en móvil/tablet (comprar en el detalle, pagar en
  el carrito) que se oculta cuando el bloque real está en pantalla.
- Toast crystal «Agregado al carrito» tras agregar un producto.
- Optimización de imágenes remotas de Unsplash (`next.config` + `lib/images.ts`, AVIF/WebP).
- Miniaturas en la tabla de productos del vendedor.

### Changed

- Material glass más visible: gradiente de cuerpo, anillo refractado por máscara en liquid y
  borde facetado en crystal; tokens ajustados (ver DESIGN.md §4, reglas ampliadas).
- `ProductCard`: precio en crystal sobre la foto, estado (preventa, agotado, últimas unidades)
  como chip crystal.
- Modo claro reforzado: controles nativos, autofill, scrollbar y overscroll en tokens de papel.
- Responsive: hero 1:1 en móvil y 16:10 en tablet, detalle 1:1 en móvil, filtros compactos,
  toasts bajo la navegación en móvil.
- Footer y README ya no mencionan proyecto académico.
- Home editorial completo (composición KORVAE): hero partido con intro GSAP (líneas desde
  máscara + wipe de imagen), selección reciente con `Suspense` y skeleton, colecciones por uso,
  bloques imagen/texto para vendedores y envíos, índice numerado «Cómo funciona», CTA final.
- Fotografía editorial libre (Unsplash License) en `public/images/`, catalogada con créditos en
  `lib/content/photos.ts` y página `/creditos`.
- Navegación `NavBar` en liquid glass con velo al hacer scroll, subrayado animado, estado
  activo y menú móvil dentro de la misma superficie (sin glass sobre glass).
- `SiteFooter` en columnas, `SectionHeader`, `FeatureSplit`, `CollectionTiles`,
  `ProcessIndex`, `EmptyState`, `EnterFade`, `AuthShell`, `OrderTimeline`,
  `CancelOrderButton` (confirmación con `Dialog`), `ProductGridSkeleton`.
- Rutas `loading.tsx`, `error.tsx` y `not-found.tsx` (también para URLs fuera del grupo).
- Helpers GSAP `createHeroIntro`, `createMediaWipe` y `SCROLL_START`.
- Login respeta `?next=` (solo rutas internas).
- Material glass: lensing en liquid, veta diagonal + faceta cónica en crystal, fallback sin
  `backdrop-filter`; especificidad cero en `.root` para no anular `position: sticky`.
- `Button` acepta `href` y renderiza un enlace (antes `<a><button>`, HTML inválido).
- `StatusChip` es plano por defecto; el acabado crystal pasa a `glass` opcional.
- `ProductCard`: hover de imagen por `filter` (Almada), placeholder tipográfico, `aria-label`
  con precio formateado, estados agotado/preventa en texto.
- `Pagination` con anterior/siguiente; `QuantityStepper` compacto mantiene 44px.
- Catálogo, detalle, carrito, checkout, cuenta, pedidos y panel de vendedor rediseñados.

### Fixed

- Imágenes prioritarias que fallaban antes de hidratar ya muestran el placeholder.
- Reveals que quedaban ocultos si la sección ya estaba en pantalla al cargar.

## [0.1.0] — 2026-11-05

### Added

- Scaffold Next.js (App Router) + TypeScript strict + pnpm
- Tokens de diseño en `styles/tokens.css` según `DESIGN.md`
- Layout base con fuentes Atkinson Hyperlegible Next, Newsreader e IBM Plex Mono
- Cliente HTTP tipado en `lib/api/` (auth, catálogo, salud, errores mapeados)
- Helpers de motion/GSAP en `lib/motion/`
- Documentación: README, CONTRIBUTING, `docs/API.md`, `docs/CAPABILITIES.md`
- Plantilla local `docs/api-connect.example/` (la copia real va en gitignore)
- Vitest + smoke test del mapper de errores
- Scripts `lint`, `typecheck`, `test`, `api:types`

[Unreleased]: https://github.com/julianmeoficial/minimalshop/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/julianmeoficial/minimalshop/releases/tag/v0.1.0
