export interface IPaymentListViewResponse {
  result: boolean;
  data: IPaymentListViewData;
  timestamp: string;
  status: number;
}

export interface IPaymentListViewData {
  content: IPaymentListView[];
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

export interface IPaymentListView {
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