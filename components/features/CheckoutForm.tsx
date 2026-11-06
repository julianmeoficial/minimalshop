'use client';

import { Check, Lock, MapPin, Plus, Tag, X } from 'lucide-react';
import {
  useActionState,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';

import { Button, Field, PriceTag, ProductImage, ProductPlaceholder } from '@/components/ui';
import {
  placeOrderAction,
  previewCouponAction,
  type CheckoutActionState,
  type CouponPreviewState,
} from '@/lib/actions/checkout';
import type { Direccion, ResumenCarrito } from '@/lib/api/types';
import { formatPrice } from '@/lib/format';

import { BottomBar } from './BottomBar';

import styles from './CheckoutForm.module.css';

const initial: CheckoutActionState = { ok: true };
const NEW = 'nueva';

export interface CheckoutFormProps {
  readonly carrito: ResumenCarrito;
  readonly direcciones: readonly Direccion[];
  readonly visuales: Readonly<Record<string, { imagenUrl: string | null; categoria: string | null }>>;
}

interface NewAddress {
  etiqueta: string;
  direccion: string;
  ciudad: string;
  codigoPostal: string;
  telefono: string;
}

/**
 * Checkout: a single column of steps plus a sticky summary (DESIGN.md §9). Every field is
 * controlled and the order is sent as FormData built here, so nothing typed is lost if the
 * API refuses the order. The idempotency key is stable for this visit.
 */
export function CheckoutForm({ carrito, direcciones, visuales }: CheckoutFormProps) {
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);
  const [state, dispatch, pending] = useActionState(placeOrderAction, initial);
  const [, startOrder] = useTransition();
  const formId = useId();
  const errorRef = useRef<HTMLDivElement>(null);

  const principal = direcciones.find((d) => d.principal) ?? direcciones[0];
  const [selected, setSelected] = useState<string>(principal?.id ?? NEW);
  const [nueva, setNueva] = useState<NewAddress>({
    etiqueta: 'Casa',
    direccion: '',
    ciudad: '',
    codigoPostal: '',
    telefono: '',
  });
  const [guardar, setGuardar] = useState(true);
  const [touched, setTouched] = useState(false);

  const [codigo, setCodigo] = useState('');
  const [cupon, setCupon] = useState<CouponPreviewState | null>(null);
  const [checking, startCoupon] = useTransition();

  const usingNew = selected === NEW;
  const addressErrors = {
    direccion:
      usingNew && nueva.direccion.trim().length < 5
        ? 'Escribe la dirección completa (calle, número, apartamento).'
        : undefined,
    ciudad: usingNew && !nueva.ciudad.trim() ? 'Indica la ciudad.' : undefined,
  };
  const invalid = Boolean(addressErrors.direccion || addressErrors.ciudad);
  const descuento = cupon?.ok ? (cupon.descuento ?? 0) : 0;
  const total = Math.max(0, carrito.subtotal - descuento);

  useEffect(() => {
    if (state.message) errorRef.current?.focus();
  }, [state]);

  const applyCoupon = () => {
    startCoupon(async () => {
      setCupon(await previewCouponAction(codigo, carrito.subtotal));
    });
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (invalid || !carrito.comprable) return;
    const fd = new FormData();
    fd.set('idempotencyKey', idempotencyKey);
    if (usingNew) {
      fd.set('etiqueta', nueva.etiqueta);
      fd.set('direccionEnvio', nueva.direccion);
      fd.set('ciudad', nueva.ciudad);
      fd.set('codigoPostal', nueva.codigoPostal);
      fd.set('telefono', nueva.telefono);
      if (guardar) fd.set('guardar', 'on');
    } else {
      fd.set('direccionId', selected);
    }
    if (cupon?.ok && cupon.codigo) fd.set('cupon', cupon.codigo);
    startOrder(() => dispatch(fd));
  };

  const setField = (key: keyof NewAddress) => (value: string) =>
    setNueva((n) => ({ ...n, [key]: value }));

  const submitLabel = pending ? 'Creando tu pedido…' : `Confirmar y pagar ${formatPrice(total)}`;

  return (
    <form id={formId} className={styles.form} onSubmit={submit} noValidate>
      <div className={styles.steps}>
        <ol className={styles.progress} aria-label="Pasos de la compra">
          <li className={styles.stepDone}>
            <Check size={14} strokeWidth={2} aria-hidden /> Carrito
          </li>
          <li className={styles.stepCurrent} aria-current="step">
            <span>2</span> Envío y cupón
          </li>
          <li>
            <span>3</span> Pago
          </li>
        </ol>

        {state.message ? (
          <div ref={errorRef} className={styles.error} role="alert" tabIndex={-1}>
            <p>{state.message}</p>
            {state.correlationId ? (
              <p className={styles.meta}>Código de soporte: {state.correlationId}</p>
            ) : null}
            <p className={styles.meta}>Tu carrito sigue intacto; puedes intentarlo de nuevo.</p>
          </div>
        ) : null}

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <span className={styles.stepNo}>01</span> ¿A dónde lo enviamos?
          </legend>

          <div className={styles.addresses} role="radiogroup" aria-label="Dirección de envío">
            {direcciones.map((d) => (
              <label
                key={d.id}
                className={`${styles.address} ${selected === d.id ? styles.addressOn : ''}`}
              >
                <input
                  type="radio"
                  name="direccion"
                  value={d.id}
                  checked={selected === d.id}
                  onChange={() => setSelected(d.id)}
                />
                <MapPin size={18} strokeWidth={1.5} aria-hidden />
                <span className={styles.addressText}>
                  <strong>
                    {d.etiqueta}
                    {d.principal ? <span className={styles.badge}>Principal</span> : null}
                  </strong>
                  <span>
                    {[d.direccion, d.ciudad, d.codigoPostal].filter(Boolean).join(', ')}
                  </span>
                  {d.telefono ? <span>Tel. {d.telefono}</span> : null}
                </span>
              </label>
            ))}
            <label className={`${styles.address} ${usingNew ? styles.addressOn : ''}`}>
              <input
                type="radio"
                name="direccion"
                value={NEW}
                checked={usingNew}
                onChange={() => setSelected(NEW)}
              />
              <Plus size={18} strokeWidth={1.5} aria-hidden />
              <span className={styles.addressText}>
                <strong>{direcciones.length > 0 ? 'Usar otra dirección' : 'Nueva dirección'}</strong>
                <span>Para esta compra o para guardarla.</span>
              </span>
            </label>
          </div>

          {usingNew ? (
            <div className={styles.newAddress}>
              <Field
                id={`${formId}-direccion`}
                label="Dirección"
                value={nueva.direccion}
                onChange={(e) => setField('direccion')(e.target.value)}
                onBlur={() => setTouched(true)}
                autoComplete="street-address"
                maxLength={300}
                hint="Calle, número, apartamento o casa."
                error={touched ? addressErrors.direccion : undefined}
                required
              />
              <div className={styles.pair}>
                <Field
                  id={`${formId}-ciudad`}
                  label="Ciudad"
                  value={nueva.ciudad}
                  onChange={(e) => setField('ciudad')(e.target.value)}
                  autoComplete="address-level2"
                  maxLength={100}
                  error={touched ? addressErrors.ciudad : undefined}
                  required
                />
                <Field
                  id={`${formId}-cp`}
                  label="Código postal (opcional)"
                  value={nueva.codigoPostal}
                  onChange={(e) => setField('codigoPostal')(e.target.value)}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  maxLength={20}
                />
              </div>
              <div className={styles.pair}>
                <Field
                  id={`${formId}-tel`}
                  label="Teléfono de contacto (opcional)"
                  type="tel"
                  value={nueva.telefono}
                  onChange={(e) => setField('telefono')(e.target.value)}
                  autoComplete="tel"
                  hint="Para coordinar la entrega."
                />
                <Field
                  id={`${formId}-etiqueta`}
                  label="Nombre de la dirección"
                  value={nueva.etiqueta}
                  onChange={(e) => setField('etiqueta')(e.target.value)}
                  autoComplete="off"
                  maxLength={100}
                  hint="Ej.: Casa, Oficina."
                />
              </div>
              <label className={styles.check}>
                <input
                  type="checkbox"
                  checked={guardar}
                  onChange={(e) => setGuardar(e.target.checked)}
                />
                Guardar esta dirección para próximas compras
              </label>
            </div>
          ) : null}
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <span className={styles.stepNo}>02</span> ¿Tienes un cupón?
          </legend>
          {cupon?.ok ? (
            <div className={styles.applied} role="status">
              <Tag size={18} strokeWidth={1.5} aria-hidden />
              <span>
                <strong>{cupon.codigo}</strong> · {cupon.descripcion}
              </span>
              <Button
                variant="tertiary"
                onClick={() => {
                  setCupon(null);
                  setCodigo('');
                }}
              >
                <X size={16} strokeWidth={1.5} aria-hidden />
                Quitar
              </Button>
            </div>
          ) : (
            <div className={styles.coupon}>
              <Field
                id={`${formId}-cupon`}
                label="Código de descuento"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value.toUpperCase());
                  if (cupon) setCupon(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (codigo.trim()) applyCoupon();
                  }
                }}
                autoComplete="off"
                autoCapitalize="characters"
                maxLength={40}
                error={cupon && !cupon.ok ? cupon.message : undefined}
              />
              <Button
                variant="secondary"
                disabled={checking || !codigo.trim()}
                onClick={applyCoupon}
                className={styles.couponButton}
              >
                {checking ? 'Validando…' : 'Aplicar'}
              </Button>
            </div>
          )}
        </fieldset>

        <section className={styles.fieldset} aria-labelledby={`${formId}-pago`}>
          <h2 id={`${formId}-pago`} className={styles.legend}>
            <span className={styles.stepNo}>03</span> Al confirmar
          </h2>
          <ol className={styles.next}>
            <li>Creamos tu pedido y reservamos las existencias.</li>
            <li>Iniciamos el pago con la pasarela externa y te mostramos su estado. No guardamos tu tarjeta.</li>
            <li>Sigues cada paso en «Mis pedidos»: pagado, enviado, entregado.</li>
          </ol>
        </section>
      </div>

      <aside className={styles.summary} id={`${formId}-resumen`} aria-labelledby={`${formId}-rt`}>
        <h2 id={`${formId}-rt`} className={styles.summaryTitle}>
          Tu pedido{' '}
          <span>
            ({carrito.unidades} {carrito.unidades === 1 ? 'pieza' : 'piezas'})
          </span>
        </h2>
        <ul className={styles.lines}>
          {carrito.items.map((item) => {
            const v = visuales[item.productoId];
            return (
              <li key={item.productoId}>
                <span className={styles.thumb} aria-hidden="true">
                  {v?.imagenUrl ? (
                    <ProductImage
                      src={v.imagenUrl}
                      alt=""
                      sizes="56px"
                      fallback={
                        <ProductPlaceholder nombre={item.nombre} categoria={v.categoria} size="thumb" />
                      }
                    />
                  ) : (
                    <ProductPlaceholder nombre={item.nombre} categoria={v?.categoria} size="thumb" />
                  )}
                  <span className={styles.qtyBadge}>{item.cantidad}</span>
                </span>
                <span className={styles.lineName}>
                  {item.nombre}
                  <span className={styles.qty}>
                    {item.cantidad} × {formatPrice(item.precioUnitario)}
                  </span>
                </span>
                <PriceTag amount={item.subtotal} />
              </li>
            );
          })}
        </ul>
        <dl className={styles.totals}>
          <div>
            <dt>Subtotal</dt>
            <dd>
              <PriceTag amount={carrito.subtotal} />
            </dd>
          </div>
          {descuento > 0 ? (
            <div className={styles.discount}>
              <dt>Descuento ({cupon?.codigo})</dt>
              <dd>−{formatPrice(descuento)}</dd>
            </div>
          ) : null}
          <div className={styles.grand}>
            <dt>Total estimado</dt>
            <dd>
              <PriceTag amount={total} variant="large" />
            </dd>
          </div>
        </dl>
        {!carrito.comprable ? (
          <p className={styles.warn} role="status">
            Hay productos sin existencias suficientes. Vuelve al carrito para ajustarlos.
          </p>
        ) : null}
        <Button type="submit" fullWidth disabled={pending || !carrito.comprable}>
          <Lock size={16} strokeWidth={1.5} aria-hidden />
          {submitLabel}
        </Button>
        <p className={styles.note}>
          El total final lo confirma la tienda al crear el pedido. Precios en pesos colombianos.
        </p>
        <Button href="/carrito" variant="tertiary">
          Volver al carrito
        </Button>
      </aside>

      <BottomBar watchId={`${formId}-resumen`} label="Total y pago">
        <span className={styles.barText}>
          <span className={styles.barLabel}>Total</span>
          <PriceTag amount={total} />
        </span>
        <Button type="submit" form={formId} disabled={pending || !carrito.comprable}>
          <Lock size={16} strokeWidth={1.5} aria-hidden />
          {pending ? 'Creando…' : 'Confirmar'}
        </Button>
      </BottomBar>
    </form>
  );
}
