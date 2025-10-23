import type { ITableAbstract } from './shared.interface';

export interface ITableGracePeriod extends ITableAbstract {
	id: number;
	username: string;
	dni: string;
	fullname: string;
	gender: string;
	email: string;
	phone: string;
	partner: string;
	state: string;
	membership: string;
}

export interface ITableComissionEditor extends ITableAbstract {
	spornship: string;
	username: string;
	partner: string;
	level: number;
	bonusType: string;
	membership: string;
	percentaje: number;
	points: number;
	amount: number;
}

export interface ITableAdminWallet extends ITableAbstract {
	idUser: number;
	creationDate: string;
	username: string;
	name: string;
	lastName: string;
	email: string;
	documentNumber: string;
}

export interface ITableAdminWalletConsilation extends ITableAbstract {
	n: number;
	dateLimit: string;
	username: string;
	fullname: string;
	month: string;
	amount: number;
	status: string;
	hasNotify?: boolean;
	viewDocument?: boolean;
}

export interface ITableAdminWalletUpload extends ITableAbstract {
	n: number;
	ownerUsername: string;
	destinyUsername: string;
	amount: number;
	initialDate: string;
}

export interface ITableFamilyPackage extends ITableAbstract {
	readonly name: string;
	readonly description: string;
	readonly activeVersion: string;
	readonly lastVersion: string;
}

export interface ITablePackagePackage extends ITableAbstract {
	readonly name: string;
	readonly code: string;
	readonly description: string;
	readonly status: boolean;
}

export interface ITableDetailPackage extends ITableAbstract {
	readonly family: string;
	readonly name: string;
	readonly code: string;
	readonly months: number;
	readonly price: number;
	readonly cuotes: number;
	readonly initialPrice: number;
	readonly cuotePrice: number;
	readonly volume: number;
	readonly volumeByFee: number;
	readonly intialCuoteN: number;
	readonly comission: number;
	readonly actionsN: number;
	readonly idPackage: string;
	readonly packageName: string;
	readonly pointsFree: number;
	readonly interCuote: number;
	readonly points: number;
	readonly freePointStatus: boolean;
}

export interface ITablePromotionalCodePackage extends ITableAbstract {
	readonly username: string;
	readonly fullname: string;
	readonly docNumber: string;
	readonly email: string;
	readonly phone: string;
	readonly composeRank: string;
}

export interface ITablePromotionalViewCodePackage extends ITableAbstract {
	readonly code: string;
	readonly createdDate: string;
	readonly expirateDate: string;
	readonly family: string;
	readonly version: string;
}

export interface ITableHistoricalRecord extends ITableAbstract {
	readonly startDate: string;
	readonly endDate: string;
	readonly idPackage: string;
	readonly packageName: string;
	readonly code: string;
	readonly months: number;
	readonly price: number;
	readonly cuotes: number;
	readonly initialPrice: number;
	readonly cuotePrice: number;
	readonly volume: number;
	readonly initialCuoteN: number;
	readonly actionsN: number;
	readonly pointsFree: number;
}
