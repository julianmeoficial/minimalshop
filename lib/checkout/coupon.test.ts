import { describe, expect, it } from 'vitest';

import { previewDiscount } from './coupon';

describe('previewDiscount', () => {
  it('applies a percentage of the subtotal', () => {
    expect(previewDiscount({ tipo: 'PORCENTAJE', valor: 10 }, 59900)).toBe(5990);
  });

  it('caps percentages at 100 and fixed amounts at the subtotal', () => {
    expect(previewDiscount({ tipo: 'PORCENTAJE', valor: 150 }, 1000)).toBe(1000);
    expect(previewDiscount({ tipo: 'MONTO_FIJO', valor: 50000 }, 20000)).toBe(20000);
  });
});
