import { ITableAbstract } from "./shared.interface";

export interface ITableGracePeriod extends ITableAbstract {
    gracePeriodParameterId: number;
    valueDays: number;
    status: number;
    creationDate: string;
    modificationDate: string;
}