import { ITableExpiratedPayments } from '@interfaces/payment-validate.interface';

export const tableMock: any[] = [
	{
		id: 1,
		ordenNumber: 1,
		fullname: 'Adrián Flores C.',
		description: '',
		date: '',
		amount: 12.1
	},
	{
		id: 2,
		ordenNumber: 2,
		fullname: 'Adrián Flores C.',
		description: 'Mi pago falso',
		date: '18/10/2022',
		amount: 0
	}
];
