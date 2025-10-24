export interface IPaymentLater {
	readonly description: string;
	readonly quotas: number;
	readonly duration: number;
    readonly price: number;
    readonly initialPrice: number;
}

export interface PackageDetail {
    readonly idPackageDetail: number;
    readonly idPackage: number;
    readonly monthsDuration: number;
    readonly price: number;
    readonly numberQuotas: number;
    readonly initialPrice: number;
    readonly quotaPrice: number;
    readonly volume: number;
    readonly numberInitialQuote: number;
    readonly comission: number;
    readonly numberShares: number;
    readonly idFamilyPackage: number;
    readonly idMembershipVersion: number;
    readonly membershipMaintenance: number;
    readonly membershipVersion: string | null;
    readonly isSpecialFractional: boolean;
    readonly isFamilyBonus: boolean;
}
