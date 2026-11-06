'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, type ReactNode } from 'react';

import { Button } from '@/components/ui';
import { photos } from '@/lib/content/photos';
import { createHeroIntro } from '@/lib/motion';

import styles from './HomeHero.module.css';

const HEADLINE = ['Objetos claros,', 'vendidos', 'sin ruido.'] as const;

/**
 * Home composition (DESIGN.md §9): brand signal, one headline, one supporting line,
 * one CTA group, one dominant image plane. Motion: GSAP intro, two animations max.
 */
export interface HomeHeroProps {
  /** Floating liquid-glass card on the photo (streams in; never animated by GSAP). */
  readonly featured?: ReactNode;
}

export function HomeHero({ featured }: HomeHeroProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) {
      return;
    }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    root.dataset['intro'] = 'running';
    if (reduced) {
      return;
    }
    const handle = createHeroIntro(root, { reducedMotion: reduced });
    return () => handle.kill();
  }, []);

  return (
    <section
      ref={ref}
      className={styles.hero}
      aria-labelledby="home-title"
      data-intro="pending"
    >
      <div className={styles.copy}>
        <p className={styles.eyebrow} data-hero-fade>
          <span>MinimalShop</span>
          <span aria-hidden="true">·</span>
          <span>Catálogo editorial</span>
        </p>
        <h1 className={styles.title} id="home-title">
          {HEADLINE.map((line) => (
            <span key={line} className={styles.mask}>
              <span className={styles.line} data-hero-line>
                {line}
              </span>
            </span>
          ))}
        </h1>
        <p className={styles.lede} data-hero-fade>
          Cerámica, textiles y piezas de uso diario de pequeños talleres. Precio a la
          vista, pago con pasarela segura y un pedido que puedes seguir paso a paso.
        </p>
        <div className={styles.ctas} data-hero-fade>
          <Button href="/catalogo">
            Explorar el catálogo
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
          </Button>
          <Button href="/#vender" variant="secondary">
            Vender en MinimalShop
          </Button>
        </div>
      </div>

      <figure className={styles.media} data-hero-media>
        <Image
          src={photos.hero.src}
          alt={photos.hero.alt}
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 1024px) 100vw, 55vw"
          className={styles.image}
        />
        {featured}
      </figure>
    </section>
  );
}
