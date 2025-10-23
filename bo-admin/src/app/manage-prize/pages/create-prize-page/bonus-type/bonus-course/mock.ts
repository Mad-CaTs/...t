import { ITableBonusCourse } from '@interfaces/create-prize.interface';

export const tableDataMock: ITableBonusCourse[] = [
	{
		id: 1,
		range: { idRange: '1', name: 'Plata' },
		startDate: '24/01/2024',
		limitDate: '30/01/2024',
		fullname: 'Linda Susan',
		qualificationCycles: 1,
		reclassification: 1,
		description: 'De traspaso',
		score: 900,
        used: false
	},
	{
		id: 2,
		range: { idRange: '2', name: 'Oro' },
		startDate: '24/01/2024',
		limitDate: '30/01/2024',
		fullname: 'Jesus Ramirez',
		qualificationCycles: 1,
		reclassification: 1,
		description: 'De traspaso',
		score: 1700,
        used: false
	},
	{
		id: 3,
		range: { idRange: '3', name: 'Diamante' },

		startDate: '24/01/2024',
		limitDate: '30/01/2024',
		fullname: 'Stanley Pines',
		qualificationCycles: 1,
		reclassification: 1,
		description: 'De traspaso',
		score: 8000,
        used: false
	},
	{
		id: 4,
		range: { idRange: '4', name: 'Zafiro' },
		startDate: '24/01/2024',
		limitDate: '30/01/2024',
		fullname: 'Wendy Corduroy',
		qualificationCycles: 1,
		reclassification: 1,
		description: 'Titular inicial',
		score: 2500,
        used: true
	},
	{
		id: 5,
		range: { idRange: '4', name: 'Zafiro' },
		startDate: '24/01/2024',
		limitDate: '30/01/2024',
		fullname: 'Candy Chiu',
		qualificationCycles: 1,
		reclassification: 1,
		description: 'De traspaso',
		score: 7500,
        used: false
	}
];
