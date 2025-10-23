import { ITableRequestTransferElectronicWallet } from '@interfaces/requests.interface';

export const tableDataMock: ITableRequestTransferElectronicWallet[] = [
	{
		orderN: 1,
		date: '12/ 12/2022',
		fullname: 'Hector Geiner Cruzado Velasquez',
		destiny: 'Hector Geiner Cruzado Velasquez',
		accountOwner: 'Andres Navarro',
		username: '@andreplay',
		link: 'paypal.me/@andreplay',
		accountType: 'USD',
		amount: 17.5,
		id: 1
	},
	{
		orderN: 2,
		date: '12/ 12/2022',
		fullname: 'Hector Geiner Cruzado Velasquez',
		destiny: '',
		accountOwner: 'Andres Navarro',
		username: '@andreplay',
		link: 'paypal.me/@andreplay',
		accountType: 'PEN',
		amount: 25.5,
		id: 2
	}
];
