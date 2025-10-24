export interface IAuthentication {
/* 	accessToken: string;
 */	accessTokenExpireAt: string;
	authorities: Array<string>;
	refreshToken: string;
	userInfo: IUserInfo;
	access_token:string;
	roles: Array<string>;
	username:string;
}

export interface IUserInfo {
	email: string;
	id: number;
	username: string;
}

export interface UserResponse {
  id: number;
  name: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  idNationality: number;
  documentNumber: string;
  email: string;
  districtAddress: string;
  address: string;
  username: string;
  telephone: string;
  civilState: string;
  idResidenceCountry: number;
  idState: number;
  idTypeDocument: number;
  createDate: Date;
}

export interface SingleResponse<T> {
  result: boolean;
  data: T;
  timestamp: string;
  status: number;
}

export interface ListResponse<T> {
  result: boolean;
  data: T[];
  timestamp: string;
  status: number;
}
