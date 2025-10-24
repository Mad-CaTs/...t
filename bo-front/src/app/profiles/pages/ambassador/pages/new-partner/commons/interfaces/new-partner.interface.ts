import { CurrencyType } from 'src/app/profiles/commons/enums';

export interface IPaypalData {
	typeCurrency: CurrencyType;
	paymentSubTypeId: number;
	operationNumber: string;
}

export interface Nationality {
	value: number;
	icon: string;
	phonecode: string;
}

export interface INewUserPromotorData {
	id: number;
	name: string;
}
export interface ITemporaryToken{
	id: number;
	userId: number;
	contactId: number; 
	createdAt: string;
	expiredAt: string;
	updatedAt: string;	
	securityToken: string;
	userType: number;
}
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
	readonly idLocation?: number;
}

export interface ValidationMultiCodeResponse {
	isParent: boolean;
	canCreate: boolean;
	message: string;
}
