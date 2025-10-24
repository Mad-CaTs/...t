import { ISelect } from '@shared/interfaces/forms-control';
import { AccountElectronicWalletTableDataMock } from '../../_mock';

export const businessOptMock: ISelect[] =
  AccountElectronicWalletTableDataMock.map((a, i) => ({
    value: i + 1,
    content: a.bussiness,
  }));
