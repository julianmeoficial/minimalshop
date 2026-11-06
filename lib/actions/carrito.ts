'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import {
  agregarItemCarrito,
  actualizarItemCarrito,
  quitarItemCarrito,
  vaciarCarrito,
} from '@/lib/api/carrito';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';

export type CartActionState = {
  readonly ok: boolean;
  readonly message?: string;
  readonly correlationId?: string;
};

export async function addToCartAction(
  _prev: CartActionState,
  formData: FormData,
): Promise<CartActionState> {
  const productoId = String(formData.get('productoId') ?? '');
  const cantidad = Number(formData.get('cantidad') ?? '1');
  try {
    const client = await createServerApiClient();
    await agregarItemCarrito(productoId, cantidad, client);
    revalidatePath('/carrito');
    redirect('/carrito?agregado=1');
  } catch (error) {
    rethrowRedirect(error);
    return mapError(error);
  }
}

export async function updateCartItemAction(formData: FormData): Promise<void> {
  const productoId = String(formData.get('productoId') ?? '');
  const cantidad = Number(formData.get('cantidad') ?? '1');
  const client = await createServerApiClient();
  await actualizarItemCarrito(productoId, cantidad, client);
  revalidatePath('/carrito');
}

export async function removeCartItemAction(formData: FormData): Promise<void> {
  const productoId = String(formData.get('productoId') ?? '');
  const client = await createServerApiClient();
  await quitarItemCarrito(productoId, client);
  revalidatePath('/carrito');
}

export async function clearCartAction(): Promise<void> {
  const client = await createServerApiClient();
  await vaciarCarrito(client);
  revalidatePath('/carrito');
}

function mapError(error: unknown): CartActionState {
  if (error instanceof ApiClientError) {
    return {
      ok: false,
      message: userFacingMessage(error.mapped),
      correlationId: error.correlationId,
    };
  }
  return { ok: false, message: 'No se pudo actualizar el carrito.' };
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
