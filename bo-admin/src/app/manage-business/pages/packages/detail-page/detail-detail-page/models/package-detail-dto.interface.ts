export interface PackageDetailDto {
	idPackage: number;
	monthsDuration: number;
	price: number;
	numberQuotas: number;
	initialPrice: number;
	quotaPrice: number;
	volume: number;
	volumeByFee: number;
	points: number;
	installmentInterval: number;
	pointsToRelease: number;
	canReleasePoints: boolean;
	numberInitialQuote: number;
	comission: number;
	numberShares: number;
	idFamilyPackage: number;
	idMembershipVersion: number;
	membershipMaintenance: number;
	serie: string | null;
	membershipVersion: any | null;
	isSpecialFractional: boolean;
	isFamilyBonus: boolean;
}
