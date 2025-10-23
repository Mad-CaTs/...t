import { ISelectOpt } from './form-control.interface';
import type { ITableAbstract } from './shared.interface';

export interface ITableInitialPayments extends ITableAbstract {
	ordenNumber: number;
	date: string;
	username: string;
	fullname: string;
	dni: string;
	partner: string;
	membership: string;
	couponCode: string;
	daysGracePeriod: number;
	verification: boolean;
	preState: boolean;
	idSuscription: number;
	idUser: number;
}

export interface ITableMigrationPayments extends ITableInitialPayments {
	paymentDate: string;
	package: string;
}

export interface ITablePendingPayments extends ITableInitialPayments {
	nationality: string;
	phone: string;
}

export interface ITableExpiratedPayments extends ITableAbstract {
	iduser: string;
	idsuscription: string;
	ordenNumber: number;
	fullname: string;
	description: string;
	date: string;
	amount: number;
	package?: {
		idPackage: string;
		name: string;
	};
	packageOpt: ISelectOpt[];
}

export interface ITableWalletPaymentBox extends ITableAbstract {
	date: string;
	username: string;
	names: string;
	dni: string;
	concept: string;
	bank: string;
	accountType: string;
	opNumber: string;
	amount: number;
	hasPayed: boolean;
	prevalidity: string;
}

export interface ITableWalletPaymentBoxCronogram extends ITableAbstract {
	description: string;
	date: string;
	capital: number;
	amortization: number;
	interest: number;
	cuote: number;
	points: number;
	status: string;
	opCode: string;
	opBussinessCode: string;
	paymentChannel: string;
	currency: string;
	subtotal: number;
	comission: number;
	mora: number;
	total: number;
}

export interface ITableBankMovement extends ITableAbstract {
	bankName: string;
	accountNumber: string;
	accountType: 'Soles' | 'Dolares';
	date: string;
	registerNumber: number;
	registerValidation: number;
	pendings: number;
}

export interface ITableBankMovementCharge extends ITableAbstract {
	opDate: string;
	processDate: string;
	opNumber: string;
	movement: number;
	description: string;
	canal: string;
	charge: string;
	bonus: number;
	state: string;
}

export interface ITableValidatePayments extends ITableAbstract {
	description: string;
	date: string;
	capital: number;
	amortization: number;
	interest: number;
	cuota: number;
	points: number;
	state: string;
	idPaymentVoucher: number[];
	opCode: number[];
	paymentChannel: string[];
	nota: string[];
	currency: string[];
	subtotal: number[];
	comission: number[];
	mora: number[];
	total: number[];
	imgUrl: string[];
	idPayment: number;
	observation: string;
	numberQuotePay: number;
}
