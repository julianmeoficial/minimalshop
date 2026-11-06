import { describe, expect, it } from 'vitest';

import type { ProductoListado } from '@/lib/api/types';

import { breadcrumbJsonLd, productJsonLd } from './seo';

const base: ProductoListado = {
  id: 'p1',
  nombre: 'Jarrón',
  descripcion: 'Cerámica',
  precio: 89900,
  existencias: 3,
  disponible: true,
  imagenUrl: null,
  categoria: { id: 'c1', nombre: 'Hogar' },
  vendedor: { id: 'v1', nombre: 'Taller' },
  preventa: false,
  activo: true,
  creadoEn: '2026-11-06T00:00:00.000Z',
};

describe('productJsonLd', () => {
  it('maps price in COP and stock to availability', () => {
    const ld = productJsonLd(base) as { offers: Record<string, unknown>; image?: unknown };
    expect(ld.offers['priceCurrency']).toBe('COP');
    expect(ld.offers['price']).toBe(89900);
    expect(ld.offers['availability']).toBe('https://schema.org/InStock');
    expect(ld.image).toBeUndefined();
  });

  it('marks pre-sale and sold-out products', () => {
    const pre = productJsonLd({ ...base, preventa: true }) as { offers: Record<string, unknown> };
    const out = productJsonLd({ ...base, disponible: false }) as { offers: Record<string, unknown> };
    expect(pre.offers['availability']).toBe('https://schema.org/PreOrder');
    expect(out.offers['availability']).toBe('https://schema.org/OutOfStock');
  });
});

describe('breadcrumbJsonLd', () => {
  it('numbers items from 1 with absolute URLs', () => {
    const ld = breadcrumbJsonLd([{ name: 'Catálogo', path: '/catalogo' }]) as {
      itemListElement: { position: number; item: string }[];
    };
    expect(ld.itemListElement[0]?.position).toBe(1);
    expect(ld.itemListElement[0]?.item).toMatch(/^https?:\/\/.+\/catalogo$/);
  });
});
