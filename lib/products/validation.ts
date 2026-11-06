/** Seller product rules — mirror the API DTOs (CrearProductoDto, image upload limits). */
export const PRODUCT_LIMITS = {
  nombreMin: 2,
  nombreMax: 150,
  descripcionMax: 5000,
  descripcionRecomendada: 80,
  precioMin: 1,
  precioMax: 99_999_999,
  existenciasMax: 1_000_000,
  imagenMaxBytes: 5 * 1024 * 1024,
  imagenTipos: ['image/jpeg', 'image/png', 'image/webp'] as readonly string[],
} as const;

export interface ProductDraft {
  readonly nombre: string;
  readonly descripcion: string;
  readonly precio: string;
  readonly existencias: string;
  readonly categoriaId: string;
}

export type ProductField = keyof ProductDraft | 'archivo';
export type ProductErrors = Partial<Record<ProductField, string>>;

export function validateImage(file: { type: string; size: number }): string | undefined {
  if (!PRODUCT_LIMITS.imagenTipos.includes(file.type)) {
    return 'Usa una foto JPG, PNG o WebP.';
  }
  if (file.size > PRODUCT_LIMITS.imagenMaxBytes) {
    return 'La foto pesa más de 5 MB. Redúcela o expórtala en calidad web.';
  }
  return undefined;
}

/** Field-level messages in plain Spanish; empty object when the draft is valid. */
export function validateProduct(d: ProductDraft): ProductErrors {
  const errors: ProductErrors = {};
  const nombre = d.nombre.trim();
  if (nombre.length < PRODUCT_LIMITS.nombreMin) {
    errors.nombre = 'Escribe un nombre de al menos 2 caracteres.';
  } else if (nombre.length > PRODUCT_LIMITS.nombreMax) {
    errors.nombre = 'El nombre admite hasta 150 caracteres.';
  }
  if (d.descripcion.length > PRODUCT_LIMITS.descripcionMax) {
    errors.descripcion = 'La descripción admite hasta 5.000 caracteres.';
  }
  const precio = Number(d.precio);
  if (d.precio.trim() === '' || !Number.isFinite(precio)) {
    errors.precio = 'Indica el precio en pesos.';
  } else if (precio < PRODUCT_LIMITS.precioMin || precio > PRODUCT_LIMITS.precioMax) {
    errors.precio = 'El precio debe estar entre $ 1 y $ 99.999.999.';
  }
  const existencias = Number(d.existencias);
  if (d.existencias.trim() === '' || !Number.isInteger(existencias)) {
    errors.existencias = 'Indica cuántas unidades tienes (número entero).';
  } else if (existencias < 0 || existencias > PRODUCT_LIMITS.existenciasMax) {
    errors.existencias = 'Las existencias van de 0 a 1.000.000.';
  }
  if (!d.categoriaId) {
    errors.categoriaId = 'Elige una categoría.';
  }
  return errors;
}
