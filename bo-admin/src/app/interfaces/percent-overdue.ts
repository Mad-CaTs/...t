import { ITableAbstract } from "./shared.interface";

export interface ITablePercentOverdueType extends ITableAbstract {
    idPercentOverdueType: number;
    names: string;
    descriptions: string;
    status: number;
    creationDate: string;
    modificationDate: string;
}

export interface ITablePercentDetail extends ITableAbstract {
    idPercentOverdueDetail: number;
    idPercentOverdueType: number;
    percentOverdue: number;
    status: number;
    creationDate: string;
    modificationDate: string;
}