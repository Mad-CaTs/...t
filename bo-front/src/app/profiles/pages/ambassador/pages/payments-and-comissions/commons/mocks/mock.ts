import { INavigation } from '@init-app/interfaces';

export const paymentsAndComissionsNavigation: INavigation[] = [
  {
    id: 1,
    text: 'Mis Comisiones',
  },
 /*  {
    id: 2,
    text: 'Wallet',
  }, */
  {
    id: 3,
    text: 'Conciliación',
  },
  {
    id: 4,
    text: 'Exoneración de renta',
  },
  {
    id: 5,
    text: 'Premios'
  }
];

export const mockNavigationUrls = [
  {
    id: 0,
    url: '/profile/ambassador/payments',
  },
  {
    id: 1,
    url: '/profile/ambassador/payments/wallet',
  },
]