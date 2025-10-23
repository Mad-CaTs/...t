export interface Car {
  id: string; // UUID
  memberId?: number | null;
  brandId: number;
  modelId: number;
  color: string;
  imageUrl?: string | null;
  price: number;
  interestRate: number;
  companyInitial: number;
  memberInitial: number;
  initialInstallmentsCount: number;
  monthlyInstallmentsCount: number;
  paymentStartDate: string; // YYYY-MM-DD
  statusId: number;
  assignedDate?: string | null;
}
