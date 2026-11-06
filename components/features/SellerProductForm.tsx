'use client';

import { AlertCircle, Check, Circle, Eye, Save } from 'lucide-react';
import { useActionState, useEffect, useId, useMemo, useRef, useState, useTransition } from 'react';

import { Button, Field, GlassSurface, ProductCard, QuantityStepper } from '@/components/ui';
import {
  createProductAction,
  updateProductAction,
  type SellerActionState,
} from '@/lib/actions/vendedor';
import type { Categoria, ProductoListado } from '@/lib/api/types';
import { formatPrice } from '@/lib/format';
import {
  PRODUCT_LIMITS,
  validateProduct,
  type ProductDraft,
  type ProductErrors,
  type ProductField,
} from '@/lib/products/validation';

import { ImageDropzone } from './ImageDropzone';

import styles from './SellerProductForm.module.css';

const initial: SellerActionState = { ok: true };

export interface SellerProductFormProps {
  readonly categorias: readonly Categoria[];
  readonly producto?: ProductoListado;
}

const FIELD_LABELS: Record<ProductField, string> = {
  archivo: 'Foto',
  nombre: 'Nombre',
  descripcion: 'Descripción',
  categoriaId: 'Categoría',
  precio: 'Precio',
  existencias: 'Existencias',
};

/**
 * Create / edit a product. Controlled fields feed a live preview card and a readiness
 * checklist; the form is submitted as FormData built here, so the chosen photo and every
 * value survive a failed save (no reset, no lost work).
 */
export function SellerProductForm({ categorias, producto }: SellerProductFormProps) {
  const isEdit = Boolean(producto);
  const [state, dispatch, pending] = useActionState(
    isEdit ? updateProductAction : createProductAction,
    initial,
  );
  const [, startTransition] = useTransition();
  const formId = useId();
  const summaryRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<ProductDraft>({
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto ? String(producto.precio) : '',
    existencias: String(producto?.existencias ?? 1),
    categoriaId: producto?.categoria.id ?? '',
  });
  const [preventa, setPreventa] = useState(producto?.preventa ?? false);
  const [activo, setActivo] = useState(producto?.activo ?? true);
  const [file, setFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | undefined>();
  const localPhoto = useObjectUrl(file);
  const [touched, setTouched] = useState<Partial<Record<ProductField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [dirty, setDirty] = useState(false);

  const clientErrors = useMemo(() => validateProduct(draft), [draft]);
  const serverErrors: ProductErrors = state.fieldErrors ?? {};
  const errorFor = (field: ProductField): string | undefined => {
    if (field === 'archivo') return imageError ?? serverErrors.archivo;
    const show = submitted || touched[field];
    return (show ? clientErrors[field] : undefined) ?? serverErrors[field];
  };

  // Warn before leaving with unsaved work.
  useEffect(() => {
    if (!dirty || pending) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty, pending]);

  useEffect(() => {
    if (state.message) summaryRef.current?.focus();
  }, [state]);

  const set = (field: keyof ProductDraft) => (value: string) => {
    setDraft((d) => ({ ...d, [field]: value }));
    setDirty(true);
  };
  const blur = (field: ProductField) => () => setTouched((t) => ({ ...t, [field]: true }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(clientErrors).length > 0 || imageError) {
      summaryRef.current?.focus();
      return;
    }
    const fd = new FormData();
    if (producto) {
      fd.set('id', producto.id);
      fd.set('activoAnterior', String(producto.activo));
    }
    (Object.keys(draft) as (keyof ProductDraft)[]).forEach((k) => fd.set(k, draft[k]));
    if (preventa) fd.set('preventa', 'on');
    if (activo) fd.set('activo', 'on');
    if (file) fd.set('archivo', file, file.name);
    setDirty(false);
    startTransition(() => dispatch(fd));
  };

  const categoria = categorias.find((c) => c.id === draft.categoriaId);
  const precio = Number(draft.precio);
  const existencias = Number(draft.existencias);
  const hasPhoto = Boolean(file || producto?.imagenUrl);
  const visibleErrors = (Object.keys(FIELD_LABELS) as ProductField[]).filter((f) => errorFor(f));

  const checklist = [
    { label: 'Foto del producto', done: hasPhoto, optional: false },
    { label: 'Nombre claro', done: !clientErrors.nombre, optional: false },
    {
      label: `Descripción de ${PRODUCT_LIMITS.descripcionRecomendada}+ caracteres`,
      done: draft.descripcion.trim().length >= PRODUCT_LIMITS.descripcionRecomendada,
      optional: true,
    },
    { label: 'Categoría', done: !clientErrors.categoriaId, optional: false },
    { label: 'Precio', done: !clientErrors.precio, optional: false },
    { label: 'Existencias', done: !clientErrors.existencias, optional: false },
  ];
  const ready = checklist.filter((c) => c.done).length;

  return (
    <form id={formId} className={styles.layout} onSubmit={submit} noValidate>
      <div className={styles.main}>
        {state.message || (submitted && visibleErrors.length > 0) ? (
          <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1}>
            <AlertCircle size={20} strokeWidth={1.5} aria-hidden />
            <div>
              <p className={styles.summaryTitle}>
                {state.message ?? 'Revisa los campos marcados antes de guardar.'}
              </p>
              {visibleErrors.length > 0 ? (
                <ul>
                  {visibleErrors.map((f) => (
                    <li key={f}>
                      <a href={`#${formId}-${f}`}>
                        {FIELD_LABELS[f]}: {errorFor(f)}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
              {state.correlationId ? (
                <p className={styles.meta}>Código de soporte: {state.correlationId}</p>
              ) : null}
            </div>
          </div>
        ) : null}

        <section className={styles.section} aria-labelledby={`${formId}-s1`}>
          <h2 id={`${formId}-s1`} className={styles.sectionTitle}>
            <span>01</span> Fotografía
          </h2>
          <p className={styles.sectionLede}>
            La foto vende antes que el texto. Una sola imagen nítida, de frente y con el producto
            completo.
          </p>
          <div id={`${formId}-archivo`}>
            <ImageDropzone
              file={file}
              onFile={(f) => {
                setFile(f);
                setDirty(true);
              }}
              currentUrl={producto?.imagenUrl}
              error={errorFor('archivo')}
              onError={setImageError}
            />
          </div>
        </section>

        <section className={styles.section} aria-labelledby={`${formId}-s2`}>
          <h2 id={`${formId}-s2`} className={styles.sectionTitle}>
            <span>02</span> Información
          </h2>
          <div className={styles.counted}>
            <Field
              id={`${formId}-nombre`}
              label="Nombre del producto"
              value={draft.nombre}
              onChange={(e) => set('nombre')(e.target.value)}
              onBlur={blur('nombre')}
              maxLength={PRODUCT_LIMITS.nombreMax}
              autoComplete="off"
              hint="Qué es y lo que lo distingue. Ej.: «Jarrón de cerámica esmaltada, 20 cm»."
              error={errorFor('nombre')}
              required
            />
            <span className={styles.counter} aria-hidden="true">
              {draft.nombre.length}/{PRODUCT_LIMITS.nombreMax}
            </span>
          </div>
          <div className={styles.counted}>
            <Field
              id={`${formId}-descripcion`}
              as="textarea"
              label="Descripción (opcional, recomendada)"
              rows={6}
              value={draft.descripcion}
              onChange={(e) => set('descripcion')(e.target.value)}
              onBlur={blur('descripcion')}
              maxLength={PRODUCT_LIMITS.descripcionMax}
              hint="Materiales, medidas, cuidados y qué incluye. Frases cortas, una idea por línea."
              error={errorFor('descripcion')}
            />
            <span className={styles.counter} aria-hidden="true">
              {draft.descripcion.length}/{PRODUCT_LIMITS.descripcionMax}
            </span>
          </div>
          <Field
            id={`${formId}-categoriaId`}
            as="select"
            label="Categoría"
            value={draft.categoriaId}
            onChange={(e) => set('categoriaId')(e.target.value)}
            onBlur={blur('categoriaId')}
            error={errorFor('categoriaId')}
            required
          >
            <option value="" disabled>
              Elige dónde lo buscarán tus compradores
            </option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </Field>
        </section>

        <section className={styles.section} aria-labelledby={`${formId}-s3`}>
          <h2 id={`${formId}-s3`} className={styles.sectionTitle}>
            <span>03</span> Precio e inventario
          </h2>
          <div className={styles.row}>
            <div className={styles.money}>
              <Field
                id={`${formId}-precio`}
                label="Precio en pesos (COP)"
                inputMode="numeric"
                value={draft.precio}
                onChange={(e) => set('precio')(e.target.value.replace(/[^\d]/g, ''))}
                onBlur={blur('precio')}
                hint={
                  Number.isFinite(precio) && precio > 0
                    ? `Se mostrará como ${formatPrice(precio)}`
                    : 'Solo números, sin puntos. Ej.: 59900'
                }
                error={errorFor('precio')}
                required
              />
              <span className={styles.currency} aria-hidden="true">
                $
              </span>
            </div>
            <div className={styles.stock}>
              <label className={styles.stockLabel} htmlFor={`${formId}-existencias`}>
                Existencias
              </label>
              <QuantityStepper
                id={`${formId}-existencias`}
                label="Existencias"
                min={0}
                max={PRODUCT_LIMITS.existenciasMax}
                value={Number.isFinite(existencias) ? existencias : 0}
                onChange={(n) => set('existencias')(String(n))}
              />
              <p
                className={`${styles.stockHint} ${existencias === 0 ? styles.warn : ''}`}
                id={`${formId}-existencias-hint`}
              >
                {existencias === 0
                  ? 'Con 0 unidades se mostrará como «Agotado».'
                  : existencias <= 5
                    ? 'Pocas unidades: se mostrará «Últimas unidades».'
                    : 'Se descuentan solas con cada pedido pagado.'}
              </p>
              {errorFor('existencias') ? (
                <p className={styles.fieldError} role="alert">
                  {errorFor('existencias')}
                </p>
              ) : null}
            </div>
          </div>
        </section>

        <section className={styles.section} aria-labelledby={`${formId}-s4`}>
          <h2 id={`${formId}-s4`} className={styles.sectionTitle}>
            <span>04</span> Visibilidad
          </h2>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              role="switch"
              checked={activo}
              onChange={(e) => {
                setActivo(e.target.checked);
                setDirty(true);
              }}
            />
            <span className={styles.toggleText}>
              <strong>Visible en el catálogo</strong>
              <span>Si lo apagas, se guarda como oculto y nadie puede comprarlo.</span>
            </span>
          </label>
          <label className={styles.toggle}>
            <input
              type="checkbox"
              role="switch"
              checked={preventa}
              onChange={(e) => {
                setPreventa(e.target.checked);
                setDirty(true);
              }}
            />
            <span className={styles.toggleText}>
              <strong>Preventa</strong>
              <span>
                Se puede comprar ahora y lo envías cuando esté disponible. Indica la fecha
                estimada en la descripción.
              </span>
            </span>
          </label>
        </section>
      </div>

      <aside className={styles.aside} aria-label="Vista previa y estado">
        <div className={styles.previewHead}>
          <Eye size={16} strokeWidth={1.5} aria-hidden />
          <span>Así lo verán tus compradores</span>
        </div>
        <div className={styles.preview} inert>
          <ProductCard
            href="#"
            nombre={draft.nombre.trim() || 'Nombre del producto'}
            precio={Number.isFinite(precio) && precio > 0 ? precio : 0}
            imagenUrl={localPhoto ?? producto?.imagenUrl ?? null}
            categoria={categoria?.nombre ?? 'Categoría'}
            outOfStock={existencias === 0}
            preventa={preventa}
            lowStock={existencias > 0 && existencias <= 5}
            sizes="20rem"
          />
        </div>
        {!activo ? <p className={styles.hidden}>Oculto: no aparecerá en el catálogo.</p> : null}

        <div className={styles.checklist}>
          <p className={styles.checkTitle}>
            Listo para publicar <span>{ready}/{checklist.length}</span>
          </p>
          <div
            className={styles.meter}
            role="progressbar"
            aria-label="Avance de la ficha"
            aria-valuemin={0}
            aria-valuemax={checklist.length}
            aria-valuenow={ready}
          >
            <span style={{ transform: `scaleX(${ready / checklist.length})` }} />
          </div>
          <ul>
            {checklist.map((c) => (
              <li key={c.label} className={c.done ? styles.done : ''}>
                {c.done ? (
                  <Check size={16} strokeWidth={1.5} aria-hidden />
                ) : (
                  <Circle size={16} strokeWidth={1.5} aria-hidden />
                )}
                <span>
                  {c.label}
                  {c.optional ? <em> · recomendado</em> : null}
                  <span className="sr-only">{c.done ? ' (completo)' : ' (pendiente)'}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <GlassSurface variant="liquid" strong className={styles.bar}>
        <p className={styles.barStatus} aria-live="polite">
          {pending
            ? file
              ? 'Guardando y subiendo la foto…'
              : 'Guardando…'
            : dirty
              ? 'Cambios sin guardar'
              : isEdit
                ? 'Sin cambios'
                : 'Completa la ficha y guarda'}
        </p>
        <div className={styles.barActions}>
          <Button href="/vendedor/productos" variant="tertiary">
            Cancelar
          </Button>
          <Button type="submit" disabled={pending}>
            <Save size={16} strokeWidth={1.5} aria-hidden />
            {pending ? 'Guardando…' : isEdit ? 'Guardar cambios' : activo ? 'Publicar producto' : 'Guardar oculto'}
          </Button>
        </div>
      </GlassSurface>
    </form>
  );
}

/** Object URL for a local file, revoked when the file changes or the form unmounts. */
function useObjectUrl(file: File | null): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  return url;
}
