
export interface IPaymentDetail {
  id: number;
  initialDate: string; 
  endDate: string; 
  payDate: string;
  status: number; 
  isActive: number;
  creationDate: string | null; 
  creationUser: string | null; 
  modificationDate: string | null; 
  modificationUser: string | null; 
  amountAwardRank: number; 
  amountBonus: number; 
  amountDirectRecommendation: number; 
  amountExclusiveBrands: number;
  amountExtraMemberships: number; 
  amountMigrations: number; 
  amountQuotes: number; 
  amountTeamRecommendation: number; 
  amountTotal: number;
  amountRegularization: number;
}
export interface IAllData {
  directRecommendationBonusList: IPaymentDetailComissionTable[];
  teamRecommendationBonusList: IPaymentDetailComissionTable[];
  quotesBonusList: IPaymentDetailComissionTable[];
  secondMembershipBonusList: IPaymentDetailComissionTable[];
  extraMembershipBonusList: IPaymentDetailComissionTable[];
  migrationsBonusList: IPaymentDetailComissionTable[];
  awardRankBonusList: IPaymentDetailComissionTable[];
  exclusiveBrandsBonusList: IPaymentDetailComissionTable[];
  founderBonusList: IPaymentDetailComissionTable[];
  regularizationBonusList: IPaymentDetailComissionTable[];
}

export interface IPaymentDetailComissionTable {
  id: number; 
  fullname: string; 
  commisionType: string; 
  commisionTypeId: number; 
  level: number; 
  date: string; 
  points: number; 
  percentaje: number; 
  amount: number; 
  forState?: boolean; 
  forLevel?: boolean; 
  forMembershipType?: boolean; 
}

