import { INavigation } from "@init-app/interfaces";
import { ISelect } from "@shared/interfaces/forms-control";



export const nationalitiesOptMock: ISelect[] = [
	{
		value: 1,
		content: 'Peru'
	},
	{
		value: 2,
		content: 'Colombia'
	},
	{
		value: 3,
		content: 'USA'
	},
	{
		value: 4,
		content: 'Chile'
	},
	{
		value: 5,
		content: 'Ecuador'
	}
];

export const typeDocumentOptMock: ISelect[] = [
	{
		value: 1,
		content: 'DNI'
	},
	{
		value: 2,
		content: 'CE'
	},
	{
		value: 3,
		content: 'Passaporte'
	}
];

export const civilStateOptMock: ISelect[] = [
	{
		value: 1,
		content: 'Soltero'
	},
	{
		value: 2,
		content: 'Casado(a)'
	}
];

export const genderOptMock: ISelect[] = [
	{
		value: 1,
		content: 'Mujer'
	},
	{
		value: 2,
		content: 'Hombre'
	}
];

/* Navigation */

export const StepsNavigation: INavigation[] = [
	{
		id: 0,
		text: 'Datos Personales'
	},
	{
		id: 1,
		text: 'Datos de Contacto'
	},
	{
		id: 2,
		text: 'Paquetes'
	},
	// PASO ASIGNAR PADRINO OCULTO POR VERSIÓN DE PRODUCCIÓN
	// {
	// 	id: 3,
	// 	text: 'Asignar Padrino'
	// },
	{
		id: 3,
		text: 'Medio de pago'
	}
];
