import { ITableCreatePrize } from '@interfaces/create-prize.interface';

export const tableDataMock: ITableCreatePrize[] = [
	{
		id: 1,
		range: { idRange: '1', name: 'Plata' },
		startDate: '24/01/2029',
		endDate: '30/01/2024',
		destiny: 'Resort Nacional 3 días 2 noches',
		bonusValue: 239.15,
		link: 'https://www.gruposwats.com/',
		flyer: '././assets/media/events/events1.jpeg',
		status: 'Activo'
	},
	{
		id: 2,
		range: { idRange: '2', name: 'Oro' },
		startDate: '24/01/2024',
		endDate: '30/01/2024',
		destiny: 'Resort Nacional',
		bonusValue: 10000,
		link: 'https://www.gruposwats.com/',
		flyer: '././assets/media/events/events1.jpeg',
		status: 'Inactivo'
	},
	{
		id: 3,
		range: { idRange: '3', name: 'Diamante' },

		startDate: '24/01/2024',
		endDate: '30/01/2024',
		destiny: 'Resort Nacional 3 días 2 noches',
		bonusValue: 239.15,
		link: 'https://www.gruposwats.com/',
		flyer: '././assets/media/events/events1.jpeg',
		status: 'Activo'
	},
	{
		id: 4,
		range: { idRange: '4', name: 'Zafiro' },
		startDate: '24/01/2024',
		endDate: '30/01/2024',
		destiny: 'Resort Nacional 3 días 2 noches',
		bonusValue: 239.15,
		link: 'https://www.gruposwats.com/',
		flyer: '././assets/media/events/events1.jpeg',
		status: 'Activo'
	},
	{
		id: 5,
		range: { idRange: '4', name: 'Zafiro' },
		startDate: '24/01/2024',
		endDate: '30/01/2024',
		destiny: 'Resort Nacional 3 días 2 noches',
		bonusValue: 1550.50,
		link: '',
		flyer: '././assets/media/events/events1.jpeg',
		status: 'Inactivo'
	}
];
