import type { ITableAbstract } from './shared.interface';

export interface ITableEventList extends ITableAbstract {
	readonly subtypeEvent: string;
	readonly presenter: string;
	readonly startDate: string;
	readonly endDate: string;
	readonly flyerUrl: string;
	readonly meetUrl: string;
	readonly inputType: string;
	readonly status: boolean;
}

export interface ITableEventPayment extends ITableAbstract {
	readonly description: string;
	readonly type: string;
	readonly numberInput: number;
	readonly package: string;
	readonly username: string;
	readonly partner: string;
	readonly amount: number;
	readonly promotionalCode: string;
	readonly paymentDate: string;
	readonly payStatus: string;
	readonly voucherUrl: string;
}

export interface ITableNews extends ITableAbstract {
	readonly title: string;
	readonly description: string;
	readonly date: string;
	readonly status: string;
}

export interface ITableEventTypes extends ITableAbstract {
	readonly idType: string;
	readonly description: string;
	readonly status: number;
}

export interface ITableEventSubtypes extends ITableAbstract {
	readonly nameSubtype: string;
	readonly nameEventType: string;
	readonly nameLanding: string;
	readonly urlLanding: string;
	readonly gender: string;
	readonly range: Range[];
}

export interface Range {
	readonly idRange: string;
	readonly name: string;
}

export interface ITableLanding extends ITableAbstract {
	readonly nameLanding: string;
	readonly landingUrl: string;
	readonly landingImage: string;
}

export interface ITableLink extends ITableAbstract {
	readonly link: string;
	readonly status: number;
}

export interface ITablePartnerList extends ITableAbstract {
	readonly dateRegister: string;
	readonly eventSubtype: string;
	readonly fullname: string;
	readonly ipDetected: string;
	readonly email: string;
	readonly countryDetected: string;
	readonly cityDetected: string;
	readonly typeSelected: string;
	readonly subtypeSelected: string;
	readonly username: string;
	readonly sponsor: string;
}
export interface ITableTravel extends ITableAbstract {
	readonly destiny: string;
	readonly date: string;
	readonly status: string;
	readonly flyer: string;
}
