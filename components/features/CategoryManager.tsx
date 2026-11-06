'use client';

import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useActionState, useEffect, useRef, useState, useTransition } from 'react';

import { Button, Dialog, Field } from '@/components/ui';
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
  type AdminActionState,
} from '@/lib/actions/admin';
import type { Categoria } from '@/lib/api/types';

import styles from './CategoryManager.module.css';
import { useActionToast } from './useActionToast';

const initial: AdminActionState = { ok: true };

export interface CategoryManagerProps {
  readonly categorias: readonly Categoria[];
  /** Product count per category id, when known. */
  readonly counts: Readonly<Record<string, number>>;
}

export function CategoryManager({ categorias, counts }: CategoryManagerProps) {
  const [createState, create, creating] = useActionState(createCategoryAction, initial);
  const formRef = useRef<HTMLFormElement>(null);
  useActionToast(createState);

  useEffect(() => {
    if (createState.ok && createState.at) formRef.current?.reset();
  }, [createState]);

  return (
    <div className={styles.root}>
      <form ref={formRef} action={create} className={styles.create}>
        <h2 className={styles.title}>Nueva categoría</h2>
        <Field id="cat-nombre" name="nombre" label="Nombre" required minLength={2} maxLength={50} autoComplete="off" />
        <Field
          id="cat-descripcion"
          name="descripcion"
          as="textarea"
          rows={2}
          label="Descripción (opcional)"
          maxLength={500}
          hint="Una línea que ayude a los compradores. Aparece en el home."
        />
        <Button type="submit" disabled={creating}>
          <Plus size={16} strokeWidth={1.5} aria-hidden />
          {creating ? 'Creando…' : 'Crear categoría'}
        </Button>
      </form>

      <ul className={styles.list} aria-label="Categorías existentes">
        {categorias.map((c) => (
          <CategoryRow key={c.id} categoria={c} count={counts[c.id]} />
        ))}
      </ul>
    </div>
  );
}

function CategoryRow({ categoria, count }: { categoria: Categoria; count: number | undefined }) {
  const [editing, setEditing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [state, update, saving] = useActionState(updateCategoryAction, initial);
  const [deleteState, setDeleteState] = useState<AdminActionState>(initial);
  const [deleting, startDelete] = useTransition();
  useActionToast(state);
  useActionToast(deleteState);

  useEffect(() => {
    if (state.ok && state.at) setEditing(false);
  }, [state]);

  return (
    <li className={styles.row}>
      {editing ? (
        <form action={update} className={styles.edit}>
          <input type="hidden" name="id" value={categoria.id} />
          <Field
            id={`n-${categoria.id}`}
            name="nombre"
            label="Nombre"
            defaultValue={categoria.nombre}
            required
            minLength={2}
            maxLength={50}
          />
          <Field
            id={`d-${categoria.id}`}
            name="descripcion"
            as="textarea"
            rows={2}
            label="Descripción"
            defaultValue={categoria.descripcion ?? ''}
            maxLength={500}
          />
          <div className={styles.actions}>
            <Button type="submit" disabled={saving}>
              {saving ? 'Guardando…' : 'Guardar'}
            </Button>
            <Button variant="tertiary" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.info}>
            <p className={styles.name}>
              {categoria.nombre}
              {count !== undefined ? (
                <span className={styles.count}>
                  {count} {count === 1 ? 'producto' : 'productos'}
                </span>
              ) : null}
            </p>
            {categoria.descripcion ? <p className={styles.desc}>{categoria.descripcion}</p> : null}
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" onClick={() => setEditing(true)}>
              <Pencil size={16} strokeWidth={1.5} aria-hidden />
              Editar
              <span className="sr-only"> {categoria.nombre}</span>
            </Button>
            <Button variant="tertiary" disabled={deleting} onClick={() => setConfirm(true)}>
              <Trash2 size={16} strokeWidth={1.5} aria-hidden />
              Eliminar
              <span className="sr-only"> {categoria.nombre}</span>
            </Button>
          </div>
        </>
      )}
      <Dialog
        open={confirm}
        title={`¿Eliminar «${categoria.nombre}»?`}
        onClose={() => setConfirm(false)}
        actions={
          <>
            <Button variant="tertiary" onClick={() => setConfirm(false)}>
              Conservar
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirm(false);
                startDelete(async () => setDeleteState(await deleteCategoryAction(categoria.id)));
              }}
            >
              Sí, eliminar
            </Button>
          </>
        }
      >
        <p>
          {count
            ? `Tiene ${count} ${count === 1 ? 'producto' : 'productos'}: la API rechazará el borrado hasta que los muevas a otra categoría.`
            : 'Desaparece del catálogo y de los filtros. Esta acción no se puede deshacer.'}
        </p>
      </Dialog>
    </li>
  );
}
