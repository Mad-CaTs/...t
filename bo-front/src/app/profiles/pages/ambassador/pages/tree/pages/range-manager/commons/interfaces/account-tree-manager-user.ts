export interface IAccountTreeManagerUser {
  idUser: number;
  fullName: string;
  userName: string;
  idState: number;
  createDate: number[];
  sponsorLevel: number;
  residualLevel: number;
  branch: number;
  sponsorName: string;
  suscriptions: Suscription[];
  color: string;
  stateName: string;
}

export interface Suscription {
  idSuscription: number;
  nameSuscription: string;
  creationDate: number[];
}