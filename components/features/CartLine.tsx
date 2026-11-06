'use client';

import { AlertTriangle, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useTransition } from 'react';

import {
  Button,
  PriceTag,
  ProductImage,
  ProductPlaceholder,
  QuantityStepper,
} from '@/components/ui';
import {
  removeCartItemAction,
  updateCartItemAction,
} from '@/lib/actions/carrito';
import type { ItemCarrito } from '@/lib/api/types';

import styles from './CartLine.module.css';

export interface CartLineProps {
  readonly item: ItemCarrito;
  readonly imagenUrl?: string | null | undefined;
  readonly categoria?: string | null | undefined;
}

export function CartLine({ item, imagenUrl, categoria }: CartLineProps) {
  const [pending, start] = useTransition();
  const stepperId = `cantidad-${item.productoId}`;

  return (
    <li className={`${styles.line} ${pending ? styles.pending : ''}`} aria-busy={pending}>
      <Link
        href={`/catalogo/${item.productoId}`}
        className={styles.thumb}
        tabIndex={-1}
        aria-hidden="true"
      >
        {imagenUrl ? (
          <ProductImage
            src={imagenUrl}
            alt=""
            sizes="96px"
            fallback={<ProductPlaceholder nombre={item.nombre} categoria={categoria} size="thumb" />}
          />
        ) : (
          <ProductPlaceholder nombre={item.nombre} categoria={categoria} size="thumb" />
        )}
      </Link>
      <div className={styles.info}>
        <h2 className={styles.title}>
          <Link href={`/catalogo/${item.productoId}`}>{item.nombre}</Link>
        </h2>
        <p className={styles.unit}>
          <PriceTag amount={item.precioUnitario} /> <span>c/u</span>
        </p>
        {!item.disponible ? (
          <p className={styles.warn}>
            <AlertTriangle size={14} strokeWidth={1.5} aria-hidden />
            Solo quedan {item.existencias}. Ajusta la cantidad.
          </p>
        ) : null}
      </div>
      <div className={styles.qty}>
        <QuantityStepper
          id={stepperId}
          variant="compact"
          label={`Cantidad de ${item.nombre}`}
          value={item.cantidad}
          min={1}
          max={Math.max(item.existencias, item.cantidad)}
          disabled={pending}
          onChange={(cantidad) => {
            const fd = new FormData();
            fd.set('productoId', item.productoId);
            fd.set('cantidad', String(cantidad));
            start(async () => {
              await updateCartItemAction(fd);
            });
          }}
        />
      </div>
      <div className={styles.side}>
        <PriceTag amount={item.subtotal} />
        <form
          action={(fd) => {
            start(async () => {
              await removeCartItemAction(fd);
            });
          }}
        >
          <input type="hidden" name="productoId" value={item.productoId} />
          <Button type="submit" variant="tertiary" disabled={pending}>
            <Trash2 size={16} strokeWidth={1.5} aria-hidden />
            Quitar
          </Button>
        </form>
      </div>
    </li>
  );
}
