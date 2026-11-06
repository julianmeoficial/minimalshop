import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

import { SectionHeader } from '@/components/features/SectionHeader';
import { photos } from '@/lib/content/photos';

import styles from './creditos.module.css';

export const metadata: Metadata = {
  title: 'Créditos de fotografía',
  description: 'Fotografías editoriales usadas en MinimalShop y sus autores.',
};

export default function CreditosPage() {
  const list = Object.values(photos);
  return (
    <div className={styles.page}>
      <SectionHeader
        id="creditos-titulo"
        level="h1"
        eyebrow="Créditos"
        title={
          <>
            Fotografía <em>editorial.</em>
          </>
        }
        lede="Las imágenes de ambientación se publican bajo la Licencia de Unsplash: uso libre, también comercial, sin pedir permiso. Aun así, nombramos a quien las tomó."
      />
      <ul className={styles.grid}>
        {list.map((p) => (
          <li key={p.sourceUrl} className={styles.item}>
            <div className={styles.media}>
              <Image
                src={p.src}
                alt=""
                fill
                placeholder="blur"
                sizes="(max-width: 768px) 50vw, 25vw"
                className={styles.image}
              />
            </div>
            <p className={styles.alt}>{p.alt}</p>
            <p className={styles.meta}>
              <a href={p.authorUrl} rel="noopener noreferrer" target="_blank">
                {p.author}
                <span className="sr-only"> (abre en otra pestaña)</span>
              </a>
              {' · '}
              <a href={p.sourceUrl} rel="noopener noreferrer" target="_blank">
                Ver en Unsplash
                <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden />
                <span className="sr-only"> (abre en otra pestaña)</span>
              </a>
            </p>
          </li>
        ))}
      </ul>
      <p className={styles.license}>
        Licencia:{' '}
        <a href="https://unsplash.com/license" rel="noopener noreferrer" target="_blank">
          unsplash.com/license
        </a>
        . Las fotos de producto las publica cada vendedor.
      </p>
    </div>
  );
}
