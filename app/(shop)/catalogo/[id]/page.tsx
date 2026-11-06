import type { Metadata } from 'next';
import { CreditCard, PackageCheck, RotateCcw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';

import { AddToCartForm } from '@/components/features/AddToCartForm';
import { BottomBar } from '@/components/features/BottomBar';
import { EnterFade } from '@/components/features/EnterFade';
import { FaqList } from '@/components/features/FaqList';
import { JsonLd } from '@/components/features/JsonLd';
import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';
import { RecentlyViewed } from '@/components/features/RecentlyViewed';
import { RecentProducts } from '@/components/features/RecentProducts';
import { ScrollReveal } from '@/components/features/ScrollReveal';
import { SectionHeader } from '@/components/features/SectionHeader';
import { ShareButton } from '@/components/features/ShareButton';
import { StateMessage } from '@/components/features/StateMessage';
import {
  Button,
  GlassSurface,
  PriceTag,
  ProductImage,
  ProductPlaceholder,
} from '@/components/ui';
import { createApiClient } from '@/lib/api/client';
import { obtenerProducto } from '@/lib/api/catalogo';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { readUsuario } from '@/lib/auth/session';
import { faqItems } from '@/lib/content/faq';
import { formatPrice } from '@/lib/format';
import { breadcrumbJsonLd, productJsonLd } from '@/lib/seo';

import styles from './detalle.module.css';

interface DetallePageProps {
  readonly params: Promise<{ id: string }>;
}

/** One request per render: metadata and page share the same product fetch. */
const getProducto = cache((id: string) => obtenerProducto(id, createApiClient()));

export async function generateMetadata({ params }: DetallePageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const producto = await getProducto(id);
    const description =
      producto.descripcion ??
      `${producto.nombre} en ${producto.categoria.nombre}, vendido por ${producto.vendedor.nombre}.`;
    const title = `${producto.nombre} — ${formatPrice(producto.precio)}`;
    return {
      title: producto.nombre,
      description,
      alternates: { canonical: `/catalogo/${producto.id}` },
      openGraph: {
        type: 'website',
        title,
        description,
        url: `/catalogo/${producto.id}`,
        ...(producto.imagenUrl
          ? { images: [{ url: producto.imagenUrl, alt: producto.nombre }] }
          : {}),
      },
    };
  } catch {
    return { title: 'Producto' };
  }
}

export default async function ProductoDetallePage({ params }: DetallePageProps) {
  const { id } = await params;
  const usuario = await readUsuario();

  try {
    const producto = await getProducto(id);
    const statusLabel = !producto.disponible
      ? 'Agotado'
      : producto.preventa
        ? 'Preventa'
        : null;
    const canBuy = usuario?.rol === 'COMPRADOR';
    const placeholder = (
      <ProductPlaceholder
        nombre={producto.nombre}
        categoria={producto.categoria.nombre}
        size="large"
      />
    );
    const stockLabel = !producto.disponible
      ? 'Agotado'
      : producto.existencias <= 5
        ? `Últimas ${producto.existencias} unidades`
        : `${producto.existencias} en existencia`;

    return (
      <div className={styles.page}>
        <JsonLd
          data={[
            productJsonLd(producto),
            breadcrumbJsonLd([
              { name: 'Catálogo', path: '/catalogo' },
              {
                name: producto.categoria.nombre,
                path: `/catalogo?categoriaId=${producto.categoria.id}`,
              },
              { name: producto.nombre, path: `/catalogo/${producto.id}` },
            ]),
          ]}
        />
        <nav aria-label="Migas de pan" className={styles.crumbs}>
          <ol>
            <li>
              <Link href="/catalogo">Catálogo</Link>
            </li>
            <li>
              <Link href={`/catalogo?categoriaId=${producto.categoria.id}`}>
                {producto.categoria.nombre}
              </Link>
            </li>
            <li aria-current="page">{producto.nombre}</li>
          </ol>
        </nav>

        <article className={styles.product}>
          <ScrollReveal className={styles.mediaCol}>
            <figure className={styles.media} data-reveal-media>
              {producto.imagenUrl ? (
                <ProductImage
                  src={producto.imagenUrl}
                  alt={producto.nombre}
                  sizes="(max-width: 1023px) 100vw, 55vw"
                  priority
                  className={styles.image}
                  fallback={placeholder}
                />
              ) : (
                placeholder
              )}
              {statusLabel ? (
                <GlassSurface as="span" variant="crystal" strong className={styles.mediaStatus}>
                  {statusLabel}
                </GlassSurface>
              ) : null}
              <PriceTag
                amount={producto.precio}
                variant="large"
                glass
                strong
                className={styles.mediaPrice}
              />
            </figure>
          </ScrollReveal>

          <EnterFade className={styles.copy}>
            <p className={styles.eyebrow}>
              {producto.categoria.nombre}
              {producto.preventa ? ' · Preventa' : ''}
            </p>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>{producto.nombre}</h1>
              <ShareButton
                title={producto.nombre}
                text={`${producto.nombre} — ${formatPrice(producto.precio)} en MinimalShop`}
              />
            </div>
            <PriceTag amount={producto.precio} variant="large" />

            {producto.descripcion ? (
              <p className={styles.description}>{producto.descripcion}</p>
            ) : null}

            <div className={styles.buy} id="comprar">
              <p
                className={`${styles.stock} ${!producto.disponible ? styles.stockOut : producto.existencias <= 5 ? styles.stockLow : ''}`}
              >
                <span className={styles.dot} aria-hidden="true" />
                {stockLabel}
              </p>
              {canBuy ? (
                <AddToCartForm
                  productoId={producto.id}
                  max={producto.existencias}
                  disabled={!producto.disponible}
                />
              ) : usuario ? (
                <p className={styles.hint}>
                  Estás en una cuenta de {usuario.rol === 'VENDEDOR' ? 'vendedor' : 'administración'}.
                  Para comprar, ingresa con una cuenta de comprador.
                </p>
              ) : (
                <div className={styles.guest}>
                  <Button href={`/cuenta/ingreso?next=/catalogo/${producto.id}`} fullWidth>
                    Ingresa para comprar
                  </Button>
                  <p className={styles.hint}>
                    ¿Sin cuenta? <Link href="/cuenta/registro">Créala en un minuto</Link>.
                  </p>
                </div>
              )}
            </div>

            <dl className={styles.specs}>
              <div>
                <dt>Vendido por</dt>
                <dd>{producto.vendedor.nombre}</dd>
              </div>
              <div>
                <dt>Categoría</dt>
                <dd>{producto.categoria.nombre}</dd>
              </div>
              <div>
                <dt>Referencia</dt>
                <dd className={styles.mono}>{producto.id.slice(0, 8).toUpperCase()}</dd>
              </div>
            </dl>

            <ul className={styles.assurances}>
              <li>
                <CreditCard size={18} strokeWidth={1.5} aria-hidden />
                Pago con pasarela externa; no guardamos tu tarjeta.
              </li>
              <li>
                <PackageCheck size={18} strokeWidth={1.5} aria-hidden />
                Seguimiento del pedido desde tu cuenta.
              </li>
              <li>
                <RotateCcw size={18} strokeWidth={1.5} aria-hidden />
                Tu carrito se conserva si algo falla al pagar.
              </li>
            </ul>

            <div className={styles.faq}>
              <FaqList
                variant="compact"
                items={faqItems(
                  producto.preventa
                    ? ['preventa', 'como-pagar', 'cancelar']
                    : ['como-pagar', 'cupon', 'cancelar'],
                )}
              />
              <Link className={styles.faqLink} href="/preguntas-frecuentes">
                Más preguntas frecuentes
              </Link>
            </div>
          </EnterFade>
        </article>

        {!usuario || canBuy ? (
          <BottomBar watchId="comprar" label="Comprar este producto">
            <span className={styles.barText}>
              <span className={styles.barName}>{producto.nombre}</span>
              <PriceTag amount={producto.precio} />
            </span>
            {canBuy ? (
              <Button href="#comprar" className={styles.barAction}>
                <ShoppingBag size={16} strokeWidth={1.5} aria-hidden />
                {producto.disponible ? 'Comprar' : 'Ver estado'}
              </Button>
            ) : (
              <Button
                href={`/cuenta/ingreso?next=/catalogo/${producto.id}`}
                className={styles.barAction}
              >
                Ingresar
              </Button>
            )}
          </BottomBar>
        ) : null}

        <ScrollReveal as="section" className={styles.related} aria-labelledby="relacionados">
          <SectionHeader
            id="relacionados"
            eyebrow="Del mismo estante"
            title={
              <>
                Más en <em>{producto.categoria.nombre}</em>
              </>
            }
            action={{
              href: `/catalogo?categoriaId=${producto.categoria.id}`,
              label: 'Ver la categoría',
            }}
          />
          <Suspense fallback={<ProductGridSkeleton />}>
            <RecentProducts
              categoriaId={producto.categoria.id}
              excludeId={producto.id}
              emptyTitle="Es la única pieza de este estante"
              emptyHint="Por ahora no hay más productos en esta categoría."
              emptyAction={{ href: '/catalogo', label: 'Ver todo el catálogo' }}
            />
          </Suspense>
        </ScrollReveal>

        <RecentlyViewed
          current={{
            id: producto.id,
            nombre: producto.nombre,
            categoria: producto.categoria.nombre,
            imagenUrl: producto.imagenUrl ?? null,
          }}
        />
      </div>
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.mapped.kind === 'not_found') {
      notFound();
    }
    return (
      <StateMessage
        title="No se pudo cargar el producto"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/catalogo" variant="secondary">Volver al catálogo</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con el catálogo.'}
        </p>
      </StateMessage>
    );
  }
}
