import { ModuleToggle } from '@/components/features/ModuleToggle';
import { StateMessage } from '@/components/features/StateMessage';
import { Button } from '@/components/ui';
import { listarModulos } from '@/lib/api/admin';
import { ApiClientError, userFacingMessage } from '@/lib/api/errors';
import { createServerApiClient } from '@/lib/api/server';
import { MODULE_COPY } from '@/lib/content/modulos';

import styles from '../admin.module.css';

export const metadata = { title: 'Módulos' };

export default async function AdminModulosPage() {
  try {
    const client = await createServerApiClient();
    const modulos = await listarModulos(client);
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Administración</p>
            <h1>Módulos</h1>
          </div>
        </header>
        <p className={styles.lede}>
          Funciones opcionales de minimalecommerceAPI. Se aplican a toda la tienda al instante;
          apagar uno no borra sus datos.
        </p>
        <ul className={styles.moduleList}>
          {modulos.map((m) => (
            <ModuleToggle
              key={m.clave}
              clave={m.clave}
              nombre={MODULE_COPY[m.clave].nombre}
              descripcion={MODULE_COPY[m.clave].descripcion}
              activo={m.activo}
              actualizadoEn={m.actualizadoEn}
            />
          ))}
        </ul>
      </div>
    );
  } catch (error) {
    return (
      <StateMessage
        level="h1"
        title="No se pudieron cargar los módulos"
        correlationId={error instanceof ApiClientError ? error.correlationId : undefined}
        action={<Button href="/admin/modulos">Reintentar</Button>}
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
