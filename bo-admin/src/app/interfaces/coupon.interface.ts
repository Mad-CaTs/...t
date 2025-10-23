export interface CouponRequest {
  name: string;
  percent: string; 
  salaryMin: number;
  salaryMax: number;
  companyId: number;
  companyname?: string; 
  startDate: string;
  endDate: string;
  state: boolean;
}
