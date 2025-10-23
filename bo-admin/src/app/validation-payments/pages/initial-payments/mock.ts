import { ITableInitialPayments } from '@interfaces/payment-validate.interface';

export const tableDataMock: ITableInitialPayments[] = [
	{
		id: 1,
		ordenNumber: 1,
		date: '13/07/23',
		username: 'adrián24',
		fullname: 'Adrián Flores C.',
		dni: '15678989',
		partner: 'RocxanVera Solano',
		membership: 'Vitalicia',
		couponCode: 'No hay cupón',
		daysGracePeriod: 0,
		verification: false,
		preState: false,
		idSuscription: 0,
		idUser: 0
	},
	{
		id: 2,
		ordenNumber: 2,
		date: '13/07/23',
		username: 'adrián24',
		fullname: 'Adrián Flores C.',
		dni: '15678989',
		partner: 'RocxanVera Solano',
		membership: 'Vitalicia',
		couponCode: 'No hay cupón',
		daysGracePeriod: 0,
		verification: true,
		preState: true,
		idSuscription: 0,
		idUser: 0
	}
];
