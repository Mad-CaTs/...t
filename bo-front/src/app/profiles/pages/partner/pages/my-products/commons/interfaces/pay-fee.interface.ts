export interface QuoteDetail {
	isInitialQuote: number;
	total: number;
}

export interface DataSchedules {
	statusName: string;
	/*   idPayment(idPayment: any): unknown; */
	idPayment: number;
	total: number;
	membershipType: any;
	nextExpiration: string | number | Date;
	id: number;
	description: string;
	expiration_date: string;
	capital: number;
	amortization: number;
	interest: number;
	mora: number;
	payed: boolean;
	nameSuscription: string;
	quoteDescription?: string;
}

export class GracePeriod {
	daysUsed: number;
	status: number;
	suscriptionId: number;
	gracePeriodTypeId: number;
	flagSchedule: number;
	userId: number;
}

export interface RejectedPaymentResponse {
	rejectionId: number;
	paymentId: number;
	rejectionReason: string;
	rejectionDetail: string;
	rejectionDate: string;
}

export interface Product {
		id: number,
		idFamilyPackage: number,
		familyPackageName: string,
		nameSuscription: string,
		volumen: number,
		volumenByFee: number,
		idUser: number,
		volumenRibera: number;
		creationDate: string,
		status: string,
		idStatus: number,
		modificationDate: string,
		idPackageDetail: number,
		idPackage: number,
		numberQuotas: number,
		idGracePeriodParameter: number
}
