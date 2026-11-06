/**
 * Typed API errors — never surface raw API messages in the UI.
 * Maps RespuestaErrorDto from the Minimal Ecommerce API.
 */

export type ApiErrorCode =
  | 'VALIDATION_ERROR'
  | 'IDEMPOTENCY_KEY_REQUIRED'
  | 'TOKEN_INVALID'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'STOCK_INSUFFICIENT'
  | 'EMPTY_CART'
  | 'MODULE_DISABLED'
  | 'COUPON_INVALID'
  | 'COUPON_EXPIRED'
  | 'COUPON_EXHAUSTED'
  | 'ORDER_NOT_PAYABLE'
  | 'PAYMENT_PROVIDER_UNAVAILABLE'
  | 'REVIEW_NOT_ALLOWED'
  | 'TOO_MANY_REQUESTS'
  | 'CONFLICT'
  | 'INTERNAL_ERROR'
  | 'UNKNOWN';

export interface ApiErrorDetail {
  readonly field?: string;
  readonly message?: string;
  readonly [key: string]: unknown;
}

export interface ApiErrorBody {
  readonly code: string;
  readonly message: string;
  readonly details: readonly ApiErrorDetail[] | readonly unknown[];
  readonly timestamp: string;
  readonly path: string;
  readonly correlationId: string;
}

export type MappedApiError =
  | { readonly kind: 'validation'; readonly code: 'VALIDATION_ERROR'; readonly details: ApiErrorBody['details']; readonly correlationId: string }
  | { readonly kind: 'auth'; readonly code: 'TOKEN_INVALID' | 'UNAUTHORIZED'; readonly correlationId: string }
  | { readonly kind: 'forbidden'; readonly code: 'FORBIDDEN'; readonly correlationId: string }
  | { readonly kind: 'not_found'; readonly code: 'NOT_FOUND'; readonly correlationId: string }
  | { readonly kind: 'conflict'; readonly code: ApiErrorCode; readonly correlationId: string }
  | { readonly kind: 'rate_limit'; readonly code: 'TOO_MANY_REQUESTS'; readonly correlationId: string }
  | { readonly kind: 'unavailable'; readonly code: 'PAYMENT_PROVIDER_UNAVAILABLE'; readonly correlationId: string }
  | { readonly kind: 'unknown'; readonly code: ApiErrorCode; readonly correlationId: string; readonly httpStatus: number };

export class ApiClientError extends Error {
  readonly mapped: MappedApiError;
  readonly httpStatus: number;
  readonly correlationId: string;
  readonly body: ApiErrorBody | null;

  constructor(
    mapped: MappedApiError,
    httpStatus: number,
    body: ApiErrorBody | null,
  ) {
    super(`API error ${mapped.code}`);
    this.name = 'ApiClientError';
    this.mapped = mapped;
    this.httpStatus = httpStatus;
    this.correlationId = mapped.correlationId;
    this.body = body;
  }
}

function asErrorBody(value: unknown): ApiErrorBody | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const record = value as Record<string, unknown>;
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

export function mapApiError(
  httpStatus: number,
  payload: unknown,
  fallbackCorrelationId: string,
): MappedApiError {
  const body = asErrorBody(payload);
  const code = (body?.code ?? 'UNKNOWN') as ApiErrorCode;
  const correlationId = body?.correlationId || fallbackCorrelationId || 'unknown';

  if (httpStatus === 400 || code === 'VALIDATION_ERROR' || code === 'IDEMPOTENCY_KEY_REQUIRED') {
    if (code === 'VALIDATION_ERROR') {
      return {
        kind: 'validation',
        code: 'VALIDATION_ERROR',
        details: body?.details ?? [],
        correlationId,
      };
    }
    return { kind: 'conflict', code, correlationId };
  }

  if (httpStatus === 401 || code === 'TOKEN_INVALID' || code === 'UNAUTHORIZED') {
    return {
      kind: 'auth',
      code: code === 'TOKEN_INVALID' ? 'TOKEN_INVALID' : 'UNAUTHORIZED',
      correlationId,
    };
  }

  if (httpStatus === 403 || code === 'FORBIDDEN') {
    return { kind: 'forbidden', code: 'FORBIDDEN', correlationId };
  }

  if (httpStatus === 404 || code === 'NOT_FOUND') {
    return { kind: 'not_found', code: 'NOT_FOUND', correlationId };
  }

  if (httpStatus === 429 || code === 'TOO_MANY_REQUESTS') {
    return { kind: 'rate_limit', code: 'TOO_MANY_REQUESTS', correlationId };
  }

  if (httpStatus === 503 || code === 'PAYMENT_PROVIDER_UNAVAILABLE') {
    return {
      kind: 'unavailable',
      code: 'PAYMENT_PROVIDER_UNAVAILABLE',
      correlationId,
    };
  }

  if (httpStatus === 409) {
    return { kind: 'conflict', code, correlationId };
  }

  return { kind: 'unknown', code, correlationId, httpStatus };
}

export function userFacingMessage(error: MappedApiError): string {
  switch (error.kind) {
    case 'validation':
      return 'Revisa los datos del formulario.';
    case 'auth':
      return 'Tu sesión expiró. Vuelve a iniciar sesión.';
    case 'forbidden':
      return 'No tienes permiso para esta acción.';
    case 'not_found':
      return 'No encontramos ese recurso.';
    case 'rate_limit':
      return 'Demasiados intentos. Espera un momento.';
    case 'unavailable':
      return 'El pago no está disponible ahora. Intenta más tarde.';
    case 'conflict':
      if (error.code === 'STOCK_INSUFFICIENT') {
        return 'No hay existencias suficientes.';
      }
      if (error.code === 'EMPTY_CART') {
        return 'Tu carrito está vacío.';
      }
      if (error.code === 'MODULE_DISABLED') {
        return 'Esta función no está disponible en la tienda.';
      }
      if (error.code.startsWith('COUPON_')) {
        return 'El cupón no se puede aplicar.';
      }
      return 'No se pudo completar la operación.';
    case 'unknown':
      return 'Algo salió mal. Si continúa, indica el código de soporte.';
  }
}
