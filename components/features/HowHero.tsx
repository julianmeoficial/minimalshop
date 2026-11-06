'use client';

import { ArrowUpRight } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui';
import { API_REPO_URL } from '@/lib/content/funcionamiento';
import { createLineDraw, createWordReveal } from '@/lib/motion';

import styles from './HowHero.module.css';

const LINES = [['Una', 'API.'], ['Infinitas', 'tiendas'], ['minimalistas.']] as const;

const MODULES = [
  { y: 60, label: 'Catálogo' },
  { y: 162, label: 'Pagos' },
  { y: 264, label: 'Pedidos' },
] as const;

const STORES = [
  { y: 30, label: 'MinimalShop', accent: false },
  { y: 152, label: 'Tu tienda', accent: true },
  { y: 274, label: 'Otra tienda', accent: false },
] as const;

/**
 * Funcionamiento hero. GSAP owns the whole sequence: words rise out of their masks,
 * then the diagram builds (nodes settle, connectors draw, signal dots appear).
 */
export function HowHero() {
  const copyRef = useRef<HTMLDivElement>(null);
  const diagramRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const copy = copyRef.current;
    const diagram = diagramRef.current;
    if (!copy || !diagram) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const words = createWordReveal(copy, { reducedMotion: reduced });
    const lines = createLineDraw(diagram, { reducedMotion: reduced, delay: reduced ? 0 : 0.5 });
    return () => {
      words.kill();
      lines.kill();
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="como-titulo">
      <div ref={copyRef} className={styles.copy}>
        <p className={styles.eyebrow} data-fade>
          Funcionamiento
        </p>
        <h1 id="como-titulo" className={styles.title}>
          {LINES.map((line, i) => (
            <span key={i} className={styles.line}>
              {line.map((word) => (
                <span key={word} className={styles.mask}>
                  <span className={styles.word} data-word>
                    {word}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>
        <p className={styles.lede} data-fade>
          Así se basa el principio de las tiendas minimalistas: un mismo motor abierto,{' '}
          <strong>minimalecommerceAPI</strong>, que cualquier tienda puede usar, y una vitrina que
          cada una personaliza como quiera.
        </p>
        <div className={styles.ctas} data-fade>
          <Button href={API_REPO_URL}>
            Ver el código de la API
            <ArrowUpRight size={18} strokeWidth={1.5} aria-hidden />
          </Button>
          <Button href="#key" variant="secondary">
            Conocer MinimalShop Key
          </Button>
        </div>
      </div>

      <figure className={styles.figure}>
        <svg
          ref={diagramRef}
          className={styles.diagram}
          viewBox="0 0 480 360"
          role="img"
          aria-labelledby="diagrama-titulo"
        >
          <title id="diagrama-titulo">
            Los módulos de catálogo, pagos y pedidos alimentan una sola API, que sirve a
            MinimalShop, a tu tienda y a cualquier otra tienda.
          </title>

          {MODULES.map((m) => (
            <path
              key={`l-${m.label}`}
              data-draw
              className={styles.wireSoft}
              d={`M130 ${m.y + 18} C 152 ${m.y + 18}, 148 180, 170 180`}
            />
          ))}
          {STORES.map((s) => (
            <path
              key={`r-${s.label}`}
              data-draw
              className={s.accent ? styles.wireAccent : styles.wire}
              d={`M310 180 C 322 180, 318 ${s.y + 28}, 340 ${s.y + 28}`}
            />
          ))}

          {MODULES.map((m) => (
            <g key={m.label} data-node>
              <rect className={styles.module} x="20" y={m.y} width="110" height="36" rx="18" />
              <text className={styles.moduleText} x="75" y={m.y + 23} textAnchor="middle">
                {m.label}
              </text>
            </g>
          ))}

          <g data-node>
            <rect className={styles.core} x="170" y="132" width="140" height="96" rx="14" />
            <text className={styles.coreKicker} x="240" y="166" textAnchor="middle">
              MOTOR
            </text>
            <text className={styles.coreText} x="240" y="190" textAnchor="middle">
              minimalecommerce
            </text>
            <text className={styles.coreText} x="240" y="208" textAnchor="middle">
              API
            </text>
          </g>

          {STORES.map((s) => (
            <g key={s.label} data-node>
              <rect
                className={s.accent ? styles.storeAccent : styles.store}
                x="340"
                y={s.y}
                width="130"
                height="56"
                rx="10"
              />
              <text className={styles.storeText} x="405" y={s.y + 34} textAnchor="middle">
                {s.label}
              </text>
            </g>
          ))}

          {STORES.map((s) => (
            <circle
              key={`p-${s.label}`}
              data-pulse
              className={s.accent ? styles.pulseAccent : styles.pulse}
              cx="340"
              cy={s.y + 28}
              r="4"
            />
          ))}
        </svg>
        <figcaption className={styles.caption}>
          MinimalShop Key → minimalecommerceAPI → tu vitrina.
        </figcaption>
      </figure>
    </section>
  );
}
