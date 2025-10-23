import { ITableAbstract } from './shared.interface';

export interface ITableLiquidationRequest extends ITableAbstract {
	dateRequest: string;
	username: string;
	nickname: string;
	fullname: string;
	briefcase: string;
	membership: IMembership[];
	reason: string;
}

export interface IMembership extends ITableAbstract {
	name: string;
	description: string;
	dueDate: string;
	capital: number;
	amortization: number;
	interest: number;
	debt: number;
	quota: number;
	total: number;
	payDate: string;
	familyPackageName: string;
	idFamilyPackage: number;
	idPackage: number;
	idSuscription: number;
	packageName: string;
}
