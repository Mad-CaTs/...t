export enum BonusType {
  CAR = 1,
  TRAVEL = 2,
  PROPERTY = 3
}

export enum PaymentType {
  BCP = 1,
  INTERBANK = 2,
  PAYPAL = 3,
  WALLET = 4,
  OTHERS = 5
}

export enum PaymentStatus {
  COMPLETED = 1,
  PENDING = 2,
  FAILED = 3,
  PENDING_REVIEW = 4,
  REJECTED = 5
}

export enum CurrencyType {
  PEN = 1,
  USD = 2
}

export interface PaymentListView {
  paymentId: string;
  username: string;
  memberFullName: string;
  nrodocument: string;
  operationNumber: string;
  bonusTypeId: number;
  bonusTypeName: string;
  installmentNum: number;
  subTotalAmount: number;
  commissionAmount: number;
  rateAmount: number;
  totalAmount: number;
  dueDate: string;
  paymentDate: string;
  voucherImageUrl: string;
  paymentStatusId: number;
  paymentStatusName: string;
}
export interface PaymentSearchParams {
  member?: string;
  bonusType?: BonusType;
  paymentDate?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  asc?: boolean;
}
export interface PagedData<T> {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  sortBy: string;
  sortDirection: string;
}
export interface RejectPaymentRequest {
  reasonId: number;
  detail: string;
}
export interface PaymentDetailItem {
  label: string;
  value: string | number;
  copy?: boolean;
  hint?: string;
  badge?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
}