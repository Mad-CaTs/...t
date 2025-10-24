

export interface IWalletTransaction {
    id: number;
    userId: number;
    amount: number;
    transactionDate: Date;
    description: string;
    status: string;
    code: string;
}

export interface IPaypalTransaction {
    userId: number;
}


export interface IPaymentType {
    description: string;
    idPaymentMethod: number;
    idPaymentType: number;
    idResidenceCountry: number;
    pathPicture: string;
    paymentSubTypeList: any[];
    subTotalMount: number;
    comision: number;
    total: number;
    isInvalid: boolean;
}

export interface IUser {
  id: number;
  name: string;
  lastName: string;
  headerName: string;
  nameCode: string;
  username: string;
  email: string;
  telephone: string;
  documentNumber: string;
  idTypeDocument: number;
  birthDate: [number, number, number]; // [año, mes, día]
  gender: string;
  civilState: string;
  idNationality: number;
  idResidenceCountry: number;
  address: string;
  districtAddress: string;
  idState: number;
  createDate: [number, number, number]; // [año, mes, día]
}
export interface IPaypalResponse{
    totalMount: number; 
    operationMount: number;
    operationNumber: string
    operationTasa: number,
    operationComision: number,
    operationSubTotal: number
}


