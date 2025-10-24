export interface INextPayment {
  idPayment: number;
  idSuscription: number;
  quoteDescription: string;
  nextExpirationDate: string;   // ISO date string
  dollarExchange: number;
  quoteUsd: number;
  percentage: number;
  idStatePayment: number;
  obs: string;
  payDate: string | null;       // puede ser fecha o null
  pts: number;
  isInitialQuote: number;       // si quieres lo puedes cambiar a boolean
  positionOnSchedule: number;
  numberQuotePay: number;
  amortizationUsd: number;
  capitalBalanceUsd: number;
  totalOverdue: number;
  idPercentOverduedetail: number;
}