export interface IPaymentVoucher {
  idPaymentVoucher: number;
  paymentId: number;
  suscriptionId: number;
  pathPicture: string;
  operationNumber: string;
  methodPaymentSubTypeId: number;
  note: string;
  paymentCoinCurrencyId: number;
  subTotalAmount: number;
  comissionPaymentSubType: number;
  totalAmount: number;
  creationDate: [number, number, number, number, number, number, number];
  companyOperationNumber: string;
  nameMethodPaymentType: string;
  nameMethodPaymentSubType: string;
}