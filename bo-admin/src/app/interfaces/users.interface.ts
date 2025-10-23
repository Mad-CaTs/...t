import type { ITableAbstract } from './shared.interface';

export interface IRequestFixDataService {
	readonly idUser: number;
	readonly name: string;
	readonly lastName: string;
	readonly birthdate: string;
	readonly gender: string; 
	readonly idNationality: number;
	readonly email: string;
	readonly nroDocument: string;
	readonly districtAddress: string;
	readonly address: string;
	readonly userName: string;
	readonly password: string | null;
	readonly idResidenceCountry: number;
	readonly civilState: string; 
	readonly boolDelete: number;
	readonly nroPhone: string;
	readonly idDocument: number;
	readonly idState: number;
	readonly createDate: string; 
	readonly profilePicture: string | null;
	readonly code: string | null;
	readonly paisResidencia?: string;
	readonly estadoDepartamento?: string;
	readonly provincia?: string;
	readonly distrito?: string;
	readonly id_location?: number;
}

export interface IRequestSearchUser {
	readonly idUser: number;
	readonly username: string;
	readonly creationDate: [number, number, number, number, number];
	readonly documentNumber: string;
	readonly name: string;
	readonly gender: string;
	readonly lastName: string;
	readonly email: string;
	readonly cellPhone: string;
	readonly state: number;
	readonly idTypeDocument: number;
	readonly docType?: string;
	readonly address: string;
	readonly districtAddress: string;
	readonly idResidenceCountry: number;
	readonly country: string;
}

export interface IRequestFixData {
	readonly id: string;
	readonly username: string;
	readonly fullname: string;
	readonly lastname: string;
	readonly nationality: string;
	readonly docType: string;
	readonly docNumber: string;
	readonly bornDate: string;
	readonly gender: string;
	readonly civilState: string;
	readonly email: string;
	readonly country: string;
	readonly district: string;
	readonly address: string;
	readonly phone: string;
}

export interface IEmailingTableData {
	readonly id: number;
	readonly username: string;
	readonly fullname: string;
	readonly email: string;
	readonly subscription: string;
	readonly date: string;
	readonly subscriptionsQuantity: number;
	readonly sponsorName: string;
	readonly sponsorFullName: string;
	readonly sponsorEmail: string;
	readonly masterFullName: string;
	readonly masterEmail: string;
	readonly masterName: string;
}

export interface IRequestFixDataForm {
	fullname: string;
	lastname: string;
	gender: string;
	nationality: string;
	civilState: string;
	email: string;
	phone: string;
	bornDate: string;
	docType: string;
	docNumber: string;
	country: string;
	state: string;
	address: string;
}

export interface ITableNewRanges extends ITableAbstract {
  isChecked?: boolean;
	readonly orderN: number;
	readonly isActive: number;
	readonly initialDate: string;
	readonly endDate: string;
	readonly payDate: string;
	readonly username: string;
	readonly fullname: string;
	readonly dni: string;
	readonly partnerUsername: string;
	readonly partnerFullname: string;
	readonly range: string;
	readonly status: string;
	readonly notifyAvailable: boolean;
}

export interface ITableReportNewRanges extends ITableAbstract {
	isChecked?: boolean;
	  readonly name	: string;
	  readonly lastName: string;
	  readonly isActive: number;
	  readonly phoneNumber:string;
	  readonly rangeName:string;

	  	

	
  }

export interface ITableUsers extends ITableAbstract {
	readonly userName: string;
	readonly rol: string;
	readonly name: string;
	readonly lastName:string;
	readonly idUserAdmin:number,
	readonly nroTelf : string,
	readonly email :string
}

export interface ICountry {
	idCountry: number;
	iso: string;
	countrydesc: string;
	nicename: string;
	iso3: string;
	numcode: number;
	phonecode: number;
	symbol: string;
	courtesy: string;
	icon: string;
}

export interface ICivilStatus {
	idCivilStatus: number;
	description: string;
}

export interface IDocumentType {
	idDocumentType: number;
	name: string;
	origin: string | null;
	idCountry: number;
}
