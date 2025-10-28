export interface Quotation {
	id: string;
	classificationId: string;
	memberId: number;
	username: string;
	memberName: string;
	brand: string;
	model: string;
	color: string;
	price: number;
	dealership: string;
	executiveCountryId: number;
	salesExecutive: string;
	prefixPhone: string;
	salesExecutivePhone: string;
	quotationUrl: string;
	initialInstallments: number;
	eventId: number;
	eventName: string;
	isAccepted: boolean;
	acceptedAt: string | null;
}

export interface QuotationRequest {
	classificationId: string;
	brandName: string;
	modelName: string;
	color: string;
	price: string;
	dealershipName: string;
	executiveCountryId: string;
	salesExecutiveName: string;
	salesExecutivePhone: string;
	quotationFile: File;
	eventId: string;
	initialInstallments: string;
}