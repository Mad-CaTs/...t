import { RoutesMenu } from '@init-app/components/header/commons/interfaces';

export const ambassadorRoutes: RoutesMenu[] = [
  {
    name_icon: 'data_usage',
    name_link: 'Resumen',
    url: '/profile/ambassador/dashboard/primary-profile'
  },
  {
    name_icon: 'add',
    name_link: 'Nuevo socio',
    url: '/profile/ambassador/new-partner'
  },
  {
    name_icon: 'account_balance_wallet',
    name_link: 'Mi Wallet',
    url: '/profile/ambassador/wallet'
  },
  {
    name_icon: 'email',
    name_link: 'Envíos de Correo',
    url: '/profile/ambassador/email-shipping'
  },
  {
    name_icon: 'account_tree',
    name_link: 'Red',
    url: '/profile/ambassador/account-tree/sponshorship-tree'
  },
  {
    name_icon: 'fiber_new',
    name_link: 'Comunicados',
    url: '/profile/ambassador/advices'
  },
  {
    name_icon: 'settings',
    name_link: 'Herramientas',
    url: '/profile/ambassador/tools'
  },
  {
    name_icon: 'event',
    name_link: 'Eventos',
    children: [
      {
        name_icon: 'shopping_cart',
        name_link: 'Mis compras',
        url: '/profile/ambassador/events/my-purchases'
      },
      {
        name_icon: 'confirmation_number',
        name_link: 'Mis entradas',
        url: '/profile/ambassador/events/my-tickets'
      }
    ]
  },
  {
    name_icon: 'payment',
    name_link: 'Pagos y Comisiones',
    url: '/profile/ambassador/payments'
  },
  {
    name_icon: 'workspace_premium',
    name_link: 'Premios',
    url: '/profile/ambassador/my-awards'
  },
  {
    name_icon: 'feed',
    name_link: 'Tickets',
    url: '/profile/ambassador/tickets/dashboard-tickets'
  },
  {
    name_icon: 'store_front',
    name_link: 'Tienda',
    url: '/profile/ambassador/store'
  },
  {
    name_icon: 'account_circle',
    name_link: 'Cuenta',
    url: '/profile/ambassador/account/account-data'
  },
  {
    name_icon: 'group_add',
    name_link: 'Prospectos',
    url: '/profile/ambassador/prospect'
  }
];
