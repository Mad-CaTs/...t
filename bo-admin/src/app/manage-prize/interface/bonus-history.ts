export interface ICarBonusResponse {
  result: boolean;
  data: ICarBonusData;
  timestamp: string;
  status: number;
}

export interface ICarBonusData {
  content: ICarBonusItem[];
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

export interface ICarBonusItem {
  id: string;
  monthlyAssignedBonus: number;
  monthlyBonus: number;
  initialBonus: number;
  bonusPrice: number;
  issueDate: string;
  expirationDate: string;
  status: IStatus;
  rank: IRank;
}

export interface IStatus {
  id: number;
  name: string;
}

export interface IRank {
  id: number;
  name: string;
}


