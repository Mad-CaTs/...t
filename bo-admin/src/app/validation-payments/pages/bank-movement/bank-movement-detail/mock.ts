import { ITableBankMovementCharge } from '@interfaces/payment-validate.interface';

export const tableDataMockOne: ITableBankMovementCharge[] = [
	{
		id: 1,
		opDate: '12/07/23 09:00am',
		processDate: '12/07/23 09:00am',
		opNumber: '0488030',
		movement: 500,
		description: 'Quispe Malca Jesus',
		canal: 'Web',
		charge: '',
		bonus: 500,
		state: 'pending'
	},
	{
		id: 2,
		opDate: '12/07/23 09:00am',
		processDate: '12/07/23 09:00am',
		opNumber: '0488030',
		movement: 500,
		description: 'Quispe Malca Jesus',
		canal: 'Web',
		charge: '',
		bonus: 500,
		state: 'payed'
	}
];
