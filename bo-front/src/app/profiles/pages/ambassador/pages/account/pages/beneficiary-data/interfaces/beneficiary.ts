export interface ITableBeneficiary {
    readonly id: number;
    readonly name: string;
    readonly lastName: string;
    readonly nroDocument: string;
    readonly ageDate: Date;
    readonly age: number;
    readonly email: string;
    readonly expirationDate: Date;
    readonly memberShip: string;
    readonly gender: string;
    readonly subscription? : string;
}