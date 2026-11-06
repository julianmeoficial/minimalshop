/**
 * Preguntas frecuentes. Answers describe only what the storefront and the API actually do —
 * no invented shipping costs, delivery times or return windows.
 */
export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface FaqGroup {
  readonly title: string;
  readonly items: readonly FaqItem[];
}

export const FAQ: readonly FaqGroup[] = [
  {
    title: 'Compras y pagos',
    items: [
      {
        id: 'como-pagar',
        question: '¿Cómo pago mi pedido?',
        answer:
          'Agrega las piezas al carrito, ve al checkout y confirma la dirección de envío. Al crear el pedido te llevamos a una pasarela de pago externa para completar el pago de forma segura.',
      },
      {
        id: 'datos-tarjeta',
        question: '¿MinimalShop guarda los datos de mi tarjeta?',
        answer:
          'No. El pago se procesa en la pasarela externa; MinimalShop nunca recibe ni almacena los datos de tu tarjeta.',
      },
      {
        id: 'cupon',
        question: '¿Puedo usar un cupón de descuento?',
        answer:
          'Sí. Escribe el código en el paso «Cupón» del checkout. Si es válido, el descuento se aplica al crear el pedido y lo verás en el detalle.',
      },
      {
        id: 'moneda',
        question: '¿En qué moneda están los precios?',
        answer: 'Todos los precios están en pesos colombianos (COP).',
      },
      {
        id: 'cuenta',
        question: '¿Necesito una cuenta para comprar?',
        answer:
          'Puedes explorar el catálogo sin cuenta. Para usar el carrito, pagar y seguir tus pedidos necesitas una cuenta de comprador; crearla toma un minuto.',
      },
    ],
  },
  {
    title: 'Pedidos y existencias',
    items: [
      {
        id: 'seguimiento',
        question: '¿Cómo sé en qué va mi pedido?',
        answer:
          'En «Mis pedidos» ves cada estado con texto e icono: pendiente de pago, pagado, en preparación, enviado y entregado.',
      },
      {
        id: 'cancelar',
        question: '¿Puedo cancelar un pedido?',
        answer:
          'Sí, mientras el pedido todavía lo permita. Si es posible, verás el botón «Cancelar pedido» en su detalle; te pediremos confirmarlo antes de hacerlo.',
      },
      {
        id: 'agotado',
        question: '¿Qué pasa si un producto se agota mientras compro?',
        answer:
          'Te avisamos en el carrito y no podrás pagar esa cantidad hasta ajustarla. Tu carrito se conserva, así que no pierdes lo que ya elegiste.',
      },
      {
        id: 'preventa',
        question: '¿Qué significa «Preventa»?',
        answer:
          'Puedes comprar la pieza ahora; el vendedor la prepara y la envía cuando esté disponible. Revisa la descripción del producto para más detalles.',
      },
    ],
  },
  {
    title: 'Vender en MinimalShop',
    items: [
      {
        id: 'quien-vende',
        question: '¿Quién vende los productos?',
        answer:
          'Pequeños vendedores independientes. Cada ficha de producto indica quién lo vende.',
      },
      {
        id: 'empezar-vender',
        question: '¿Cómo empiezo a vender?',
        answer:
          'Crea una cuenta eligiendo «Vender mis piezas». Desde tu panel publicas productos con precio, existencias e imagen, y gestionas los pedidos que recibes.',
      },
    ],
  },
];

const ALL: readonly FaqItem[] = FAQ.flatMap((g) => g.items);

/** Pick questions by id, in the order given (unknown ids are skipped). */
export function faqItems(ids: readonly string[]): FaqItem[] {
  return ids.flatMap((id) => ALL.filter((item) => item.id === id));
}

export const ALL_FAQ_ITEMS = ALL;
