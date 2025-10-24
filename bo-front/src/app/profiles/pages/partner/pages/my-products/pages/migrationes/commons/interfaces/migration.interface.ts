export interface IMigrationDetail {
  idSuscription: number;
  idPackageNew: number;
  idPackageDetailNew: number;
  initialPrice: number;
  totalPrice: number;
  amountPaid: number;
  amountToPay: number;
  durationMonths: number;
  numberQuotas: number;
  quotaPrice: number;
  quotasPaid: string;
  membershipPackageToMigrate: string;
  observation: string;
  creationDate: string; 
  migrateDate: string; 
  idOption:number;
}

export interface IMigrationOption {
  id: number;
  name: string;
  description: string;
  price: number;
}

export interface ISimulationData {
  idSuscription: number;
  quoteDescription: string;
  nextExpirationDate: string;
  amortizationUsd: number;
  capitalBalanceUsd: number;
  dollarExchange: number;
  idPayment: number | null;
  idPercentOverduedetail: number | null;
  idStatePayment: number;
  isInitialQuote: number;
  numberQuotePay: number;
  obs: string;
  payDate: string;
  percentage: number;
  positionOnSchedule: number;
  pts: number;
  quoteUsd: number;
  statusName: string;
  totalOverdue: number | null;
}


