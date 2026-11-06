import type { Metadata } from 'next';

import { FaqList } from '@/components/features/FaqList';
import { JsonLd } from '@/components/features/JsonLd';
import { SectionHeader } from '@/components/features/SectionHeader';
import { Button } from '@/components/ui';
import { ALL_FAQ_ITEMS, FAQ } from '@/lib/content/faq';
import { faqJsonLd } from '@/lib/seo';

import styles from './faq.module.css';

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description:
    'Pagos, cupones, seguimiento de pedidos, cancelaciones y cómo vender en MinimalShop.',
  alternates: { canonical: '/preguntas-frecuentes' },
};

export default function PreguntasFrecuentesPage() {
  return (
    <div className={styles.page}>
      <JsonLd data={faqJsonLd(ALL_FAQ_ITEMS)} />
      <SectionHeader
        id="faq-titulo"
        level="h1"
        eyebrow="Ayuda"
        title={
          <>
            Preguntas <em>frecuentes.</em>
          </>
        }
        lede="Lo que suele preguntarse antes de comprar, mientras llega un pedido y al empezar a vender."
      />
      <div className={styles.layout}>
        <nav className={styles.toc} aria-label="Temas">
          <ul>
            {FAQ.map((group) => (
              <li key={group.title}>
                <a href={`#${slug(group.title)}`}>{group.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.groups}>
          {FAQ.map((group) => (
            <section
              key={group.title}
              id={slug(group.title)}
              aria-labelledby={`${slug(group.title)}-t`}
              className={styles.group}
            >
              <h2 id={`${slug(group.title)}-t`} className={styles.groupTitle}>
                {group.title}
              </h2>
              <FaqList items={group.items} />
            </section>
          ))}
          <div className={styles.more}>
            <p>¿No encontraste tu respuesta? Revisa el estado de tu pedido o explora el catálogo.</p>
            <div className={styles.actions}>
              <Button href="/cuenta/pedidos" variant="secondary">
                Ver mis pedidos
              </Button>
              <Button href="/catalogo" variant="tertiary">
                Ir al catálogo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
