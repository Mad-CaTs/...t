import { ITableAbstract } from './shared.interface';

export interface IResponse {
	result: boolean;
	timestamp: string;
	status: number;
}

export interface IWalletTransactionType {
	idTypeWalletTransaction: number;
	description: string;
}

export interface IWalletTransactionTypeResponse extends IResponse {
	data: IWalletTransactionType[];
}

export interface IUpdateMembershipBonusResponse extends IResponse {
	data: IUpdateMembershipBonusRequest;
}

export interface IUpdateMembershipRangeBonusResponse extends IResponse {
	data: IUpdateMembershipRangeBonusRequest;
}

export interface IUpdateMembershipBonusRequest {
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
	percentage: number | null;
	points: number;
	insertDate: number[];
	idTransaction: string;
	type: string;
	idPeriod: number;
	paidStatus: number;
	description: string;
	name: string;
	lastname: string;
	username: string;
	nameSponsor: string;
	lastNameSponsor: string;
	packageName: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface IUpdateMembershipRangeBonusRequest {
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
	percentage: number | null;
	points: number;
	insertDate: number[];
	idTransaction: string;
	type: string;
	idPeriod: number;
	paidStatus: number;
	description: string;
	name: string;
	lastname: string;
	username: string;
	nameSponsor: string;
	lastNameSponsor: string;
	range: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface IValidatePeriodResponse extends IResponse {
	data: boolean;
}

export interface IPercentCommissionAffiliationResponse {
	data: IDataCommissionAffiliation[];
	result: boolean;
}

export interface IDataCommissionAffiliation extends IResponse, ITableAbstract {
	type: number;
	levelUser: number;
	pointsHigher: number;
	pointsLess: number;
	state: number;
	compoundRange: number;
	compoundPointsDirect: number;
}

export interface ICreateMembershipBonusRequest {
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
	name: string;
	lastname: string;
	username: string;
	nameSponsor: string;
	lastNameSponsor: string;
	packageName: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface ICreateMembershipBonusRangeRequest {
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
	name: string;
	lastname: string;
	username: string;
	nameSponsor: string;
	lastNameSponsor: string;
	range: string;
	initialDatePeriod: number[];
	endDatePeriod: number[];
}

export interface ICreateMembershipBonusResponse extends IResponse {
	data: boolean;
}

export interface IPeriodRangeDatesResponse extends IResponse {
	data: IPeriodRangeDates[];
}

export interface IPeriodRangeDates extends ITableAbstract {
	initialDate: number[];
	endDate: number[];
	payDate: number[];
	status: number;
	isActive: number;
	creationDate: number[];
	creationUser: string;
	modificationDate: number;
	modificationUser: string;
}

export interface IListHistoric extends ITableAbstract {
	idBonus: number;
	idUser: number;
	nameUser: string;
	lastNameUser: string;
	userNameUser: string;
	idSlave: number;
	nameSlave: string;
	lastNameSlave: string;
	levelSponsor: number;
	tipoBono: string;
	membresia: string;
	amount: number;
	percentage: number;
	points: number;
	cycleDate: number[];
	idPeriod: number;
}
