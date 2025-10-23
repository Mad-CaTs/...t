import { ITableAbstract } from './shared.interface';

export interface ITableCreatePrize extends ITableAbstract {
	readonly range: Range;
	readonly startDate: string;
	readonly endDate: string;
	readonly destiny: string;
	readonly bonusValue: number;
	readonly link: string;
	readonly flyer: string;
	readonly status: string;
}

export interface ITableBonusCourse extends ITableAbstract {
	readonly fullname: string;
	readonly startDate: string;
	readonly limitDate: string;
	readonly range: Range;
	readonly qualificationCycles: number;
	readonly reclassification: number;
	readonly description: string;
	readonly score: number;
	readonly used: boolean;
}

export interface ITableBonusCar extends ITableAbstract {
	readonly fullname: string;
	readonly startDate: string;
	readonly limitDate: string;
	readonly range: Range;
	readonly qualificationCycles: number;
	readonly reclassification: number;
	readonly used: boolean;
}

export interface IBonusAssignment {
  readonly id: number;
  readonly range: string;
  readonly assignedBonus: number;
  readonly bonusPrice: number;
}

export interface ICompany{
  readonly key: number;
  readonly text: string;
}

export interface IBonusAssignmentDto {
  readonly range: string;
  readonly assignedBonus: number;
  readonly bonusPrice: number;
}


export interface ITableBonusEstate extends ITableAbstract {
	readonly fullname: string;
	readonly startDate: string;
	readonly limitDate: string;
	readonly range: Range;
	readonly qualificationCycles: number;
	readonly reclassification: number;
	readonly description: string;
	readonly proforma: ProformaEstate[];
	readonly score: number;
	readonly used: boolean;
}

export interface Range {
	readonly idRange: string;
	readonly name: string;
}

export interface ProformaCar {
	readonly idProforma: string;
	readonly brand: string;
	readonly model: string;
	readonly color: string;
	readonly price: number;
	readonly company: string;
	readonly salesExecutive: string;
	readonly phoneNumber: string;
	readonly archive: string;
}

export interface ProformaEstate {
	readonly idProforma: string;
	readonly province: string;
	readonly department: string;
	readonly typeEstate: string;
	readonly price: number;
	readonly company: string;
	readonly salesExecutive: string;
	readonly phoneNumber: string;
	readonly archive: string;
}

export interface ITableAttendanceControl extends ITableAbstract {
	readonly statusAttendance: string;
	readonly guestWhom: string;
	readonly fullname: string;
	readonly bonusType: string;
	readonly prizeDescription: string;
	readonly status: string;
}

export interface CouponEntity {
  idcoupon: number;
  name: string;
  percent: number;
  salaryMin: number;
  salaryMax: number | null;
  companyId: number;
  state: boolean;
}
