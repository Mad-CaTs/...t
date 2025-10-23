import { ITableAbstract } from "./shared.interface";

export interface ITableRentExemption extends ITableAbstract {
    rentExemptionId: number;
    creationDate: string;
    date: string;
    name: string;
    lastName: string;
    username: number;
    year: number;
    number: string;
    nroDocument: string;
    status: number;
}