import type { Metadata } from 'next';
import { Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { cache, Suspense } from 'react';

import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';
import { RecentProducts } from '@/components/features/RecentProducts';
import { ScrollReveal } from '@/components/features/ScrollReveal';
import { SectionHeader } from '@/components/features/SectionHeader';
import { StateMessage } from '@/components/features/StateMessage';
import { Button, GlassSurface, Pagination, ProductCard } from '@/components/ui';
import { listarCategorias, listarProductos } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { CATALOGUE_PAGE_SIZE, type Categoria } from '@/lib/api/types';

import styles from './catalogo.module.css';

const getCategorias = cache(() => listarCategorias(createApiClient()));

export async function generateMetadata({ searchParams }: CatalogoPageProps): Promise<Metadata> {
  const params = await searchParams;
  const pagina = Math.max(0, Number(params.pagina ?? '0') || 0);
  let categoria: Categoria | undefined;
  if (params.categoriaId) {
    try {
      categoria = (await getCategorias()).find((c) => c.id === params.categoriaId);
    } catch {
      categoria = undefined;
    }
  }
  const base = categoria ? categoria.nombre : 'Catálogo';
  const title = pagina > 0 ? `${base} · página ${pagina + 1}` : base;
  const sp = new URLSearchParams();
  if (categoria) sp.set('categoriaId', categoria.id);
  if (pagina > 0) sp.set('pagina', String(pagina));
  const qs = sp.toString();
  return {
    title,
    description: categoria?.descripcion
      ? `${categoria.descripcion}. Precios en pesos colombianos en MinimalShop.`
      : 'Todas las piezas de MinimalShop, doce por página, con precios en pesos colombianos.',
    alternates: { canonical: qs ? `/catalogo?${qs}` : '/catalogo' },
    // Search result pages are thin duplicates: keep them out of the index, follow links.
    ...(params.q ? { robots: { index: false, follow: true } } : {}),
  };
}

type Orden = 'recientes' | 'precio_asc' | 'precio_desc' | 'nombre_asc';

const ORDENES: readonly { readonly value: Orden; readonly label: string }[] = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'nombre_asc', label: 'Nombre: A–Z' },
];

function parseOrden(value: string | undefined): Orden {
  return ORDENES.some((o) => o.value === value) ? (value as Orden) : 'recientes';
}

interface CatalogoPageProps {
  readonly searchParams: Promise<{
    pagina?: string;
    q?: string;
    categoriaId?: string;
    orden?: string;
  }>;
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const params = await searchParams;
  const pagina = Math.max(0, Number(params.pagina ?? '0') || 0);
  const q = params.q?.trim() || undefined;
  const categoriaId = params.categoriaId || undefined;
  const orden = parseOrden(params.orden);
  const filtered = Boolean(q || categoriaId || orden !== 'recientes');

  const client = createApiClient();

  const header = (
    <SectionHeader
      id="catalogo-titulo"
      level="h1"
      eyebrow="Catálogo"
      title={
        <>
          Todas las piezas, <em>en orden.</em>
        </>
      }
      lede="Doce por página, con precio a la vista. Filtra por categoría o busca por nombre."
    />
  );

  try {
    const [productos, categorias] = await Promise.all([
      listarProductos(
        { pagina, tamano: CATALOGUE_PAGE_SIZE, q, categoriaId, orden },
        client,
      ),
      getCategorias(),
    ]);

    const hrefForPage = (p: number) => {
      const sp = new URLSearchParams();
      if (p > 0) sp.set('pagina', String(p));
      if (q) sp.set('q', q);
      if (categoriaId) sp.set('categoriaId', categoriaId);
      if (orden !== 'recientes') sp.set('orden', orden);
      const qs = sp.toString();
      return qs ? `/catalogo?${qs}` : '/catalogo';
    };

    const hrefWith = (over: { categoriaId?: string | undefined }) => {
      const sp = new URLSearchParams();
      if (q) sp.set('q', q);
      if (over.categoriaId) sp.set('categoriaId', over.categoriaId);
      if (orden !== 'recientes') sp.set('orden', orden);
      const qs = sp.toString();
      return qs ? `/catalogo?${qs}` : '/catalogo';
    };

    const total = productos.totalElementos;
    const from = total === 0 ? 0 : productos.pagina * productos.tamano + 1;
    const to = Math.min(total, (productos.pagina + 1) * productos.tamano);
    const categoriaActual = categorias.find((c) => c.id === categoriaId)?.nombre;

    return (
      <div className={styles.page}>
        {header}

        <GlassSurface variant="liquid" className={styles.filterBar}>
          <form className={styles.filters} method="get" role="search">
            {categoriaId ? (
              <input type="hidden" name="categoriaId" value={categoriaId} />
            ) : null}
            <label className={styles.search} htmlFor="q">
              <span className="sr-only">Buscar por nombre</span>
              <Search className={styles.inputIcon} size={18} strokeWidth={1.5} aria-hidden />
              <input
                id="q"
                name="q"
                type="search"
                className={`${styles.input} ${styles.withIcon}`}
                defaultValue={q ?? ''}
                placeholder="Buscar piezas…"
                autoComplete="off"
                enterKeyHint="search"
              />
            </label>
            <label className={styles.sort} htmlFor="orden">
              <span className={styles.sortLabel}>Orden</span>
              <select id="orden" name="orden" className={styles.input} defaultValue={orden}>
                {ORDENES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" variant="primary" className={styles.apply}>
              <SlidersHorizontal size={16} strokeWidth={1.5} aria-hidden />
              Aplicar
            </Button>
          </form>
        </GlassSurface>

        <nav className={styles.chips} aria-label="Categorías">
          <ul>
            <li>
              <Link
                href={hrefWith({ categoriaId: undefined })}
                className={styles.chipLink}
                aria-current={!categoriaId ? 'page' : undefined}
              >
                <GlassSurface as="span" variant="crystal" className={styles.chip}>
                  Todas
                </GlassSurface>
              </Link>
            </li>
            {categorias.map((c) => (
              <li key={c.id}>
                <Link
                  href={hrefWith({ categoriaId: c.id })}
                  className={styles.chipLink}
                  aria-current={c.id === categoriaId ? 'page' : undefined}
                >
                  <GlassSurface as="span" variant="crystal" className={styles.chip}>
                    {c.nombre}
                  </GlassSurface>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.resultsBar} aria-live="polite">
          <p>
            {total === 0
              ? 'Sin resultados'
              : `Mostrando ${from} a ${to} de ${total} ${total === 1 ? 'pieza' : 'piezas'}`}
            {q ? (
              <>
                {' '}
                para <strong>«{q}»</strong>
              </>
            ) : null}
            {categoriaActual ? (
              <>
                {' '}
                en <strong>{categoriaActual}</strong>
              </>
            ) : null}
          </p>
          {filtered ? (
            <Link className={styles.clear} href="/catalogo">
              Limpiar filtros
            </Link>
          ) : null}
        </div>

        {productos.contenido.length === 0 ? (
          <div className={styles.empty}>
            <StateMessage
              title={q ? `No encontramos «${q}»` : 'No hay piezas en esta selección'}
              action={<Button href="/catalogo" variant="secondary">Ver todo el catálogo</Button>}
            >
              <p>
                Revisa la ortografía, usa una palabra más general o prueba otra categoría.
              </p>
            </StateMessage>
            <section className={styles.suggest} aria-labelledby="sugeridos">
              <h2 id="sugeridos" className={styles.suggestTitle}>
                Quizá te interese
              </h2>
              <Suspense fallback={<ProductGridSkeleton />}>
                <RecentProducts limit={4} />
              </Suspense>
            </section>
          </div>
        ) : (
          <ScrollReveal>
            <ul className={styles.grid}>
              {productos.contenido.map((p, i) => (
                <li key={p.id} data-reveal>
                  <ProductCard
                    priority={i < 4}
                    lowStock={p.disponible && p.existencias <= 5}
                    href={`/catalogo/${p.id}`}
                    nombre={p.nombre}
                    precio={p.precio}
                    imagenUrl={p.imagenUrl}
                    categoria={p.categoria.nombre}
                    outOfStock={!p.disponible}
                    preventa={p.preventa}
                  />
                </li>
              ))}
            </ul>
          </ScrollReveal>
        )}

        <Pagination
          pagina={productos.pagina}
          totalPaginas={productos.totalPaginas}
          totalElementos={productos.totalElementos}
          tamano={productos.tamano}
          hrefForPage={hrefForPage}
          showSummary={false}
        />
      </div>
    );
  } catch (error) {
    return (
      <div className={styles.page}>
        {header}
        <StateMessage
          title="No se pudo cargar el catálogo"
          correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
          action={<Button href={filtered ? '/catalogo' : '/catalogo?reintento=1'}>Reintentar</Button>}
        >
          <p>
            {error instanceof ApiClientError
              ? userFacingMessage(error.mapped)
              : 'No pudimos conectar con el catálogo. Revisa tu conexión e inténtalo de nuevo.'}
          </p>
        </StateMessage>
        <p className={styles.back}>
          <Link href="/">Volver al inicio</Link>
        </p>
      </div>
    );
  }
}
