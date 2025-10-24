export interface PartnerListDetail{
  result: boolean;
  data: {
    lastPaymentDate: string;
    subscriptions: PartnerSubscription[];
  };
  timestamp: string;
  status: number;
}

export interface PartnerSubscription {
  idPackage: number;
  idPackageDetail: number;
  status: number;
  statusName: string;
  statusColor: string;
  idMembership: number;
  points: number;
  pointsByFee: number;
  pay: number;          
  namePackage: string;  
  amount: number;
  nextPaymentDate: string;
}