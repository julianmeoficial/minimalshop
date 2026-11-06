'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ProductImage, ProductPlaceholder } from '@/components/ui';

import styles from './RecentlyViewed.module.css';

const STORAGE_KEY = 'minimalshop:vistos';
const MAX_STORED = 8;
const MAX_SHOWN = 4;

export interface ViewedProduct {
  readonly id: string;
  readonly nombre: string;
  readonly categoria: string;
  readonly imagenUrl: string | null;
}

function read(): ViewedProduct[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is ViewedProduct =>
        typeof p === 'object' &&
        p !== null &&
        typeof (p as ViewedProduct).id === 'string' &&
        typeof (p as ViewedProduct).nombre === 'string',
    );
  } catch {
    return [];
  }
}

function write(items: readonly ViewedProduct[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, MAX_STORED)));
  } catch {
    // private mode or storage full: the strip is a convenience, skip silently
  }
}

export interface RecentlyViewedProps {
  readonly current: ViewedProduct;
}

/**
 * "Vistos recientemente": a per-visitor convenience kept in this browser only. Prices are
 * not stored (they could be stale); the link leads to the live product page.
 */
export function RecentlyViewed({ current }: RecentlyViewedProps) {
  const [items, setItems] = useState<ViewedProduct[]>([]);

  const { id, nombre, categoria, imagenUrl } = current;

  useEffect(() => {
    const previous = read().filter((p) => p.id !== id);
    setItems(previous.slice(0, MAX_SHOWN));
    write([{ id, nombre, categoria, imagenUrl }, ...previous]);
  }, [id, nombre, categoria, imagenUrl]);

  if (items.length === 0) {
    return null;
  }

  return (
    <section className={styles.root} aria-labelledby="vistos-titulo">
      <h2 id="vistos-titulo" className={styles.title}>
        Vistos recientemente
      </h2>
      <ul className={styles.list}>
        {items.map((p) => (
          <li key={p.id}>
            <Link href={`/catalogo/${p.id}`} className={styles.item}>
              <span className={styles.thumb}>
                {p.imagenUrl ? (
                  <ProductImage
                    src={p.imagenUrl}
                    alt=""
                    sizes="64px"
                    fallback={
                      <ProductPlaceholder nombre={p.nombre} categoria={p.categoria} size="thumb" />
                    }
                  />
                ) : (
                  <ProductPlaceholder nombre={p.nombre} categoria={p.categoria} size="thumb" />
                )}
              </span>
              <span className={styles.text}>
                <span className={styles.category}>{p.categoria}</span>
                <span className={styles.name}>{p.nombre}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
