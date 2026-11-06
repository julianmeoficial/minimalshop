import { ArrowRight, Package, ReceiptText, ShieldCheck, Store, UserRound } from 'lucide-react';
import Link from 'next/link';

import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';
import { listarModulos, resumenPlataforma } from '@/lib/api/admin';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import type { UserRole } from '@/lib/api/types';
import { MODULE_COPY } from '@/lib/content/modulos';

import styles from './admin.module.css';

export const metadata = { title: 'Resumen' };

const ROLE_LABEL: Record<UserRole, string> = {
  COMPRADOR: 'Compradores',
  VENDEDOR: 'Vendedores',
  SUPERADMIN: 'Administradores',
};

const number = new Intl.NumberFormat('es-CO');

export default async function AdminResumenPage() {
  try {
    const client = await createServerApiClient();
    const [resumen, modulos] = await Promise.all([
      resumenPlataforma(client),
      listarModulos(client).catch(() => []),
    ]);
    const roles = (Object.keys(ROLE_LABEL) as UserRole[]).map((rol) => ({
      rol,
      total: resumen.usuariosPorRol[rol] ?? 0,
    }));
    const totalUsuarios = roles.reduce((n, r) => n + r.total, 0);
    const max = Math.max(1, ...roles.map((r) => r.total));

    const kpis = [
      { label: 'Productos activos', value: resumen.productosActivos, icon: Package },
      { label: 'Pedidos pagados', value: resumen.pedidosPagados, icon: ReceiptText },
      { label: 'Usuarios', value: totalUsuarios, icon: UserRound },
      { label: 'Vendedores', value: resumen.usuariosPorRol.VENDEDOR ?? 0, icon: Store },
      { label: 'Módulos activos', value: modulos.filter((m) => m.activo).length, icon: ShieldCheck },
    ];

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administración</p>
            <h1>Resumen de la plataforma</h1>
          </div>
          <Button href="/admin/usuarios" variant="secondary">
            Gestionar usuarios
          </Button>
        </header>

        <ul className={styles.kpis} aria-label="Indicadores">
          {kpis.map(({ label, value, icon: Icon }) => (
            <li key={label} className={styles.kpi}>
              <span className={styles.kpiLabel}>
                <Icon size={16} strokeWidth={1.5} aria-hidden />
                {label}
              </span>
              <span className={styles.kpiValue}>{number.format(value)}</span>
            </li>
          ))}
        </ul>

        <div className={styles.grid2}>
          <section className={styles.card} aria-labelledby="roles-t">
            <h2 id="roles-t" className={styles.cardTitle}>
              Cuentas por rol
            </h2>
            <ul className={styles.bars}>
              {roles.map((r) => (
                <li key={r.rol} className={styles.bar}>
                  <span>{ROLE_LABEL[r.rol]}</span>
                  <span className={styles.track} aria-hidden="true">
                    <span style={{ transform: `scaleX(${r.total / max})` }} />
                  </span>
                  <span className={styles.num}>{number.format(r.total)}</span>
                </li>
              ))}
            </ul>
            <Link href="/admin/usuarios" className={styles.muted}>
              Ver y filtrar cuentas
            </Link>
          </section>

          <section className={styles.card} aria-labelledby="modulos-t">
            <h2 id="modulos-t" className={styles.cardTitle}>
              Módulos de la tienda
            </h2>
            {modulos.length > 0 ? (
              <div className={styles.moduleStates}>
                {modulos.map((m) => (
                  <span key={m.clave} className={`${styles.state} ${m.activo ? styles.on : styles.off}`}>
                    {MODULE_COPY[m.clave].nombre}: {m.activo ? 'activo' : 'apagado'}
                  </span>
                ))}
              </div>
            ) : (
              <p className={styles.muted}>No pudimos leer el estado de los módulos.</p>
            )}
            <Link href="/admin/modulos" className={styles.muted}>
              Activar o apagar módulos
            </Link>
          </section>
        </div>

        <section className={styles.card} aria-labelledby="atajos-t">
          <h2 id="atajos-t" className={styles.cardTitle}>
            Tareas frecuentes
          </h2>
          <ul className={styles.links}>
            {[
              { href: '/admin/categorias', title: 'Organizar categorías', body: 'Crear, renombrar o eliminar estantes del catálogo.' },
              { href: '/admin/usuarios?rol=VENDEDOR', title: 'Revisar vendedores', body: 'Activar, desactivar o cambiar el rol de una cuenta.' },
              { href: '/admin/pagos', title: 'Aprobar un pago de prueba', body: 'Simulador del proveedor «mock» para cerrar pagos pendientes.' },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href}>
                  <span>
                    {l.title}
                    <span>{l.body}</span>
                  </span>
                  <ArrowRight size={18} strokeWidth={1.5} aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudo cargar el resumen"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/admin">Reintentar</Button>}
      >
        <p>
          {error instanceof ApiClientError
            ? userFacingMessage(error.mapped)
            : 'No pudimos conectar con la API.'}
        </p>
      </StateMessage>
    );
  }
}
