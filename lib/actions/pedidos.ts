'use server';

import { revalidatePath } from 'next/cache';

import {
  cancelarPedido,
  confirmarPedidoRecibido,
} from '@/lib/api/pedidos';
import { createServerApiClient } from '@/lib/api/server';

export async function cancelOrderAction(formData: FormData): Promise<void> {
  const id = String(formData.get('pedidoId') ?? '');
  const client = await createServerApiClient();
  await cancelarPedido(id, client);
  revalidatePath('/cuenta/pedidos');
  revalidatePath(`/cuenta/pedidos/${id}`);
}

export async function confirmReceivedAction(formData: FormData): Promise<void> {
  const id = String(formData.get('pedidoId') ?? '');
  const client = await createServerApiClient();
  await confirmarPedidoRecibido(id, client);
  revalidatePath('/cuenta/pedidos');
  revalidatePath(`/cuenta/pedidos/${id}`);
}
