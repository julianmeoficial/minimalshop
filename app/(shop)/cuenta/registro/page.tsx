import type { Metadata } from 'next';
import Link from 'next/link';

import { AuthForm } from '@/components/features/AuthForm';
import { AuthShell } from '@/components/features/AuthShell';

export const metadata: Metadata = { title: 'Crear cuenta' };

interface RegistroPageProps {
  readonly searchParams: Promise<{ rol?: string }>;
}

export default async function RegistroPage({ searchParams }: RegistroPageProps) {
  const { rol } = await searchParams;
  const seller = rol === 'VENDEDOR';
  return (
    <AuthShell
      eyebrow="Cuenta nueva"
      title={
        <>
          Compra con calma <em>o abre tu tienda.</em>
        </>
      }
      lede="Elige comprar para usar el carrito, o vender para publicar tus piezas en el panel."
      footer={
        <p>
          ¿Ya tienes cuenta? <Link href="/cuenta/ingreso">Ingresa</Link>.
        </p>
      }
    >
      <AuthForm mode="registro" defaultRol={seller ? 'VENDEDOR' : 'COMPRADOR'} />
    </AuthShell>
  );
}
