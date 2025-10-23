import { ITableBankMovement } from '@interfaces/payment-validate.interface';

export const tableDataMock: ITableBankMovement[] = [
	{
		id: 1,
		bankName: 'BCP',
		accountNumber: '5678909876527',
		accountType: 'Soles',
		date: '12/07/23',
		registerNumber: 20,
		registerValidation: 14,
		pendings: 0
	},
	{
		id: 2,
		bankName: 'Interbank',
		accountNumber: '5678909876527',
		accountType: 'Dolares',
		date: '05/05/23',
		registerNumber: 20,
		registerValidation: 7,
		pendings: 10
	}
];
