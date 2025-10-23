import type { ITableAbstract } from './shared.interface';

export interface ITableRequestTransferElectronicWallet extends ITableAbstract {
	readonly orderN: number;
	readonly date: string;
	readonly fullname: string;
	readonly destiny: string;
	readonly accountOwner: string;
	readonly username: string;
	readonly link: string;
	readonly accountType: string;
	readonly amount: number;
}

export interface ITableRequestTransferOtherAccounts extends ITableAbstract {
	readonly orderN: number;
	readonly fullname: string;
	readonly accountOwner: string;
	readonly countryOp: string;
	readonly bankName: string;
	readonly swiftCode: string;
	readonly ibanCode: string;
	readonly accountNumber: string;
	readonly cciCode: string;
	readonly currency: string;
	readonly amountRequested: number;
}

export interface ITableRequestTransferExclusiveBrands extends ITableAbstract {
	readonly orderN: number;
	readonly fullname: string;
	readonly accountOwner: string;
	readonly countryOp: string;
	readonly bankName: string;
	readonly swiftCode: string;
	readonly ibanCode: string;
	readonly accountNumber: string;
	readonly cciCode: string;
	readonly currency: string;
	readonly amountRequested: number;
}
