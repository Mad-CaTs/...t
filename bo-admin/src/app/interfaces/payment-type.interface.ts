export interface PaymentSubType {
    idPaymentSubType: number;
    idPaymentType: number;
    description: string;
    commissionSoles: number;
    commissionDollars: number;
    ratePercentage: number;
    statusSoles: boolean;
    statusDollar: boolean;
}
  
export interface PaymentType {
    idPaymentType: number;
    description: string;
    idResidenceCountry: number;
    pathPicture: string;
    paymentSubTypeList: PaymentSubType[];
}
  
export interface PaymentTypeResponse {
    result: boolean;
    data: PaymentType[];
    timestamp: string;
    status: number;
}

export interface PaymentOptions{
    id: string;
    text: string;
}