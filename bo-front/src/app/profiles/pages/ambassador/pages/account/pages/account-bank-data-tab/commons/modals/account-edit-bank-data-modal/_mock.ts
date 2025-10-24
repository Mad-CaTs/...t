import { INavigation } from '@init-app/interfaces';
import { ISelect } from '@shared/interfaces/forms-control';
import { AccountBankTableDataMock } from '../../mocks/_mock';

export const NavigationMock: INavigation[] = [
  {
    id: 1,
    text: 'Banco',
  },
  {
    id: 2,
    text: 'Cuenta',
  },
  {
    id: 3,
    text: 'Titular',
  },
];

export const BankNameOptMock: ISelect[] = AccountBankTableDataMock.map(
  (item, i) => ({
    value: i + 1,
    content: item.bankName,
  })
);
export const OpCountryOptMock: ISelect[] = AccountBankTableDataMock.map(
  (item, i) => ({
    value: i + 1,
    content: item.opCountry,
  })
);
export const AccountTypeOptMock: ISelect[] = [
  {
    value: 1,
    content: 'Cuenta Ahorros',
  },
  {
    value: 2,
    content: 'Cuenta corriente',
  },
];

export const TypeAccountBankOptMock: ISelect[] = [
  {
    value: 1,
    content: 'Titular',
  },
  {
    value: 2,
    content: 'Nuevo',
  },
];
