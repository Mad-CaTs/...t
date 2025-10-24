import { IPaymentVoucher } from "./payment-voucher";

export interface IPayment {
  idPayment: number;
  idSuscription: number;
  quoteDescription: string;
  nextExpiration: [number, number, number, number, number, number, number];
  dollarExchange: number;
  quotaUsd: number;
  percentage: number;
  statePaymentId: number;
  obs: string;
  payDate: [number, number, number, number, number, number, number];
  pts: number;
  isQuoteInitial: number;
  positionOnSchedule: number;
  numberQuotePay: number;
  amortizationUsd: number;
  capitalBalanceUsd: number;
  totalOverdue: number | null;
  percentOverdueDetailId: number;
  paymentVouchers: IPaymentVoucher[];
  flagColor:boolean;
}
