import { ITableAbstract } from "./shared.interface";

export interface ITablePeriod extends ITableAbstract {
    initialDate: number[];
    endDate: number[];
    payDate: number[];
    isActive: number;
    status: number;
}