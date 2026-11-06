import { logoutAction, readUsuario } from '@/lib/auth/session';

import { NavBar, type NavLinkItem } from './NavBar';

export async function BuyerNav() {
  const usuario = await readUsuario();

  const links: NavLinkItem[] = [
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/funcionamiento', label: 'Funcionamiento' },
  ];
  if (usuario) {
    links.push({ href: '/cuenta/pedidos', label: 'Pedidos' });
  } else {
    links.push({ href: '/cuenta/registro?rol=VENDEDOR', label: 'Vender' });
  }
  if (usuario?.rol === 'VENDEDOR') {
    links.push({ href: '/vendedor/productos', label: 'Mi tienda' });
  }
  if (usuario?.rol === 'SUPERADMIN') {
    links.push({ href: '/admin', label: 'Administración' });
  }

  return (
    <NavBar
      links={links}
      userName={usuario?.nombre ?? null}
      showCart={usuario === null || usuario.rol === 'COMPRADOR'}
      logoutAction={usuario ? logoutAction : null}
    />
  );
}
