export interface INewPartnerStepsData {
	step1?: INewPartnerStep1Data;
	step2?: INewPartnerStep2Data;
	step3?: INewPartnerStep3Data;
	step4?: INewPartnerStep4Data;
}

export interface INewPartnerStep1Data {
	names: string;
	lastnames: string;
	nationality: number;
	docType: number;
	docNumber: string;
	bornDate: string;
	civilState: number;
	gender: number;
	coRequester: {
		names: string;
		lastnames: string;
		docType: number;
		docNumber: string;
		bornDate: string;
	} | null;
}

export interface INewPartnerStep2Data {
	email: string;
	address: string;
	country: number;
	city: string;
	province: string;
	phone: string;
}

export interface INewPartnerStep3Data {
	code: string;
	packageId: number;
}

export interface INewPartnerStep4Data {
	paymentId: number;
	uploadPaymentAfter: boolean;
	email: string;
}
