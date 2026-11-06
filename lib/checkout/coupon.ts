import type { CuponPublico } from '@/lib/api/types';

/**
 * Same rule as the API (`calcularDescuento`): percentage capped at 100, never more than the
 * subtotal, rounded to cents. Used only to preview; the order total comes from the API.
 */
export function previewDiscount(cupon: Pick<CuponPublico, 'tipo' | 'valor'>, subtotal: number): number {
  const bruto = cupon.tipo === 'PORCENTAJE' ? (subtotal * Math.min(cupon.valor, 100)) / 100 : cupon.valor;
  return Math.round(Math.max(0, Math.min(subtotal, bruto)) * 100) / 100;
}

export function describeCoupon(cupon: Pick<CuponPublico, 'tipo' | 'valor'>, format: (n: number) => string): string {
  return cupon.tipo === 'PORCENTAJE'
    ? `${cupon.valor.toLocaleString('es-CO')} % de descuento`
    : `${format(cupon.valor)} de descuento`;
}
