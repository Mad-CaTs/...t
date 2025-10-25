export interface IMakePaymentRequest {
  scheduleId: string;
  memberId: number;
  bonusType: 'CAR' | 'TRAVEL' | 'PROPERTY';
  paymentType: 'BCP' | 'INTERBANK' | 'OTHERS' | 'PAYPAL' | 'WALLET';
  paymentSubTypeId: number;
  currencyType: 'PEN' | 'USD';
  totalAmount: number;
  voucher?: {
    operationNumber: string;
    note: string;
    image: File;
  };
}