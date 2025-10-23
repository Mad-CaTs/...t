export interface PackageResponse {
    idPackage: number;
    name: string;
    codeMembership: string;
    description: string;
    idFamilyPackage: number;
    status: number;
}

export interface PackageDetailResponse {
    idPackageDetail: number;
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
    isFamilyBonus: boolean;
    specialFractional: boolean;
    isSpecialFractional: boolean;
}

export interface PortfolioResponse {
    id: number;
    idUser: number;
    pack: PackageResponse;
    packageDetailResponse: PackageDetailResponse;
    status: number;
    creationDate: number[];
    descriptionPendingFee: string;
    datePendingFee: number[];
    pendingFee: number;
    lastDatePaidFee: number[];
}