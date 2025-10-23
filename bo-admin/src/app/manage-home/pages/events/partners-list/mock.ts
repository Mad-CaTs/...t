import { ITablePartnerList } from '@interfaces/manage-home.interface';

export const tableDataMock: ITablePartnerList[] = [
	{
		id: 1,
		dateRegister: '25/10/2023',
		eventSubtype: 'A',
		fullname: 'Derek Shepard',
		ipDetected: '190.1.1.180',
		email: 'derek@derek.com',
		countryDetected: 'Perú',
		cityDetected: 'Lima',
		typeSelected: 'A',
		subtypeSelected: 'B',
		username: 'DS04431172',
		sponsor: 'Meredith Grey'
	},
	{
		id: 2,
		dateRegister: '25/10/2023',
		eventSubtype: 'A',
		fullname: 'Mark Sloan',
		ipDetected: '190.1.1.180',
		email: 'mark@sloan.com',
		countryDetected: 'Perú',
		cityDetected: 'Lima',
		typeSelected: 'A',
		subtypeSelected: 'B',
		username: 'MS01446312',
		sponsor: 'Derek Shepard'
	}
];
