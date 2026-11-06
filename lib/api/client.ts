import {
  ApiClientError,
  type ApiErrorBody,
  mapApiError,
} from './errors';
import type { SesionAuth, TokenStore } from './types';

const CORRELATION_HEADER = 'x-correlation-id';

export interface ApiClientOptions {
  readonly baseUrl?: string;
  readonly tokenStore?: TokenStore;
  readonly fetchImpl?: typeof fetch;
  /** Called when a response exposes x-correlation-id (for logging). */
  readonly onCorrelationId?: (correlationId: string) => void;
}

export interface RequestOptions {
  readonly method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly body?: unknown;
  /** When true, send `body` as FormData/Blob without JSON Content-Type. */
  readonly multipart?: boolean;
  readonly headers?: Record<string, string>;
  readonly auth?: boolean;
  readonly idempotencyKey?: string;
  readonly signal?: AbortSignal;
  /** Skip the single 401 → refresh → retry cycle. */
  readonly skipRefresh?: boolean;
}

function resolveBaseUrl(explicit?: string): string {
  const fromEnv = process.env['NEXT_PUBLIC_API_URL'];
  const base = explicit ?? fromEnv;
  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_API_URL is not set. Copy .env.example to .env.local.',
    );
  }
  return base.replace(/\/$/, '');
}

function buildUrl(baseUrl: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalized}`;
}

function readErrorBody(payload: unknown): ApiErrorBody | null {
  if (typeof payload !== 'object' || payload === null) {
    return null;
  }
  const record = payload as Record<string, unknown>;
  if (typeof record['code'] !== 'string' || typeof record['message'] !== 'string') {
    return null;
  }
  return {
    code: record['code'],
    message: record['message'],
    details: Array.isArray(record['details']) ? record['details'] : [],
    timestamp: typeof record['timestamp'] === 'string' ? record['timestamp'] : '',
    path: typeof record['path'] === 'string' ? record['path'] : '',
    correlationId:
      typeof record['correlationId'] === 'string' ? record['correlationId'] : '',
  };
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly tokenStore: TokenStore | undefined;
  private readonly fetchImpl: typeof fetch;
  private readonly onCorrelationId: ((id: string) => void) | undefined;
  private refreshPromise: Promise<boolean> | null = null;

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = resolveBaseUrl(options.baseUrl);
    this.tokenStore = options.tokenStore;
    this.fetchImpl = options.fetchImpl ?? fetch.bind(globalThis);
    this.onCorrelationId = options.onCorrelationId;
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await this.rawRequest(path, options);

    if (response.status === 204) {
      return undefined as T;
    }

    const text = await response.text();
    let payload: unknown = null;
    if (text) {
      try {
        payload = JSON.parse(text) as unknown;
      } catch {
        payload = text;
      }
    }

    if (!response.ok) {
      const correlationId =
        response.headers.get(CORRELATION_HEADER) ?? 'unknown';
      const body = readErrorBody(payload);
      throw new ApiClientError(
        mapApiError(response.status, payload, correlationId),
        response.status,
        body,
      );
    }

    return payload as T;
  }

  private async rawRequest(
    path: string,
    options: RequestOptions,
    isRetry = false,
  ): Promise<Response> {
    const headers = new Headers(options.headers);
    const isMultipart =
      options.multipart === true ||
      (typeof FormData !== 'undefined' && options.body instanceof FormData);
    if (
      options.body !== undefined &&
      !isMultipart &&
      !headers.has('Content-Type')
    ) {
      headers.set('Content-Type', 'application/json');
    }
    if (options.idempotencyKey) {
      headers.set('Idempotency-Key', options.idempotencyKey);
    }

    const needsAuth = options.auth !== false;
    if (needsAuth && this.tokenStore) {
      const token = await this.tokenStore.getAccessToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
    }

    const init: RequestInit = {
      method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
      headers,
    };
    if (options.body !== undefined) {
      init.body = isMultipart
        ? (options.body as BodyInit)
        : JSON.stringify(options.body);
    }
    if (options.signal) {
      init.signal = options.signal;
    }

    const response = await this.fetchImpl(buildUrl(this.baseUrl, path), init);

    const correlationId = response.headers.get(CORRELATION_HEADER);
    if (correlationId) {
      this.onCorrelationId?.(correlationId);
    }

    if (
      response.status === 401 &&
      needsAuth &&
      !options.skipRefresh &&
      !isRetry &&
      this.tokenStore
    ) {
      const refreshed = await this.refreshSession();
      if (refreshed) {
        return this.rawRequest(path, options, true);
      }
    }

    return response;
  }

  private async refreshSession(): Promise<boolean> {
    if (!this.tokenStore) {
      return false;
    }
    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  private async doRefresh(): Promise<boolean> {
    if (!this.tokenStore) {
      return false;
    }
    const refreshToken = await this.tokenStore.getRefreshToken();
    if (!refreshToken) {
      await this.tokenStore.clearSession();
      return false;
    }

    try {
      const session = await this.request<SesionAuth>('/v1/auth/refrescar', {
        method: 'POST',
        body: { refreshToken },
        auth: false,
        skipRefresh: true,
      });
      await this.tokenStore.setSession(session);
      return true;
    } catch {
      await this.tokenStore.clearSession();
      return false;
    }
  }
}

let defaultClient: ApiClient | null = null;

export function getApiClient(options?: ApiClientOptions): ApiClient {
  if (options) {
    return new ApiClient(options);
  }
  if (!defaultClient) {
    defaultClient = new ApiClient();
  }
  return defaultClient;
}

export function createApiClient(options?: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}
