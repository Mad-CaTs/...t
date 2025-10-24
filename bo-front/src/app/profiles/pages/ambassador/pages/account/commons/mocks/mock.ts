import { IAccountNavigation } from '../interfaces/account';

export const AccountNavigation: IAccountNavigation[] = [
  {
    id: 1,
    text: 'Datos Personales',
    icon: 'person_outline',
  },
  /*{
    id: 2,
    text: 'Datos Personales',
    icon: 'person_outline',
  },
  {
    id: 3,
    text: 'Datos Bancarios',
    icon: 'planet',
    svg: true,
  },
  {
    id: 4,
    text: 'Billetera Electrónica',
    icon: 'credit_card',
  },
  {
    id: 5,
    text: 'Información de Empresa',
    icon: 'business',
  },*/
 /*  {
    id: 6,
    text: 'Seguimiento de tickets',
    icon: 'ticket',
    svg: true,
  }, */
  {
    id: 8,
    text: 'Beneficiarios',
    icon: 'person_outline',
  },
  {
    id: 7,
    text: 'Socios Liquidados',
    icon: 'touch_app',
  },
];
export const mockAccountNavigationUris = [
  {
    id: 1,
    url: '/profile/ambassador/account/account-data',
  },
  {
    id: 2,
    url: '/profile/ambassador/account/trinary-tree',
  },
  {
    id: 3,
    url: '/profile/ambassador/account/partner-list',
  },
  {
    id: 4,
    url: '/profile/ambassador/account/placement-page',
  },
  {
    id: 5,
    url: '/profile/ambassador/account/activation-manager',
  },
  {
    id: 6,
    url: '/profile/ambassador/account/account-tickets-follow',
  },
  {
    id: 7,
    url: '/profile/ambassador/account/liquidated-data',
  },
  {
    id: 8,
    url: '/profile/ambassador/account/beneficiary-data',
  },
];