export interface UserSearchRequest {
  username: string;
  typeUser: number;
  documentNumber?: string;
}

export interface User {
  idUser: number;
  username: string;
  creationDate: number[];
  documentNumber: string;
  name: string;
  lastName: string;
  gender: string;
  email: string;
  cellPhone: string;
  documentName: string;
  state: number;
  sponsorName: string;
  sponsorLastName: string;
  sponsorEmail: string;
  nationality?: string;
  documentType?: string;
  district?: string;
  country?: string;
} 