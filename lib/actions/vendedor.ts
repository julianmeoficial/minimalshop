'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import type { SellerOrderStatus } from '@/lib/api/types';
import {
  validateImage,
  validateProduct,
  type ProductDraft,
  type ProductErrors,
} from '@/lib/products/validation';
import {
  actualizarProducto,
  ajustarExistencias,
  cambiarEstadoPedidoVendedor,
  crearProducto,
  despublicarProducto,
  publicarProducto,
  subirImagenProducto,
} from '@/lib/api/vendedor';

export type SellerActionState = {
  readonly ok: boolean;
  readonly message?: string;
  readonly correlationId?: string;
  readonly fieldErrors?: ProductErrors;
};

function readDraft(formData: FormData): ProductDraft {
  return {
    nombre: String(formData.get('nombre') ?? ''),
    descripcion: String(formData.get('descripcion') ?? ''),
    precio: String(formData.get('precio') ?? ''),
    existencias: String(formData.get('existencias') ?? ''),
    categoriaId: String(formData.get('categoriaId') ?? ''),
  };
}

function readImage(formData: FormData): File | null {
  const file = formData.get('archivo');
  return file instanceof File && file.size > 0 ? file : null;
}

/** Same rules as the form, re-checked on the server (never trust the client). */
function checkInput(draft: ProductDraft, image: File | null): SellerActionState | null {
  const fieldErrors: ProductErrors = validateProduct(draft);
  const imageError = image ? validateImage(image) : undefined;
  if (imageError) fieldErrors.archivo = imageError;
  return Object.keys(fieldErrors).length > 0
    ? { ok: false, message: 'Revisa los campos marcados.', fieldErrors }
    : null;
}

export async function createProductAction(
  _prev: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> {
  const draft = readDraft(formData);
  const image = readImage(formData);
  const invalid = checkInput(draft, image);
  if (invalid) return invalid;
  const publicar = formData.get('activo') === 'on';

  let productoId: string | null = null;
  try {
    const client = await createServerApiClient();
    const producto = await crearProducto(
      {
        nombre: draft.nombre.trim(),
        descripcion: draft.descripcion.trim() || undefined,
        precio: Number(draft.precio),
        existencias: Number(draft.existencias),
        categoriaId: draft.categoriaId,
        preventa: formData.get('preventa') === 'on',
      },
      client,
    );
    productoId = producto.id;
    if (!publicar) {
      await despublicarProducto(producto.id, client);
    }
    if (image) {
      await subirImagenProducto(producto.id, image, image.name, client);
    }
    revalidatePath('/vendedor/productos');
    revalidatePath('/catalogo');
    redirect('/vendedor/productos?guardado=creado');
  } catch (error) {
    rethrowRedirect(error);
    if (productoId) {
      // The product exists; only a later step failed (usually the photo). Keep the work.
      revalidatePath('/vendedor/productos');
      redirect(`/vendedor/productos/${productoId}?aviso=foto`);
    }
    return mapError(error);
  }
}

export async function updateProductAction(
  _prev: SellerActionState,
  formData: FormData,
): Promise<SellerActionState> {
  const id = String(formData.get('id') ?? '');
  const draft = readDraft(formData);
  const image = readImage(formData);
  const invalid = checkInput(draft, image);
  if (invalid) return invalid;
  const activo = formData.get('activo') === 'on';
  const estabaActivo = formData.get('activoAnterior') === 'true';

  try {
    const client = await createServerApiClient();
    await actualizarProducto(
      id,
      {
        nombre: draft.nombre.trim(),
        descripcion: draft.descripcion.trim() || undefined,
        precio: Number(draft.precio),
        categoriaId: draft.categoriaId,
        preventa: formData.get('preventa') === 'on',
      },
      client,
    );
    await ajustarExistencias(id, Number(draft.existencias), client);
    if (activo !== estabaActivo) {
      await (activo ? publicarProducto(id, client) : despublicarProducto(id, client));
    }
    if (image) {
      await subirImagenProducto(id, image, image.name, client);
    }
    revalidatePath('/vendedor/productos');
    revalidatePath('/catalogo');
    revalidatePath(`/catalogo/${id}`);
    redirect('/vendedor/productos?guardado=editado');
  } catch (error) {
    rethrowRedirect(error);
    return mapError(error);
  }
}

export async function togglePublishAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '');
  const publish = formData.get('publish') === '1';
  const client = await createServerApiClient();
  if (publish) {
    await publicarProducto(id, client);
  } else {
    await despublicarProducto(id, client);
  }
  revalidatePath('/vendedor/productos');
  revalidatePath('/catalogo');
}

export async function changeSellerOrderStatusAction(
  formData: FormData,
): Promise<void> {
  const id = String(formData.get('pedidoId') ?? '');
  const estado = String(formData.get('estado') ?? '') as SellerOrderStatus;
  const client = await createServerApiClient();
  await cambiarEstadoPedidoVendedor(id, estado, client);
  revalidatePath('/vendedor/pedidos');
}

function mapError(error: unknown): SellerActionState {
  if (error instanceof ApiClientError) {
    return {
      ok: false,
      message: userFacingMessage(error.mapped),
      correlationId: error.correlationId,
    };
  }
  return { ok: false, message: 'No se pudo guardar el producto.' };
}

function rethrowRedirect(error: unknown): void {
  if (
    typeof error === 'object' &&
    error !== null &&
    'digest' in error &&
    typeof (error as { digest?: unknown }).digest === 'string' &&
    (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
  ) {
    throw error;
  }
}
