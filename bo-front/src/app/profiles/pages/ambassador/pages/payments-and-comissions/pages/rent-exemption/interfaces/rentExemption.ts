export interface ITableRentExemption {
    readonly id: number;
    readonly userId: number;
    readonly year: number;
    readonly number: string;
    readonly nroDocument: string;
    readonly fileName: string;
    readonly creationDate: string;
    readonly status: number;
}