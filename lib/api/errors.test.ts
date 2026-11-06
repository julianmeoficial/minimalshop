import { describe, expect, it } from 'vitest';

import { mapApiError, userFacingMessage } from './errors';

describe('mapApiError', () => {
  it('maps validation errors', () => {
    const mapped = mapApiError(
      400,
      {
        code: 'VALIDATION_ERROR',
        message: 'invalid',
        details: [{ field: 'email' }],
        timestamp: '2026-01-01T00:00:00.000Z',
        path: '/api/v1/auth/ingreso',
        correlationId: 'corr-1',
      },
      'fallback',
    );

    expect(mapped).toEqual({
      kind: 'validation',
      code: 'VALIDATION_ERROR',
      details: [{ field: 'email' }],
      correlationId: 'corr-1',
    });
    expect(userFacingMessage(mapped)).toBe(
      'Revisa los datos del formulario.',
    );
  });

  it('maps MODULE_DISABLED conflict', () => {
    const mapped = mapApiError(
      409,
      {
        code: 'MODULE_DISABLED',
        message: 'off',
        details: [],
        timestamp: '',
        path: '/api/v1/cupones/X',
        correlationId: 'corr-2',
      },
      'fallback',
    );

    expect(mapped.kind).toBe('conflict');
    expect(userFacingMessage(mapped)).toBe(
      'Esta función no está disponible en la tienda.',
    );
  });

  it('falls back to correlation id when body omits it', () => {
    const mapped = mapApiError(500, { code: 'INTERNAL_ERROR', message: 'x' }, 'fb');
    expect(mapped.correlationId).toBe('fb');
    expect(mapped.kind).toBe('unknown');
  });
});
