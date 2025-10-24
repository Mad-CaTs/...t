export interface IWallet {
	readonly idWallet: number;
	readonly idSocio: number;
	readonly idCurrency: number;
	readonly availableBalance: number;
	readonly accountingBalance: number;
	readonly availableBrandExclusive: number;
	readonly accountingBrandExclusive: number;
}

export class IUserRequest {
	username: string;
	password: string;
}

export interface IWalletList {
	readonly idWallet: number;
	readonly idWalletTransaction: number;
	readonly idCurrency: number;
	readonly idTypeWalletTransaction: number;
	readonly idExchangeRate: number;
	readonly initialDate: string[];
	readonly amount: number;
	readonly isAvailable: boolean;
	readonly availabilityDate: string[];
	readonly referenceData: string;
	readonly isSucessfulTransaction: boolean;
	readonly idTransactionCategory: number;
	readonly description: string;
}

export interface IWalletValidateUsernameAndAmount {
	readonly idUser: number;
	readonly transactionAmount: number;
}

export interface IElectronicPurse {
	readonly idElectronicPurse: number;
	readonly idUser: number;
	readonly idElectronicPurseCompany: number;
	readonly holdeName: string;
	readonly holderLastName: string;
	readonly userNameAccount: string;
	readonly paidlink: string;
}

export interface IWalletValidatePassword {
	readonly username: string;
	readonly password: string;
}

export interface IWalletGenerateToken {
	readonly idUser: number;
	readonly transactionAmount: number;
	readonly idUserReceivingTransfer: number;
}

export interface IWalletRegisterTransferWallet {
	readonly idUser: number;
	readonly idUserReceivingTransfer: number;
	readonly walletTransaction: {
		readonly initialDate: string;
		readonly amount: number;
	};
	readonly tokenRequest: {
		readonly idUser: number;
		readonly codeToken: string;
	};
}

export interface IAccountBank {
	readonly idAccountBank: number;
	readonly idTypeAccountBank: number;
	readonly idBank: number;
	readonly idUser: number;
	readonly holder: string;
	readonly accountNumber: string;
	readonly taxpayerNumber: string;
	readonly companyName: string;
	readonly fiscalAddres: string;
	readonly cci: string;
	readonly status: boolean;
	readonly bankAddress: string;
	readonly swift: string;
	readonly iban: string;
}
