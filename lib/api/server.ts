import { cookies } from 'next/headers';

import { createApiClient, type ApiClient } from './client';
import type { SesionAuth, TokenStore } from './types';
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE_SEC,
  REFRESH_COOKIE,
  REFRESH_MAX_AGE_SEC,
  USER_COOKIE,
} from '@/lib/auth/cookies';

function cookieSecure(): boolean {
  return process.env.NODE_ENV === 'production';
}

async function cookieTokenStore(): Promise<TokenStore> {
  return {
    async getAccessToken() {
      const jar = await cookies();
      return jar.get(ACCESS_COOKIE)?.value ?? null;
    },
    async getRefreshToken() {
      const jar = await cookies();
      return jar.get(REFRESH_COOKIE)?.value ?? null;
    },
    async setSession(session: SesionAuth) {
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
    },
    async clearSession() {
      const jar = await cookies();
      jar.delete(ACCESS_COOKIE);
      jar.delete(REFRESH_COOKIE);
      jar.delete(USER_COOKIE);
    },
  };
}

export async function createServerApiClient(): Promise<ApiClient> {
  return createApiClient({
    tokenStore: await cookieTokenStore(),
  });
}
