export interface ICarAssignmentResponse {
  result: boolean;
  data: ICarAssignmentData;
  timestamp: string;
  status: number;
}

export interface ICarAssignmentData {
  content: ICarAssignment[];
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

export interface ICarAssignment {
  carAssignmentId: string;
  memberId: number;
  memberFullName: string;
  username: string;
  brandName: string;
  modelName: string;
  priceUsd: number;
  totalInitialInstallments: number;
  paidInitialInstallments: number;
  totalMonthlyInstallments: number;
  paidMonthlyInstallments: number;
  assignedMonthlyBonusUsd: number;
  monthlyInstallmentUsd: string | number;
  currentRankName: string;
  assignedDate: string;
}