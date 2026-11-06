import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/features/AuthForm';
import { AuthShell } from '@/components/features/AuthShell';

export const metadata: Metadata = { title: 'Ingresar' };

interface IngresoPageProps {
  readonly searchParams: Promise<{ next?: string }>;
}

export default async function IngresoPage({ searchParams }: IngresoPageProps) {
  const { next } = await searchParams;
  return (
    <AuthShell
      eyebrow="Cuenta"
      title={
        <>
          Bienvenido <em>de vuelta.</em>
        </>
      }
      lede="Ingresa para ver tu carrito, pagar y seguir tus pedidos."
      footer={
        <p>
          ¿Sin cuenta? <Link href="/cuenta/registro">Crea una en un minuto</Link>.
        </p>
      }
    >
      <AuthForm mode="ingreso" next={next} />
    </AuthShell>
  );
}
