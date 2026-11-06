import { describe, expect, it } from 'vitest';

import { validateImage, validateProduct } from './validation';

const ok = {
  nombre: 'Jarrón',
  descripcion: '',
  precio: '89900',
  existencias: '3',
  categoriaId: 'c1',
};

describe('validateProduct', () => {
  it('accepts a complete draft', () => {
    expect(validateProduct(ok)).toEqual({});
  });

  it('flags each invalid field with a Spanish message', () => {
    const errors = validateProduct({
      nombre: 'a',
      descripcion: '',
      precio: '0',
      existencias: '1.5',
      categoriaId: '',
    });
    expect(Object.keys(errors).sort()).toEqual(['categoriaId', 'existencias', 'nombre', 'precio']);
  });
});

describe('validateImage', () => {
  it('rejects unsupported types and files over 5 MB', () => {
    expect(validateImage({ type: 'image/gif', size: 10 })).toBeDefined();
    expect(validateImage({ type: 'image/jpeg', size: 6 * 1024 * 1024 })).toBeDefined();
    expect(validateImage({ type: 'image/webp', size: 1024 })).toBeUndefined();
  });
});
