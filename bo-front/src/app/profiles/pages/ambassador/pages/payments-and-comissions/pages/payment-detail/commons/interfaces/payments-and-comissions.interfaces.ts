export interface IPaymentDetailComissionTable {
	readonly id: number;
	readonly fullname: string;
	readonly commisionType: string;
	readonly commisionTypeId: number;
	readonly level: number;
	readonly date: string;
	readonly points: number;
	readonly percentaje: number;
	readonly amount: number;
	readonly forState?: boolean;
	readonly forLevel?: boolean;
	readonly forMembershipType?: boolean;
}

export interface IWalletTransactionTable {
	readonly id: number;
	readonly dateInitial: string;
	readonly returnedType: string;
	readonly description: string;
	readonly amount: number;
	readonly dateAvailable?: string;
}

export interface IWalletHistoryTransactionTable {
	readonly id: number;
	readonly date: string;
	readonly fullname: string;
	readonly account: string;
	readonly description: string;
	readonly amount: number;
	readonly request: string;
}

export interface IWalletHistoryTable {
	readonly id: number;
	readonly idWalletTransaction: number;
	readonly destinationCurrencyId: number;
	readonly idRequestStates: number;
	readonly closingDate: string[];
	readonly imageFile: string;
	readonly idElectronicPurse: number;
	readonly holderName: string;
	readonly holderLastName: string;
	readonly usernameAccount: string;
	readonly paidLink: string;
	readonly initialDate: string[];
	readonly referenceData: string;
	readonly amount: number;
	readonly idUser: number;
	readonly destinationCurrency: string;
	readonly abbreviationCurrency: string;
	readonly nameRequest: string;
	readonly nameUser: string;
	readonly lastNameUser: string;
	readonly email: string;
}

export interface IWalletHistoryBankTable {
	readonly id: number;
	readonly idWalletTransaction: number;
	readonly destinationCurrencyId: number;
	readonly idRequestStates: number;
	readonly closingDate: string[];
	readonly imageFile: string;
	readonly idAccountBank: number;
	readonly idTypeAccountBank: string;
	readonly holder: string;
	readonly accountNumber: string;
	readonly taxpayerNumber: string;
	readonly companyName: string;
	readonly fiscalAddress: string;
	readonly cci: string;
	readonly status: boolean;
	readonly bankAddress: string;
	readonly swift: string;
	readonly iban: string;
	readonly idBank: number;
	readonly nameBank?: string;
	readonly abbreviationBank?: string;
	readonly detailNameOtherBank?: string;
	readonly bankCountry?: string;
	readonly initialDate: string[];
	readonly referenceData: string;
	readonly amount: number;
	readonly idUser: number;
	readonly destinationCurrency: string;
	readonly abbreviationCurrency: string;
	readonly nameRequest: string;
	readonly nameUser: string;
	readonly lastNameUser: string;
	readonly email: string;
}