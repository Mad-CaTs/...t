export interface PaymentsValidate{
    id: number;
    paymentDate: string;
    eventName: string;
    zone: string;
    ticketQuantity: number;
    userName: string;
    totalAmount: number;
    imageUrl: string;
    paymentMethod: string;
    userDocument?: string;
    userEmail?: string;
    userPhone?: string;
    sponsorName: string;
    ticketTypeName: string;
    promotionalCode: string;
    paymentStatus: string;
    voucherOperationNumber: string;
    userType: string;
}

export interface PaymentPage {
  payments: PaymentsValidate[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ApiResponse<T> {
  result: boolean;
  data: T;
  timestamp: string;
  status: number;
}