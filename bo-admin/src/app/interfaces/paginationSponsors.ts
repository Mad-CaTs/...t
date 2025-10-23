export class IPaginationSponsors{
    idUser: number;
    sponsorName: string = '';
    partnerSearch: string = '';
    rangeId: number;
    idState: number = -1;
    branch: string | number;
    starDate: Date | string | null;
    endDate: Date | string | null;
    //ciclos: number | string;
}

export interface SponsorsAdvanceResponseRaw{
    result: boolean;
    total: number;
    data: any[];
    size: number;
    page: number;
}

export interface SponsorsListRow{
    idUser: number;
    fullName: string;
    userName: string;
    nroDocumento: string;
    idState: number;
    stateName: string;
    colorRGB: string;
    createDate: Date | null;
    sponsorLevel: number;
    sponsorName: string;
    rangeId: number;
    rangeName: string;
    directPartnersCount: number;
    directSponsorshipScore: number;
}