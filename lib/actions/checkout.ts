'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { consultarCupon } from '@/lib/api/catalogo';
import { createApiClient } from '@/lib/api/client';
import { crearDireccion } from '@/lib/api/direcciones';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { iniciarIntentoPago } from '@/lib/api/pagos';
import { crearPedido } from '@/lib/api/pedidos';
import { createServerApiClient } from '@/lib/api/server';
import { describeCoupon, previewDiscount } from '@/lib/checkout/coupon';
import { formatPrice } from '@/lib/format';

export type CheckoutActionState = {
  readonly ok: boolean;
  readonly message?: string;
  readonly correlationId?: string;
  readonly pedidoId?: string;
};

export type CouponPreviewState = {
  readonly ok: boolean;
  readonly codigo?: string;
  readonly descripcion?: string;
  readonly descuento?: number;
  readonly message?: string;
};

/** Checks a code against the public coupon endpoint and previews the discount. */
export async function previewCouponAction(
  codigo: string,
  subtotal: number,
): Promise<CouponPreviewState> {
  const clean = codigo.trim().toUpperCase();
  if (!clean) return { ok: false, message: 'Escribe un código.' };
  if (clean.length > 40) return { ok: false, message: 'El código es demasiado largo.' };
  try {
    const cupon = await consultarCupon(clean, createApiClient());
    return {
      ok: true,
      codigo: cupon.codigo,
      descripcion: describeCoupon(cupon, formatPrice),
      descuento: previewDiscount(cupon, subtotal),
    };
  } catch (error) {
    if (error instanceof ApiClientError) {
      const { mapped } = error;
      const msg =
        mapped.kind === 'not_found'
          ? 'Ese código no existe.'
          : mapped.kind === 'conflict' && mapped.code === 'MODULE_DISABLED'
            ? 'Los cupones no están activos en esta tienda.'
            : mapped.kind === 'conflict'
              ? 'El cupón no está vigente o ya agotó sus usos.'
              : userFacingMessage(mapped);
      return { ok: false, message: msg };
    }
    return { ok: false, message: 'No pudimos validar el cupón ahora.' };
  }
}

export async function placeOrderAction(
  _prev: CheckoutActionState,
  formData: FormData,
): Promise<CheckoutActionState> {
  const direccionId = String(formData.get('direccionId') ?? '').trim();
  const direccionEnvio = String(formData.get('direccionEnvio') ?? '').trim();
  const etiqueta = String(formData.get('etiqueta') ?? 'Envío').trim();
  const ciudad = String(formData.get('ciudad') ?? '').trim();
  const telefono = String(formData.get('telefono') ?? '').trim();
  const codigoPostal = String(formData.get('codigoPostal') ?? '').trim();
  const guardar = formData.get('guardar') === 'on';
  const cupon = String(formData.get('cupon') ?? '').trim();
  const idempotencyKey = String(
    formData.get('idempotencyKey') ?? crypto.randomUUID(),
  );

  try {
    const client = await createServerApiClient();
    let addressId = direccionId || undefined;

    if (!addressId && direccionEnvio.length >= 5 && guardar) {
      const created = await crearDireccion(
        {
          etiqueta: etiqueta || 'Envío',
          direccion: direccionEnvio,
          ...(ciudad ? { ciudad } : {}),
          ...(codigoPostal ? { codigoPostal } : {}),
          ...(telefono ? { telefono } : {}),
          principal: true,
        },
        client,
      );
      addressId = created.id;
    }
    // One-off address: send it as text on the order (city and phone appended).
    const envioTexto = [direccionEnvio, ciudad, codigoPostal, telefono ? `Tel. ${telefono}` : '']
      .filter(Boolean)
      .join(', ')
      .slice(0, 300);

    if (!addressId && direccionEnvio.length < 5) {
      return {
        ok: false,
        message: 'Indica una dirección de envío válida.',
      };
    }

    const pedido = await crearPedido(
      {
        ...(addressId ? { direccionId: addressId } : {}),
        ...(!addressId && direccionEnvio ? { direccionEnvio: envioTexto } : {}),
        ...(cupon ? { cupon } : {}),
      },
      idempotencyKey,
      client,
    );

    try {
      await iniciarIntentoPago(pedido.id, client);
    } catch {
      // Order exists; payment can be retried on the order page.
    }

    revalidatePath('/carrito');
    revalidatePath('/cuenta/pedidos');
    redirect(`/cuenta/pedidos/${pedido.id}?pago=1`);
  } catch (error) {
    rethrowRedirect(error);
    if (error instanceof ApiClientError) {
      return {
        ok: false,
        message: userFacingMessage(error.mapped),
        correlationId: error.correlationId,
      };
    }
    return { ok: false, message: 'No se pudo crear el pedido.' };
  }
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
