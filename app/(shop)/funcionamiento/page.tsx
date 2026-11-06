import type { Metadata } from 'next';
import { ArrowUpRight, FolderGit2, Store } from 'lucide-react';

import { HowHero } from '@/components/features/HowHero';
import { KeyModules } from '@/components/features/KeyModules';
import { LaunchSteps } from '@/components/features/LaunchSteps';
import { ScrollReveal } from '@/components/features/ScrollReveal';
import { SectionHeader } from '@/components/features/SectionHeader';
import { StoreCustomizer } from '@/components/features/StoreCustomizer';
import { Button } from '@/components/ui';
import {
  API_REPO_URL,
  PRINCIPLES,
  STOREFRONT_REPO_URL,
} from '@/lib/content/funcionamiento';

import styles from './funcionamiento.module.css';

export const metadata: Metadata = {
  title: 'Funcionamiento',
  description:
    'El principio de las tiendas minimalistas: un motor abierto, minimalecommerceAPI, que cualquier tienda puede usar y personalizar.',
  alternates: { canonical: '/funcionamiento' },
};

export default function FuncionamientoPage() {
  return (
    <div className={styles.page}>
      <HowHero />

      <ScrollReveal as="section" className={styles.section} aria-labelledby="principio">
        <SectionHeader
          id="principio"
          eyebrow="El principio"
          title={
            <>
              Minimalista no es tener menos. <em>Es que todo tenga un motivo.</em>
            </>
          }
          lede="Cada tienda minimalista se apoya en las mismas tres ideas."
        />
        <ol className={styles.principles}>
          {PRINCIPLES.map((p, i) => (
            <li key={p.title} className={styles.principle} data-reveal>
              <span className={styles.number}>{String(i + 1).padStart(2, '0')}</span>
              <h3 className={styles.principleTitle}>{p.title}</h3>
              <p className={styles.principleBody}>{p.body}</p>
            </li>
          ))}
        </ol>
        <blockquote className={styles.quote} data-reveal>
          <p>
            «Una sola API, muchas vitrinas: el código es de todas las tiendas; el estilo, de cada
            una.»
          </p>
        </blockquote>
      </ScrollReveal>

      <section id="key" className={styles.section} aria-labelledby="key-titulo">
        <SectionHeader
          id="key-titulo"
          eyebrow="MinimalShop Key"
          title={
            <>
              La llave que trae <em>cada tienda.</em>
            </>
          }
          lede="MinimalShop Key es el conjunto de módulos de minimalecommerceAPI: lo difícil de una tienda ya resuelto. Unos vienen incluidos; otros se activan cuando los necesitas."
        />
        <KeyModules />
        <div className={styles.repos}>
          <a className={styles.repo} href={API_REPO_URL} target="_blank" rel="noopener noreferrer">
            <FolderGit2 size={24} strokeWidth={1.5} aria-hidden />
            <span className={styles.repoText}>
              <span className={styles.repoKicker}>El motor</span>
              <span className={styles.repoName}>minimalecommerceapi</span>
              <span className={styles.repoBody}>API NestJS: catálogo, carrito, checkout, pagos y pedidos.</span>
            </span>
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden />
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
          <a
            className={styles.repo}
            href={STOREFRONT_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Store size={24} strokeWidth={1.5} aria-hidden />
            <span className={styles.repoText}>
              <span className={styles.repoKicker}>La vitrina</span>
              <span className={styles.repoName}>minimalshop</span>
              <span className={styles.repoBody}>Este storefront Next.js, listo para tomar tu estilo.</span>
            </span>
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden />
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="personaliza">
        <SectionHeader
          id="personaliza"
          eyebrow="Tu estilo"
          title={
            <>
              Personaliza tu tienda <em>como quieras.</em>
            </>
          }
          lede="Prueba: el motor no cambia, la vitrina sí. Elige una paleta, una tipografía y un acabado de cristal."
        />
        <StoreCustomizer />
      </section>

      <section className={styles.section} aria-labelledby="lanzar">
        <SectionHeader
          id="lanzar"
          eyebrow="De la API a tu tienda"
          title={
            <>
              Cinco pasos <em>para abrir.</em>
            </>
          }
        />
        <LaunchSteps />
      </section>

      <ScrollReveal as="section" className={styles.closing} aria-labelledby="cierre-func">
        <p className={styles.eyebrow} data-reveal>
          Empieza
        </p>
        <h2 id="cierre-func" className={styles.closingTitle} data-reveal>
          El motor ya está listo. <em>La tienda es tuya.</em>
        </h2>
        <div className={styles.ctas} data-reveal>
          <Button href="/cuenta/registro?rol=VENDEDOR">Vender en MinimalShop</Button>
          <Button href={API_REPO_URL} variant="secondary">
            Usar minimalecommerceAPI
          </Button>
        </div>
      </ScrollReveal>
    </div>
  );
}
