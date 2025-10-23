export class RentExemptionUserSearchRequest {
    username: string;
    familyPackage: number;
    packageDetail: number;
    typeUser: number;
    status: number[] = [];
    page: number;
    size: number;
}