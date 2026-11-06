'use server';

import { revalidatePath } from 'next/cache';

import {
  actualizarCategoria,
  administrarUsuario,
  cambiarModulo,
  crearCategoria,
  eliminarCategoria,
  simularPago,
} from '@/lib/api/admin';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import type { ClaveModulo, UserRole } from '@/lib/api/types';
import { readUsuario } from '@/lib/auth/session';

export type AdminActionState = {
  readonly ok: boolean;
  readonly message?: string;
  readonly correlationId?: string;
  /** Changes on every submit so the UI can react even when the message repeats. */
  readonly at?: number;
};

const ROLES: readonly UserRole[] = ['COMPRADOR', 'VENDEDOR', 'SUPERADMIN'];
const MODULOS: readonly ClaveModulo[] = ['cupones', 'resenas', 'favoritos', 'contenido', 'notificaciones'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(error: unknown, fallback: string): AdminActionState {
  if (error instanceof ApiClientError) {
    return {
      ok: false,
      message: userFacingMessage(error.mapped),
      correlationId: error.correlationId,
      at: Date.now(),
    };
  }
  return { ok: false, message: fallback, at: Date.now() };
}

/* ---------- Usuarios ---------- */

export async function updateUserAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get('id') ?? '');
  const rolRaw = formData.get('rol');
  const activoRaw = formData.get('activo');
  const yo = await readUsuario();

  if (yo?.id === id) {
    return {
      ok: false,
      message: 'No puedes cambiar tu propio rol ni desactivar tu cuenta.',
      at: Date.now(),
    };
  }
  const rol = ROLES.find((r) => r === rolRaw);
  const input = {
    ...(rol ? { rol } : {}),
    ...(activoRaw === 'true' || activoRaw === 'false' ? { activo: activoRaw === 'true' } : {}),
  };
  if (Object.keys(input).length === 0) {
    return { ok: false, message: 'No hay cambios que guardar.', at: Date.now() };
  }
  try {
    const client = await createServerApiClient();
    const usuario = await administrarUsuario(id, input, client);
    revalidatePath('/admin/usuarios');
    revalidatePath('/admin');
    return { ok: true, message: `Cuenta de ${usuario.nombre} actualizada.`, at: Date.now() };
  } catch (error) {
    return fail(error, 'No se pudo actualizar la cuenta.');
  }
}

/* ---------- Categorías ---------- */

function readCategoria(formData: FormData): { nombre: string; descripcion: string } {
  return {
    nombre: String(formData.get('nombre') ?? '').trim(),
    descripcion: String(formData.get('descripcion') ?? '').trim(),
  };
}

function checkCategoria(nombre: string, descripcion: string): string | null {
  if (nombre.length < 2) return 'El nombre necesita al menos 2 caracteres.';
  if (nombre.length > 50) return 'El nombre admite hasta 50 caracteres.';
  if (descripcion.length > 500) return 'La descripción admite hasta 500 caracteres.';
  return null;
}

export async function createCategoryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const { nombre, descripcion } = readCategoria(formData);
  const invalid = checkCategoria(nombre, descripcion);
  if (invalid) return { ok: false, message: invalid, at: Date.now() };
  try {
    const client = await createServerApiClient();
    await crearCategoria({ nombre, ...(descripcion ? { descripcion } : {}) }, client);
    revalidatePath('/admin/categorias');
    revalidatePath('/catalogo');
    return { ok: true, message: `Categoría «${nombre}» creada.`, at: Date.now() };
  } catch (error) {
    return fail(error, 'No se pudo crear la categoría.');
  }
}

export async function updateCategoryAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const id = String(formData.get('id') ?? '');
  const { nombre, descripcion } = readCategoria(formData);
  const invalid = checkCategoria(nombre, descripcion);
  if (invalid) return { ok: false, message: invalid, at: Date.now() };
  try {
    const client = await createServerApiClient();
    await actualizarCategoria(id, { nombre, descripcion }, client);
    revalidatePath('/admin/categorias');
    revalidatePath('/catalogo');
    return { ok: true, message: `Categoría «${nombre}» actualizada.`, at: Date.now() };
  } catch (error) {
    return fail(error, 'No se pudo actualizar la categoría.');
  }
}

export async function deleteCategoryAction(id: string): Promise<AdminActionState> {
  try {
    const client = await createServerApiClient();
    await eliminarCategoria(id, client);
    revalidatePath('/admin/categorias');
    revalidatePath('/catalogo');
    return { ok: true, message: 'Categoría eliminada.', at: Date.now() };
  } catch (error) {
    return fail(
      error,
      'No se pudo eliminar. Si tiene productos, muévelos a otra categoría primero.',
    );
  }
}

/* ---------- Módulos ---------- */

export async function toggleModuleAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const clave = MODULOS.find((m) => m === formData.get('clave'));
  const activo = formData.get('activo') === 'true';
  if (!clave) return { ok: false, message: 'Módulo desconocido.', at: Date.now() };
  try {
    const client = await createServerApiClient();
    await cambiarModulo(clave, activo, client);
    revalidatePath('/admin/modulos');
    revalidatePath('/admin');
    return {
      ok: true,
      message: `Módulo «${clave}» ${activo ? 'activado' : 'desactivado'}.`,
      at: Date.now(),
    };
  } catch (error) {
    return fail(error, 'No se pudo cambiar el módulo.');
  }
}

/* ---------- Pagos (simulador) ---------- */

export async function simulatePaymentAction(
  _prev: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const pedidoId = String(formData.get('pedidoId') ?? '').trim();
  const resultado = formData.get('resultado') === 'rechazar' ? 'rechazar' : 'aprobar';
  if (!UUID.test(pedidoId)) {
    return {
      ok: false,
      message: 'Pega el identificador completo del pedido (formato UUID).',
      at: Date.now(),
    };
  }
  try {
    const client = await createServerApiClient();
    await simularPago(pedidoId, resultado, client);
    revalidatePath(`/cuenta/pedidos/${pedidoId}`);
    return {
      ok: true,
      message:
        resultado === 'aprobar'
          ? 'Pago aprobado. El pedido pasa a «Pagado».'
          : 'Pago rechazado. El pedido queda sin pagar.',
      at: Date.now(),
    };
  } catch (error) {
    return fail(error, 'El simulador no respondió. ¿La API usa el proveedor «mock»?');
  }
}
