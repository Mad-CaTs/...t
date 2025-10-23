import { ITableTravel } from "@interfaces/manage-home.interface";

export const tableDataMock: ITableTravel[] = [
	{
		id: 1,
		destiny: 'Paracas',
        date: '15/08/2025',
		status: 'Activo',
		flyer: '././assets/media/events/events1.jpeg'
	},
	{
		id: 2,
		destiny: 'Máncora',
		date: '24/09/2024',
		status: 'Activo',
		flyer: '././assets/media/events/events2.jpeg'
	},
	{
		id: 3,
		destiny: 'Oxapampa',
		date: '10/10/2024',
		status: 'Inactivo',
		flyer: '././assets/media/events/events2.jpeg'
	}
];