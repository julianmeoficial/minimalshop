'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import {
  ingreso as apiIngreso,
  registro as apiRegistro,
  salir as apiSalir,
} from '@/lib/api/auth';
import { createApiClient } from '@/lib/api/client';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import type { SesionAuth, UserRole, UsuarioResumen } from '@/lib/api/types';

import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SEC,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SEC,
  USER_COOKIE,
} from './cookies';

function cookieSecure(): boolean {
  return process.env.NODE_ENV === 'production';
}

export async function writeSession(session: SesionAuth): Promise<void> {
  const jar = await cookies();
  const secure = cookieSecure();
  jar.set(ACCESS_COOKIE, session.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: session.expiresIn || ACCESS_MAX_AGE_SEC,
  });
  jar.set(REFRESH_COOKIE, session.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: REFRESH_MAX_AGE_SEC,
  });
  jar.set(USER_COOKIE, JSON.stringify(session.usuario), {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: REFRESH_MAX_AGE_SEC,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
  jar.delete(USER_COOKIE);
}

export async function readAccessToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(ACCESS_COOKIE)?.value ?? null;
}

export async function readRefreshToken(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(REFRESH_COOKIE)?.value ?? null;
}

export async function readUsuario(): Promise<UsuarioResumen | null> {
  const jar = await cookies();
  const raw = jar.get(USER_COOKIE)?.value;
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as UsuarioResumen;
  } catch {
    return null;
  }
}

export type AuthActionState = {
  readonly ok: boolean;
  readonly message?: string;
  readonly correlationId?: string;
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  try {
    const session = await apiIngreso({ email, password }, createApiClient());
    await writeSession(session);
    const next = safeNextPath(formData.get('next'));
    const isSeller =
      session.usuario.rol === 'VENDEDOR' || session.usuario.rol === 'SUPERADMIN';
    const isAdmin = session.usuario.rol === 'SUPERADMIN';
    if (
      next &&
      (isSeller || !next.startsWith('/vendedor')) &&
      (isAdmin || !next.startsWith('/admin'))
    ) {
      redirect(next);
    }
    if (isAdmin) {
      redirect('/admin');
    }
    if (isSeller) {
      redirect('/vendedor/productos');
    }
    redirect('/catalogo');
  } catch (error) {
    rethrowRedirect(error);
    return mapAuthError(error);
  }
}

export async function registerAction(
  _prev: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const nombre = String(formData.get('nombre') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const rol = String(formData.get('rol') ?? 'COMPRADOR') as Extract<
    UserRole,
    'COMPRADOR' | 'VENDEDOR'
  >;
  try {
    const session = await apiRegistro(
      { nombre, email, password, rol },
      createApiClient(),
    );
    await writeSession(session);
    if (rol === 'VENDEDOR') {
      redirect('/vendedor/productos');
    }
    redirect('/catalogo');
  } catch (error) {
    rethrowRedirect(error);
    return mapAuthError(error);
  }
}

export async function logoutAction(): Promise<void> {
  const refresh = await readRefreshToken();
  try {
    if (refresh) {
      await apiSalir(refresh, createApiClient());
    }
  } catch {
    // still clear local session
  }
  await clearSession();
  redirect('/');
}

function mapAuthError(error: unknown): AuthActionState {
  if (error instanceof ApiClientError) {
    return {
      ok: false,
      message: userFacingMessage(error.mapped),
      correlationId: error.correlationId,
    };
  }
  return { ok: false, message: 'No se pudo completar la autenticación.' };
}

/** Only same-site absolute paths (`/x`), never protocol-relative or external URLs. */
function safeNextPath(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return null;
  }
  return value;
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
