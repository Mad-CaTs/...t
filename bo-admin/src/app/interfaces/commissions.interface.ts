import { ITableAbstract } from './shared.interface';
import { IResponse } from './wallet-transaction-type.interface';

export interface ITableCommissionType extends ITableAbstract {
	levelSponsor: number;
	amount: number;
	percentage: number;
	membership: string;
	createDate: string;
	registerDate: number[];
	period: string;
	username: string;
	name: string;
	lastname: string;
	fullnameSponsor: string;
	idPeriod: number;
	points: number;
	idSponsor: number;
	idSlave: number;
	exchangeRate: number;
	description: string;
	typeBonus: number;
	isLevelQualified: boolean;
	isConditionQualified: boolean;
	commissionCase: string;
	idSuscription: number;
	idStatus: number;
	insertDate: number[];
	idTransaction: string;
	type: string;
	paidStatus: number;
	namesponsor: string;
	lastnamesponsor: string;
	packageName: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface ITableBonusRank extends ITableAbstract {
	username: string;
	bonusTypeName: number;
	rangeName: string;
	amount: number;
	byStatus: boolean;
	byMembership: boolean;
	createDate: string;
	period: string;
	idPeriod: number;
	idSponsor: number;
	idSlave: number;
	levelSponsor: number;
	registerDate: number[];
	typeBonus: number;
	exchangeRate: number;
	isLevelQualified: boolean;
	isConditionQualified: boolean;
	commissionCase: string;
	idSuscription: number;
	idStatus: number;
	idTransaction: string;
	percentage: number;
	points: number;
	insertDate: number[];
	paidStatus: number;
	type: string;
	regularization: number;
	difference: number;
	description: string;
	name: string;
	lastname: string;
	nameSponsor: string;
	lastNameSponsor: string;
	range: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface ITableHistoricalCommissions extends ITableAbstract {
	idBonus: number;
	idUser: number;
	fullnameUser: string;
	nameUser: string;
	lastNameUser: string;
	userNameUser: string;
	idSlave: number;
	nameSlave: string;
	lastNameSlave: string;
	fullnameSlave: string;
	levelSponsor: number;
	tipoBono: string;
	membresia: string;
	amount: number;
	percentage: number;
	points: number;
	cycleDate: string;
	idPeriod: number;
}

export interface IListMembershipByIdUserRequest {
	idSuscription: number;
	nameSuscription: string;
	creationDate: number[];
	createDateSuscription: number[];
	isMigrated: number;
	order: number;
	typeCommision: number;
}

export interface IListMembershipByIdUserResponse extends IResponse {
	data: IListMembershipByIdUserRequest[];
}

export interface ILevelCommissionPanelAdmin {
	id: number;
	idSponsor: number;
	idSlave: number;
	levelSponsor: number;
	registerDate: number[];
	exchangeRate: number;
	typeBonus: number;
	amount: number;
	isLevelQualified: boolean;
	isConditionQualified: boolean;
	commissionCase: string;
	idSuscription: number;
	idStatus: number;
	percentage: number;
	points: number;
	insertDate: number[];
	idTransaction: string;
	type: string;
	idPeriod: number;
	paidStatus: number;
	description: string;
	username: string;
	name: string;
	lastname: string;
	packageName: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface ILevelCommissionPanelAdminResponse extends IResponse {
	data: ILevelCommissionPanelAdmin[];
}

export interface IPayOneUserBonusResponse extends IResponse {
	data: {
		success: boolean;
		message: string;
	};
}
