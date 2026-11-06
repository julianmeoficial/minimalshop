import { Suspense } from 'react';

import { CategoryTiles } from '@/components/features/CategoryTiles';
import { CategoryTilesSkeleton } from '@/components/features/CategoryTilesSkeleton';
import { FaqList } from '@/components/features/FaqList';
import { FeaturedPick } from '@/components/features/FeaturedPick';
import { JsonLd } from '@/components/features/JsonLd';
import { FeatureSplit } from '@/components/features/FeatureSplit';
import { HomeHero } from '@/components/features/HomeHero';
import { ProcessIndex } from '@/components/features/ProcessIndex';
import { ProductGridSkeleton } from '@/components/features/ProductGridSkeleton';
import { RecentProducts } from '@/components/features/RecentProducts';
import { ScrollReveal } from '@/components/features/ScrollReveal';
import { SectionHeader } from '@/components/features/SectionHeader';
import { Button } from '@/components/ui';
import { faqItems } from '@/lib/content/faq';
import { photos } from '@/lib/content/photos';
import { faqJsonLd, websiteJsonLd } from '@/lib/seo';

import styles from './home.module.css';

const HOME_FAQ = faqItems(['como-pagar', 'datos-tarjeta', 'seguimiento', 'cancelar', 'empezar-vender']);

export default function HomePage() {
  return (
    <div className={styles.page}>
      <JsonLd data={[websiteJsonLd(), faqJsonLd(HOME_FAQ)]} />
      <HomeHero
        featured={
          <Suspense fallback={null}>
            <FeaturedPick />
          </Suspense>
        }
      />

      <ScrollReveal as="section" className={styles.section} aria-labelledby="seleccion">
        <SectionHeader
          id="seleccion"
          eyebrow="Selección"
          title={
            <>
              Lo más reciente, <em>en una lectura corta.</em>
            </>
          }
          lede="Piezas recién publicadas por los talleres: imagen primero, precio a la vista."
          action={{ href: '/catalogo', label: 'Ver todo el catálogo' }}
        />
        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <RecentProducts limit={8} />
        </Suspense>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.section} aria-labelledby="colecciones">
        <SectionHeader
          id="colecciones"
          eyebrow="Por categoría"
          title={
            <>
              Empieza por lo que <em>necesitas.</em>
            </>
          }
          lede="Ropa, calzado, hogar, tecnología y más: cada estante con su pieza más reciente como portada."
          action={{ href: '/catalogo', label: 'Todas las categorías' }}
        />
        <Suspense fallback={<CategoryTilesSkeleton />}>
          <CategoryTiles />
        </Suspense>
      </ScrollReveal>

      <FeatureSplit
        id="vender"
        eyebrow="Para vendedores"
        photo={photos.taller}
        title={
          <>
            Del taller al pedido, <em>sin intermediarios visuales.</em>
          </>
        }
        actions={
          <>
            <Button href="/cuenta/registro">Abrir una tienda</Button>
            <Button href="/vendedor/productos" variant="tertiary">
              Ya vendo: ir al panel
            </Button>
          </>
        }
      >
        <p>
          MinimalShop es una vitrina tranquila para pequeños vendedores. Tu producto
          ocupa el centro; la interfaz se aparta.
        </p>
        <ol>
          <li>
            <span>01</span>
            <span>Publica la pieza con precio, existencias e imagen.</span>
          </li>
          <li>
            <span>02</span>
            <span>Recibe pedidos ya pagados en tu panel.</span>
          </li>
          <li>
            <span>03</span>
            <span>Marca preparación, envío y entrega; el comprador lo ve al instante.</span>
          </li>
        </ol>
      </FeatureSplit>

      <ScrollReveal
        as="section"
        id="como-funciona"
        className={styles.section}
        aria-labelledby="como-funciona-titulo"
      >
        <SectionHeader
          id="como-funciona-titulo"
          eyebrow="Funcionamiento"
          title={
            <>
              Cuatro pasos, <em>ninguno de más.</em>
            </>
          }
          lede="Comprar aquí se parece a hojear un catálogo impreso: claro, ordenado y sin sorpresas al final."
          action={{ href: '/funcionamiento', label: 'Así funciona una tienda minimalista' }}
        />
        <ProcessIndex />
      </ScrollReveal>

      <FeatureSplit
        id="envios"
        reverse
        eyebrow="Pedidos y envíos"
        photo={photos.envio}
        title={
          <>
            Cada pedido, <em>con su estado a la vista.</em>
          </>
        }
        actions={
          <Button href="/cuenta/pedidos" variant="secondary">
            Ver mis pedidos
          </Button>
        }
      >
        <p>
          Desde el pago hasta la puerta, el pedido avanza por estados claros con
          texto e icono, nunca solo con color.
        </p>
        <ul>
          <li>
            <span>—</span>
            <span>Pendiente de pago, con plazo visible para completarlo.</span>
          </li>
          <li>
            <span>—</span>
            <span>Pagado y en preparación por el taller.</span>
          </li>
          <li>
            <span>—</span>
            <span>Enviado y entregado, con fecha de cada cambio.</span>
          </li>
        </ul>
      </FeatureSplit>

      <ScrollReveal as="section" className={styles.section} aria-labelledby="faq-home">
        <SectionHeader
          id="faq-home"
          eyebrow="Ayuda"
          title={
            <>
              Preguntas <em>frecuentes.</em>
            </>
          }
          action={{ href: '/preguntas-frecuentes', label: 'Ver todas las preguntas' }}
        />
        <div className={styles.faq} data-reveal>
          <FaqList items={HOME_FAQ} />
        </div>
      </ScrollReveal>

      <ScrollReveal as="section" className={styles.closing} aria-labelledby="cierre">
        <p className={styles.eyebrow} data-reveal>
          Empieza aquí
        </p>
        <h2 className={styles.closingTitle} id="cierre" data-reveal>
          Empieza por una pieza, <em>no por un algoritmo.</em>
        </h2>
        <p className={styles.closingLede} data-reveal>
          Recorre el catálogo con calma o abre tu tienda y publica tu primer producto
          hoy.
        </p>
        <div className={styles.closingCtas} data-reveal>
          <Button href="/catalogo">Explorar el catálogo</Button>
          <Button href="/cuenta/registro" variant="secondary">
            Crear una cuenta
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
}
