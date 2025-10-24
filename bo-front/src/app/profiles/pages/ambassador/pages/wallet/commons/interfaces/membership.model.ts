export interface Membership {
  id: number;
  nameSuscription: string;
  idPackage?: number;
  idPackageDetail?: number;
  status?: 'Activo' | 'Inactivo';
  acquisitionDate?: string;
  volumen?: number;
  installments?: number;
  selected?: boolean;
  idUser?: string
}

export interface TransactionData {
  frequency: string;
  nextPayment: string;
  amount: string;
  paymentMethod: string;
  amortizationUsd: number;
  nextExpirationDate: string;
  capitalBalanceUsd: number;
  daysOverdue: number;
  dollarExchange: number;
  idPackage: number;
  idPayment: number;
  idPercentOverduedetail: number;
  idStatePayment: number;
  idSuscription: number;
  isInitialQuote: number;
  nameSuscription: string;
  numberQuotePay: number;
  obs: string;
  payDate: string;
  payed: boolean;
  percentage: number;
  positionOnSchedule: number;
  pts: number;
  quoteDescription: string;
  quoteUsd: number;
  statusName: string;
  total: number;
  totalOverdue: number;
}

export interface Affiliate {
  iduser: string;
  idsuscription: string;
}

export interface MembershipAffiliate {
  idSuscription: number;
  namePackage: string;
  numberQuotas: number;
  amount: number;
  dateAffiliate: string;
  paymentMethod: string;
  status: boolean;
  isSelected?: boolean;
  idreason: number | null;
}

export interface MembershipInfo {
  namePackage: string;
  status: string;
  endDate: string;
  idSuscription: number | string;
  idAffiliatePay: number | string;
  amount: number;

}

export interface CancellationReason {
  id:number;
  value: string;
  label: string;
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