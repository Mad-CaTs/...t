export interface AffiliateByDateItem {
  date: string;      
  quantity: number;
}

export interface SponsorsListDetail {
  totalDirectAffiliates: number;
  totalAffiliatesThisMonth: number;
  tendency: number;
  affiliateByDateList: AffiliateByDateItem[];
}