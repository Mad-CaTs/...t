export interface ICarBonusScheduleExtraResponse {
  result: boolean;
  data: ICarBonusScheduleExtraData;
  timestamp: string;
  status: number;
}

export interface ICarBonusScheduleExtraData {
  memberId: number;
  username: string;
  memberFullName: string;
  memberRankId: number;
  memberRankName: string;
  eventId: number;
  eventName: string;
  carBrand: string;
  carModel: string;
  coveredInitialUsd: number;
  carPriceUsd: number;
  monthlyBonusUsd: number;
  totalInitialInstallments: number;
  paidInitialInstallments: number;
  totalPaidInitialUsd: number;
  totalMonthlyInstallments: number;
  paidMonthlyInstallments: number;
  totalPaidMonthlyUsd: number;
  remainingInitialInstallments: number;
  remainingInitialInstallmentsUsd: number;
  remainingMonthlyInstallments: number;
  remainingMonthlyInstallmentsUsd: number;
  totalInitialInstallmentsUsd: number;
  totalMonthlyInstallmentsUsd: number;
  initialPaymentDate: number[];
  lastPaymentDate: number[];
  interestRate: number;
}
