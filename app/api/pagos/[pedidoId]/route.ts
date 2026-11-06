import { NextResponse } from 'next/server';

import { ApiClientError } from '@/lib/api/errors';
import { consultarPago } from '@/lib/api/pagos';
import { createServerApiClient } from '@/lib/api/server';

interface RouteContext {
  readonly params: Promise<{ pedidoId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { pedidoId } = await context.params;
  try {
    const client = await createServerApiClient();
    const pago = await consultarPago(pedidoId, client);
    return NextResponse.json(pago);
  } catch (error) {
    if (error instanceof ApiClientError) {
      return NextResponse.json(
        {
          code: error.mapped.code,
          correlationId: error.correlationId,
        },
        { status: error.httpStatus },
      );
    }
    return NextResponse.json({ code: 'UNKNOWN' }, { status: 500 });
  }
}
