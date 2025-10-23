export interface IPartnersRegisteredTable {
	readonly id: string;
	readonly username: string;
	readonly fullname: string;
	readonly lastname: string;
	readonly startDate: string;
	readonly email: string;
	readonly phone: string;
	readonly docNumber: string;
	readonly docType: string;
	readonly partner: string;
	readonly status: string;
	readonly subscriptionQuantity: number;
	readonly gender: string;
}

export interface IPartnersWalletTable {
	readonly id: number;
	readonly username: string;
	readonly fullname: string;
	readonly docType: string;
	readonly docNumber: string;
	readonly countableBalance: number;
	readonly availableBalance: number;
}

export interface IPartnersHistoryWalletTable {
	originUser: string;
	destinyUser?: string;
	amount: number;
	date: string;
}

export interface IPartnersRegisteredSearchForm {
	search: string;
	as: string;
	status: string;
	familyPackage: string;
	package: string;
}

export interface Register {
	idPayment: number | null;
	idSuscription: number;
	quoteDescription: string;
	nextExpiration: string;
	dollarExchange: number;
	quoteUsd: number;
	percentage: number;
	statePaymentId: number;
	obs: string;
	payDate: string;
	pts: number;
	isQuoteInitial: number;
	positionOnSchedule: number;
	numberQuotePay: number;
	amortization: number;
	capitalBalance: number;
	totalOverdue: string | null;
	// interested: number; // Comentado ya que no está en el response
	// verif: number; // Comentado ya que no está en el response
	paymentVouchers: PaymentVoucher[];
  }

  export interface PaymentVoucher {
	idPaymentVoucher: number;
	paymentId: number;
	suscriptionId: number;
	pathPicture: string;
	operationNumber: string;
	methodPaymentSubTypeId: number;
	note: string;
	paymentCoinCurrencyId?: number;
	subTotalAmount?: number;
	comissionPaymentSubType?: number;
	totalAmount?: number;
	creationDate?: string;
	companyOperationNumber?: string;
	nameMethodPaymentType: string;
	nameMethodPaymentSubType: string;
	namePicture: string;
  }

  export interface EditableFields {
	editCascade: boolean;
	editCasExchange: boolean;
	editCasQuoteUsd: boolean;
	editCasNextExp: boolean;
	calculateCheck: boolean;
  }