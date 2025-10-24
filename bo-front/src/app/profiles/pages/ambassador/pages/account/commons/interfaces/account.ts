import { INavigation } from '@init-app/interfaces';

export interface IAccountNavigation extends INavigation {
  readonly icon: string;
  readonly svg?: boolean;
}

export interface ITicketTrackingOption {
  readonly id: number;
  readonly icon: string;
  readonly title: string;
  readonly helper: string;
  readonly childOptions: ITicketTrackingOption[];
}

export interface ITableBankData {
  readonly id: number;
  readonly opCountry: string;
  readonly bankName: string;
  readonly bankAddress: string;
  readonly accountNumber: string;
  readonly cci: string;
  readonly ownerFullname: string;
}

export interface ITableAccountElectronicWallet {
  readonly id: number;
  readonly bussiness: string;
  readonly owner: string;
  readonly code: string;
  readonly paymentLink: string;
}
