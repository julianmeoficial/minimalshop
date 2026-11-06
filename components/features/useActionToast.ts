'use client';

import { useEffect, useRef } from 'react';

import { useToast } from '@/components/ui';

interface ActionResult {
  readonly ok: boolean;
  readonly message?: string;
  readonly correlationId?: string;
  readonly at?: number;
}

/** Announces each new server-action result as a crystal toast (errors never auto-dismiss). */
export function useActionToast(state: ActionResult): void {
  const { push } = useToast();
  const last = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (!state.message || state.at === last.current) return;
    last.current = state.at;
    push({
      tone: state.ok ? 'success' : 'error',
      message: state.message,
      correlationId: state.correlationId,
    });
  }, [state, push]);
}
