export interface AffiliateByDateItem {
  date: string;      // "YYYY-MM-DD"
  quantity: number;
}

export interface SponsorsListDetail {
  totalDirectAffiliates: number;
  totalAffiliatesThisMonth: number;
  tendency: number;  // <-- number, no string
  affiliateByDateList: AffiliateByDateItem[]; // <-- array
}