export interface IPaymentSearchParams {
  member?: string;
  bonusType?: string; 
  paymentDate?: string; 
  page?: number;
  size?: number;
  sortBy?: string;
  asc?: boolean;
}

export interface IApprovePaymentRequest {
  paymentId: string;
}

export interface IRejectPaymentRequest {
  reasonId: number;
  detail: string;
}

export interface IRejectPaymentResponse {
  result: boolean;
  data: IPaymentResponseDto;
  timestamp: string;
  status: number;
}

export interface IPaymentResponseDto {
  id: string;
  memberId: number;
  bonusType: string;
  paymentType: string;
  status: string;
  currencyType: string;
  subTotalAmount: number;
  commissionAmount: number;
  rateAmount: number;
  ratePercentage: number;
  totalAmount: number;
  paymentDate: string;
  createdAt: string;
}