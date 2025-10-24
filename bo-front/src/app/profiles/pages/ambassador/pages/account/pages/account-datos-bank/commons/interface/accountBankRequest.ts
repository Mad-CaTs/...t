export interface AccountBankRequest {
    bank: BankRequest;
    accountData: AccountDataRequest;
    ownerData: OwnerDataRequest;
}
export interface BankRequest {
    idBank: number;
    idCountry: number;
    bankAddress: string;
    codeSwift: string;
    codeIban: string;
}
export interface AccountDataRequest {
    numberAccount: string;
    cci: string;
    idTypeAccountBank: number;
}
export interface OwnerDataRequest {
    nameTitular: string;
    apellidoTitular: string;
    numberContribuyente: string;
    razonSocial: string;
    addressFiscal: string;
    email: string;
    idDocumentType: number;
    numDocument: string;
    titular: boolean;
    idUser: number;
}