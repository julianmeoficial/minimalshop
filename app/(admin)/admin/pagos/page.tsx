import { Info } from 'lucide-react';

import { PaymentSimulator } from '@/components/features/PaymentSimulator';

import styles from '../admin.module.css';

export const metadata = { title: 'Simulador de pagos' };

export default function AdminPagosPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Administración</p>
          <h1>Simulador de pagos</h1>
        </div>
      </header>
      <div className={styles.grid2}>
        <section className={styles.card} aria-labelledby="sim-t">
          <h2 id="sim-t" className={styles.cardTitle}>
            Cerrar un pago pendiente
          </h2>
          <PaymentSimulator />
        </section>
        <section className={styles.card} aria-labelledby="sim-info">
          <h2 id="sim-info" className={styles.cardTitle}>
            <Info size={18} strokeWidth={1.5} aria-hidden /> Cuándo usarlo
          </h2>
          <p className={styles.muted}>
            Solo funciona cuando la API usa el proveedor de pagos <strong>mock</strong>. Sirve
            para demostraciones y pruebas: aprobar marca el pedido como pagado y lo envía al
            vendedor; rechazar lo deja sin pagar.
          </p>
          <p className={styles.muted}>
            Con una pasarela real (Stripe, Wompi) los pagos se confirman solos por webhook y este
            simulador responde con un error.
          </p>
        </section>
      </div>
    </div>
  );
}
