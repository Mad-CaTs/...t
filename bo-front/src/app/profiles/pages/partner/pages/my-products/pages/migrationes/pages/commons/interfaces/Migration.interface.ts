export interface IPackageDetail {
  idPackageDetail: number;
  idPackage: number;
  initialPrice: number;
  price: number;
  monthsDuration: number;
  numberInitialQuote: number;
  numberQuotas: number;
  quotaPrice: number;
  volume: number;
  comission: number;
  idFamilyPackage?: number; 
  idMembershipVersion?: number; 
  isFamilyBonus: boolean;
  isSpecialFractional: boolean;
  membershipMaintenance: number;
  membershipVersion?: number | null; 
  numberShares: number;
  specialFractional: boolean;
  packageDetailId: number;
}

export interface IPackage {
  idPackage: number;
  name: string;
  codeMembership: string; 
  description: string;
  price: number;
  numberQuotas: number;
  quotaPrice: number;
  status?: number; 
  packageDetail: IPackageDetail[];
}

export interface IAvailablePackages {
  package: number;
  idFamilyPackage: number;
  name: string;
  description: string;
  packageList: IPackage[];
  packageDetail: IPackageDetail[];
}

export interface IQuotesOptions {
  content: string;
  value: number;
}
 export interface Voucher {
  idMethodPaymentSubType: number;
  operationNumber: string;
  comisionDolares: number; 
  totalAmount: number; 
}

export interface IModalAlertData {
  message: string;
  title?: string;  
  icon?: string;   
  type?: 'success' | 'warning' | 'info' | 'error';
}

export interface ISelectedMembershipIds {
	idSus: number;
	idPackageDetail: number;
	idPackage: number;
}

