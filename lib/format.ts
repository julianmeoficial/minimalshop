const priceFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Format money for the storefront (COP / es-CO). */
export function formatPrice(value: number): string {
  return priceFormatter.format(value);
}
