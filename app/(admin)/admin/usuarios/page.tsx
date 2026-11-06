import { CheckCircle2, Search, XCircle } from 'lucide-react';

import { StateMessage } from '@/components/features/StateMessage';
import { UserControls } from '@/components/features/UserControls';
import { Button, DataTable, Pagination } from '@/components/ui';
import { listarUsuarios } from '@/lib/api/admin';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import type { UserRole, UsuarioAdmin } from '@/lib/api/types';
import { readUsuario } from '@/lib/auth/session';

import styles from '../admin.module.css';

export const metadata = { title: 'Usuarios' };

const PAGE_SIZE = 20;
const ROLES: readonly { readonly value: UserRole | ''; readonly label: string }[] = [
  { value: '', label: 'Todos los roles' },
  { value: 'COMPRADOR', label: 'Compradores' },
  { value: 'VENDEDOR', label: 'Vendedores' },
  { value: 'SUPERADMIN', label: 'Administradores' },
];

interface UsuariosPageProps {
  readonly searchParams: Promise<{ q?: string; rol?: string; pagina?: string }>;
}

export default async function AdminUsuariosPage({ searchParams }: UsuariosPageProps) {
  const params = await searchParams;
  const q = params.q?.trim() || undefined;
  const rol = ROLES.find((r) => r.value && r.value === params.rol)?.value || undefined;
  const pagina = Math.max(0, Number(params.pagina ?? '0') || 0);
  const yo = await readUsuario();

  const hrefForPage = (p: number) => {
    const sp = new URLSearchParams();
    if (q) sp.set('q', q);
    if (rol) sp.set('rol', rol);
    if (p > 0) sp.set('pagina', String(p));
    const qs = sp.toString();
    return qs ? `/admin/usuarios?${qs}` : '/admin/usuarios';
  };

  try {
    const client = await createServerApiClient();
    const usuarios = await listarUsuarios({ pagina, tamano: PAGE_SIZE, q, rol }, client);

    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administración</p>
            <h1>Usuarios ({usuarios.totalElementos})</h1>
          </div>
        </header>

        <form className={styles.toolbar} method="get" role="search">
          <label className="sr-only" htmlFor="q">
            Buscar por nombre o correo
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q ?? ''}
            placeholder="Buscar por nombre o correo…"
            className={styles.input}
            autoComplete="off"
          />
          <label className="sr-only" htmlFor="rol">
            Rol
          </label>
          <select id="rol" name="rol" defaultValue={rol ?? ''} className={styles.input}>
            {ROLES.map((r) => (
              <option key={r.label} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
          <Button type="submit">
            <Search size={16} strokeWidth={1.5} aria-hidden />
            Filtrar
          </Button>
          {q || rol ? (
            <Button href="/admin/usuarios" variant="tertiary">
              Limpiar
            </Button>
          ) : null}
        </form>

        <DataTable<UsuarioAdmin>
          caption="Cuentas de la plataforma"
          rows={usuarios.contenido}
          rowKey={(u) => u.id}
          empty={
            <StateMessage title="Ninguna cuenta coincide">
              <p>Prueba con otra búsqueda o quita el filtro de rol.</p>
            </StateMessage>
          }
          columns={[
            {
              key: 'usuario',
              header: 'Cuenta',
              render: (u) => (
                <span className={styles.who}>
                  <strong>{u.nombre}</strong>
                  <span>{u.email}</span>
                </span>
              ),
            },
            {
              key: 'estado',
              header: 'Estado',
              render: (u) => (
                <span className={`${styles.state} ${u.activo ? styles.on : styles.off}`}>
                  {u.activo ? (
                    <CheckCircle2 size={14} strokeWidth={1.5} aria-hidden />
                  ) : (
                    <XCircle size={14} strokeWidth={1.5} aria-hidden />
                  )}
                  {u.activo ? 'Activa' : 'Desactivada'}
                </span>
              ),
            },
            {
              key: 'acciones',
              header: 'Rol y acceso',
              render: (u) => (
                <UserControls
                  id={u.id}
                  nombre={u.nombre}
                  rol={u.rol}
                  activo={u.activo}
                  self={u.id === yo?.id}
                />
              ),
            },
          ]}
        />

        <Pagination
          pagina={usuarios.pagina}
          totalPaginas={usuarios.totalPaginas}
          totalElementos={usuarios.totalElementos}
          tamano={usuarios.tamano}
          hrefForPage={hrefForPage}
        />
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudieron cargar los usuarios"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/admin/usuarios">Reintentar</Button>}
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
