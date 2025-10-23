import { ITableAbstract } from './shared.interface';

export interface ITablePromotionalCodeRequest extends ITableAbstract {
	membership: string;
	username: string;
	orderN: number;
	fullname: string;
	role: string;
	creationDate: string;
	name: string;
	nroDocument: string;
	email: string;
	nroPhone: string;
	sponsorFullname: string;
	status: number;
	sponsorUsername: string;
  birthDate	:string;
  lastname:string;
  customerType:number;
  suscriptionName:string;
}
