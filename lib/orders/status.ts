import type { OrderStatus } from '@/lib/api/types';
import type { StatusChipVariant } from '@/components/ui';

export function orderStatusLabel(estado: OrderStatus): string {
  switch (estado) {
    case 'CREADO':
      return 'Creado';
    case 'PENDIENTE_PAGO':
      return 'Pendiente de pago';
    case 'PAGADO':
      return 'Pagado';
    case 'EN_PREPARACION':
      return 'En preparación';
    case 'ENVIADO':
      return 'Enviado';
    case 'ENTREGADO':
      return 'Entregado';
    case 'CANCELADO':
      return 'Cancelado';
    case 'REEMBOLSADO':
      return 'Reembolsado';
  }
}

export function orderStatusVariant(estado: OrderStatus): StatusChipVariant {
  switch (estado) {
    case 'CREADO':
    case 'PENDIENTE_PAGO':
      return 'pending';
    case 'PAGADO':
      return 'paid';
    case 'EN_PREPARACION':
    case 'ENVIADO':
      return 'shipped';
    case 'ENTREGADO':
      return 'delivered';
    case 'CANCELADO':
    case 'REEMBOLSADO':
      return 'cancelled';
  }
}
