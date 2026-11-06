import Link from 'next/link';
import type { ReactNode } from 'react';

import { GlassSurface } from '@/components/ui';
import { logoutAction, readUsuario } from '@/lib/auth/session';

import { PanelNav, type PanelLink } from './PanelNav';

import styles from './SellerSidebar.module.css';

export interface PanelShellProps {
  readonly children: ReactNode;
  readonly roleLabel: string;
  readonly homeHref: string;
  readonly navLabel: string;
  readonly links: readonly PanelLink[];
}

/** Seller / superadmin layout: liquid-glass sidebar, dense content (DESIGN.md §2.6, §9). */
export async function PanelShell({ children, roleLabel, homeHref, navLabel, links }: PanelShellProps) {
  const usuario = await readUsuario();
  return (
    <div className={styles.shell}>
      <GlassSurface as="aside" variant="liquid" className={styles.aside}>
        <div className={styles.head}>
          <Link className={styles.brand} href={homeHref}>
            Minimal<em>Shop</em>
          </Link>
          <p className={styles.role}>{roleLabel}</p>
          {usuario ? <p className={styles.user}>{usuario.nombre}</p> : null}
        </div>
        <PanelNav label={navLabel} links={links} logoutAction={logoutAction} />
      </GlassSurface>
      <main id="contenido" className={styles.main} tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}

const SELLER_LINKS: readonly PanelLink[] = [
  { href: '/vendedor/productos', label: 'Productos', icon: 'productos' },
  { href: '/vendedor/productos/nuevo', label: 'Nuevo producto', icon: 'nuevo' },
  { href: '/vendedor/pedidos', label: 'Pedidos', icon: 'pedidos' },
];

export function SellerShell({ children }: { readonly children: ReactNode }) {
  return (
    <PanelShell
      roleLabel="Panel del vendedor"
      homeHref="/vendedor/productos"
      navLabel="Panel del vendedor"
      links={SELLER_LINKS}
    >
      {children}
    </PanelShell>
  );
}

const ADMIN_LINKS: readonly PanelLink[] = [
  { href: '/admin', label: 'Resumen', icon: 'resumen', exact: true },
  { href: '/admin/usuarios', label: 'Usuarios', icon: 'usuarios' },
  { href: '/admin/categorias', label: 'Categorías', icon: 'categorias' },
  { href: '/admin/modulos', label: 'Módulos', icon: 'modulos' },
  { href: '/admin/pagos', label: 'Simulador de pagos', icon: 'pagos' },
];

export function AdminShell({ children }: { readonly children: ReactNode }) {
  return (
    <PanelShell
      roleLabel="Administración"
      homeHref="/admin"
      navLabel="Administración"
      links={ADMIN_LINKS}
    >
      {children}
    </PanelShell>
  );
}
