import { NextResponse, type NextRequest } from 'next/server';

import { ACCESS_COOKIE, USER_COOKIE } from '@/lib/auth/cookies';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAccess = Boolean(request.cookies.get(ACCESS_COOKIE)?.value);
  const userRaw = request.cookies.get(USER_COOKIE)?.value;
  let rol: string | null = null;
  if (userRaw) {
    try {
      rol = (JSON.parse(userRaw) as { rol?: string }).rol ?? null;
    } catch {
      rol = null;
    }
  }

  const needsAuth =
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/cuenta/pedidos') ||
    pathname.startsWith('/carrito') ||
    pathname.startsWith('/vendedor') ||
    pathname.startsWith('/admin');

  if (needsAuth && !hasAccess) {
    const url = request.nextUrl.clone();
    url.pathname = '/cuenta/ingreso';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/vendedor') && rol && rol === 'COMPRADOR') {
    const url = request.nextUrl.clone();
    url.pathname = '/catalogo';
    return NextResponse.redirect(url);
  }

  // UX guard only: the API enforces SUPERADMIN on every /v1/admin call.
  if (pathname.startsWith('/admin') && rol !== 'SUPERADMIN') {
    const url = request.nextUrl.clone();
    url.pathname = rol === 'VENDEDOR' ? '/vendedor/productos' : '/catalogo';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/cuenta/pedidos/:path*',
    '/carrito',
    '/vendedor/:path*',
    '/admin/:path*',
    '/admin',
  ],
};
