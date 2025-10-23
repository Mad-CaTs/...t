import { ITableAbstract } from './shared.interface';

export interface ITableChangeType extends ITableAbstract {
	readonly orderN: number;
	readonly date: string;
	readonly pen: number;
	readonly usd: number;
	readonly col: number;
	readonly colones: number;
}
