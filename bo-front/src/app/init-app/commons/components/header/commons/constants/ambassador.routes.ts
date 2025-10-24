import { RoutesMenu } from '../interfaces/routes-menu.interface';

export const ambassadorRoutes: RoutesMenu[] = [
  {
    name_icon: 'data_usage',
    name_link: 'Resumen',
    url: '/ambassador/review',
  },
  {
    name_icon: 'add',
    name_link: 'Nuevo socio',
    url: '/ambassador/new-partner',
  },
  {
    name_icon: 'email',
    name_link: 'Envíos de correo',
    url: '/ambassador/email-shipping',
  },
  {
    name_icon: 'account_tree',
    name_link: 'Red',
    url: '/ambassador/account-tree/sponshorship-tree',
  },
  {
    name_icon: 'fiber_new',
    name_link: 'Comunicados',
    url: '/ambassador/advices',
  },
  {
    name_icon: 'settings',
    name_link: 'Herramientas',
    url: '/ambassador/tools',
  },
  {
    name_icon: 'payment',
    name_link: 'Pagos y Comisiones',
    url: '/ambassador/payments',
  },
  {
    name_icon: 'store_front',
    name_link: 'Tienda',
    url: '/ambassador/store',
  },
  {
    name_icon: 'account_circle',
    name_link: 'Cuenta',
    url: '/ambassador/account',
  },
];
