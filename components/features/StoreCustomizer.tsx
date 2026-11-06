'use client';

import { ShoppingBag } from 'lucide-react';
import { LayoutGroup, motion, useAnimate, useReducedMotion } from 'motion/react';
import Image from 'next/image';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

import { GlassSurface } from '@/components/ui';
import { photos } from '@/lib/content/photos';
import { formatPrice } from '@/lib/format';
import { duration, easeOutQuart } from '@/lib/motion';

import styles from './StoreCustomizer.module.css';

type Palette = 'papel' | 'pino' | 'arena';
type Typeface = 'editorial' | 'clara' | 'tecnica';
type Finish = 'liquid' | 'crystal';
type Corners = 'rectas' | 'suaves';

/** Every value is a design token: the demo shows what tokens.css controls. */
const PALETTES: Record<Palette, CSSProperties> = {
  papel: { '--demo-bg': 'var(--color-paper)', '--demo-accent': 'var(--color-ink)', '--demo-soft': 'var(--color-ink-soft)' } as CSSProperties,
  pino: { '--demo-bg': 'var(--tint-pine)', '--demo-accent': 'var(--color-pine)', '--demo-soft': 'var(--tint-pine-text)' } as CSSProperties,
  arena: { '--demo-bg': 'var(--tint-warn)', '--demo-accent': 'var(--color-warn)', '--demo-soft': 'var(--tint-warn-text)' } as CSSProperties,
};

const TYPEFACES: Record<Typeface, CSSProperties> = {
  editorial: { '--demo-font': 'var(--font-display)' } as CSSProperties,
  clara: { '--demo-font': 'var(--font-ui)' } as CSSProperties,
  tecnica: { '--demo-font': 'var(--font-mono)' } as CSSProperties,
};

const CORNERS: Record<Corners, CSSProperties> = {
  rectas: { '--demo-radius': 'var(--radius-sm)' } as CSSProperties,
  suaves: { '--demo-radius': 'var(--radius-liquid)' } as CSSProperties,
};

interface Option<T extends string> {
  readonly value: T;
  readonly label: string;
}

interface SegmentedProps<T extends string> {
  readonly legend: string;
  readonly name: string;
  readonly options: readonly Option<T>[];
  readonly value: T;
  readonly onChange: (value: T) => void;
}

function Segmented<T extends string>({ legend, name, options, value, onChange }: SegmentedProps<T>) {
  const reduced = useReducedMotion();
  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>{legend}</legend>
      <div className={styles.segments}>
        <LayoutGroup id={name}>
          {options.map((o) => {
            const checked = o.value === value;
            return (
              <label key={o.value} className={`${styles.segment} ${checked ? styles.segmentOn : ''}`}>
                <input
                  type="radio"
                  name={name}
                  value={o.value}
                  checked={checked}
                  onChange={() => onChange(o.value)}
                  className={styles.radio}
                />
                {checked ? (
                  <motion.span
                    layoutId={`${name}-pill`}
                    className={styles.pill}
                    transition={reduced ? { duration: duration.reduced } : { duration: duration.enter, ease: easeOutQuart }}
                  />
                ) : null}
                <span className={styles.segmentLabel}>{o.label}</span>
              </label>
            );
          })}
        </LayoutGroup>
      </div>
    </fieldset>
  );
}

/**
 * «Personaliza tu tienda»: the same engine, a different storefront. Motion drives the
 * segmented pills (shared layout) and a short settle on the preview after each change.
 */
export function StoreCustomizer() {
  const [palette, setPalette] = useState<Palette>('papel');
  const [typeface, setTypeface] = useState<Typeface>('editorial');
  const [finish, setFinish] = useState<Finish>('liquid');
  const [corners, setCorners] = useState<Corners>('suaves');
  const [storeName, setStoreName] = useState('Tu tienda');
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const reduced = useReducedMotion();
  const first = useRef(true);
  const nameId = useId();

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduced || !scope.current) return;
    void animate(
      scope.current,
      { scale: [0.985, 1], opacity: [0.85, 1] },
      { duration: duration.enter, ease: easeOutQuart },
    );
  }, [palette, typeface, finish, corners, animate, scope, reduced]);

  const style: CSSProperties = {
    ...PALETTES[palette],
    ...TYPEFACES[typeface],
    ...CORNERS[corners],
  };
  const name = storeName.trim() || 'Tu tienda';

  return (
    <div className={styles.root}>
      <form className={styles.controls} onSubmit={(e) => e.preventDefault()} aria-label="Opciones de la tienda de ejemplo">
        <div className={styles.group}>
          <label className={styles.legend} htmlFor={nameId}>
            Nombre de la tienda
          </label>
          <input
            id={nameId}
            className={styles.input}
            value={storeName}
            maxLength={24}
            autoComplete="off"
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>
        <Segmented
          legend="Paleta"
          name="paleta"
          value={palette}
          onChange={setPalette}
          options={[
            { value: 'papel', label: 'Papel' },
            { value: 'pino', label: 'Pino' },
            { value: 'arena', label: 'Arena' },
          ]}
        />
        <Segmented
          legend="Tipografía"
          name="tipografia"
          value={typeface}
          onChange={setTypeface}
          options={[
            { value: 'editorial', label: 'Editorial' },
            { value: 'clara', label: 'Clara' },
            { value: 'tecnica', label: 'Técnica' },
          ]}
        />
        <Segmented
          legend="Cristal"
          name="cristal"
          value={finish}
          onChange={setFinish}
          options={[
            { value: 'liquid', label: 'Liquid' },
            { value: 'crystal', label: 'Crystal' },
          ]}
        />
        <Segmented
          legend="Esquinas"
          name="esquinas"
          value={corners}
          onChange={setCorners}
          options={[
            { value: 'suaves', label: 'Suaves' },
            { value: 'rectas', label: 'Rectas' },
          ]}
        />
      </form>

      <div className={styles.stage} aria-live="polite">
        <p className="sr-only">
          Vista previa: {name}, paleta {palette}, tipografía {typeface}, cristal {finish},
          esquinas {corners}.
        </p>
        <div ref={scope} className={styles.preview} style={style} aria-hidden="true">
          <div className={styles.bar}>
            <span className={styles.brand}>{name}</span>
            <span className={styles.barLinks}>
              <span>Catálogo</span>
              <span className={styles.cartDot}>
                <ShoppingBag size={14} strokeWidth={1.5} />
              </span>
            </span>
          </div>
          <div className={styles.product}>
            <div className={styles.photo}>
              <Image
                src={photos.cuencos.src}
                alt=""
                fill
                placeholder="blur"
                sizes="(max-width: 1024px) 90vw, 30vw"
                className={styles.image}
              />
              <GlassSurface as="span" variant={finish} strong className={styles.price}>
                {formatPrice(89900)}
              </GlassSurface>
            </div>
            <div className={styles.info}>
              <span className={styles.kicker}>Hogar</span>
              <span className={styles.title}>Cuencos de gres</span>
              <span className={styles.cta}>Agregar al carrito</span>
            </div>
          </div>
        </div>
        <p className={styles.note}>
          Mismo motor, otra vitrina: estos cambios son tokens en <code>styles/tokens.css</code>.
        </p>
      </div>
    </div>
  );
}
