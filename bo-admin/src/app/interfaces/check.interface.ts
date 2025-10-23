import { ITableAbstract } from './shared.interface';

export interface ITableCheck extends ITableAbstract {
	// readonly username: string;
	readonly name: string;
	readonly lastname: string;
	readonly total: number;
	readonly club: string;
	readonly cheque?: {
		name: string;
		lastname: string;
		amount: number;
		amountText?: string;
		clubName: string;
	};
	actions?: any;
}
