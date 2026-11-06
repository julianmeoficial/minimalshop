/** Public site identity, used by metadata, sitemap and structured data. */
export const SITE_NAME = 'MinimalShop';

export const SITE_DESCRIPTION =
  'Tienda editorial para pequeños vendedores: ropa, calzado, hogar, tecnología y más, con precios en pesos colombianos.';

/** Absolute origin of the storefront (no trailing slash). Set NEXT_PUBLIC_SITE_URL in prod. */
export const SITE_URL = (process.env['NEXT_PUBLIC_SITE_URL'] ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
