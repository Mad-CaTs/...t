export interface ICarBonusScheduleResponse {
  result: boolean;
  data: ICarBonusScheduleData;
  timestamp: string;
  status: number;
}

export interface ICarBonusScheduleData {
  content: ICarBonusScheduleContent[];
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

export interface ICarBonusScheduleContent {
  id: string;
  carAssignmentId: string;
  orderNum: number;
  installmentNum: number;
  isInitial: boolean;
  financingInstallment: number;
  insurance: number;
  initialInstallment: number;
  initialBonus: number;
  gps: number;
  monthlyBonus: number;
  memberAssumedPayment: number;
  total: number;
  dueDate: string;
  status: ICarBonusScheduleStatus;
  paymentDate: string;
  concepto: string;
  statusName: string;
}

export interface ICarBonusScheduleStatus {
  id: number;
  name: string;
}
