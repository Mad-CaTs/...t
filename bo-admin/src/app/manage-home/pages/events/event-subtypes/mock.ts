import { ITableEventSubtypes } from '@interfaces/manage-home.interface';

export const tableDataMock: ITableEventSubtypes[] = [
	{
		nameSubtype: 'Presentación Negocio KeOla',
		nameEventType: 'KeOla',
		nameLanding: 'KeOla',
		urlLanding: 'https://dashboard.inclub.world/landing/keola',
		gender: 'M',
		range: [],
		id: 1
	},
	{
		nameSubtype: 'Evento Camino a la libertad',
		nameEventType: 'Todos',
		nameLanding: 'InResorts',
		urlLanding: 'https://dashboard.inclub.world/landing/inresorts',
		gender: 'F',
		range: [],
		id: 2
	},
	{
		nameSubtype: 'Sistema Educativo Platas',
		nameEventType: 'Sistema Educativo',
		nameLanding: 'Sistema Educativo 2',
		urlLanding: 'https://dashboard.inclub.world/landing/sistema-de-entrenamiento',
		gender: '-',
		range: [
			{ idRange: '1', name: 'Oro' },
			{ idRange: '2', name: 'Platino' },
			{ idRange: '3', name: 'Diamante' },
			{ idRange: '4', name: 'Bronce' }
		],
		id: 3
	},
	{
		nameSubtype: 'Sistema Educativo Platas',
		nameEventType: 'Sistema Educativo',
		nameLanding: 'Sistema Educativo 2',
		urlLanding: 'https://dashboard.inclub.world/landing/sistema-de-entrenamiento',
		gender: 'F',
		range: [
			{ idRange: '1', name: 'Oro' },
			{ idRange: '2', name: 'Platino' }
		],
		id: 4
	}
];
