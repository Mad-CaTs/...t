import { ITableMigrationPayments, ITablePendingPayments } from '@interfaces/payment-validate.interface';

export const tableDataMock: ITableMigrationPayments[] = [
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
		paymentDate: '31/08/2023',
		package: 'Keola',
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
		paymentDate: '14/08/2023',
		package: 'Inresorts',
		idSuscription: 0,
		idUser: 0
	}
];
