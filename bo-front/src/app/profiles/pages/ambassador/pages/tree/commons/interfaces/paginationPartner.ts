export class IPaginationPartner{
    idUser: number = 0;
    sponsorName: string = '';
    partnerSearch: string = '';
    rangeId: number;
    idState: number = -1;
    branch: string | number;
    username: string = '';

}

export interface PartnersAdvancedResponseRaw {
  result: boolean;
  total: number;
  data: any[];
  size: number;
  page: number;
}

export interface PartnerListRow {
  idUser: number;
  fullName: string;
  userName: string;
  idState: number;
  stateName: string;
  createDate?: Date | null;
  sponsorLevel?: number;
  residualLevel?: number;
  branch?: number;
  branchName?: string;
  rangeId?: number;
  rangeName?: string;
  sponsorName?: string;
  suscriptions?: any[];
}