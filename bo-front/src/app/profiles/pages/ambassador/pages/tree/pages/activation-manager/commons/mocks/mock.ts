import { INavigation } from "@init-app/interfaces";
import { ISelect } from "@shared/interfaces/forms-control";
import { IAccountTreeActivationManagerTable } from "../../../../commons/interfaces";

export const activationManagerNav: INavigation[] = [
	{
		id: 1,
		text: 'Primer nivel'
	},
	{
		id: 2,
		text: 'Niveles del 2 al 7'
	}
];

export const optStatusMock: ISelect[] = [
  {
    value: -1,
    content: 'Todos',
  },

	{
		value: 1,
		content: 'Activo'
	},
	{
		value: 0,
		content: 'Inactivo'
	}
];
export const optNearToInvalidateMock: ISelect[] = [
	{
		value: 1,
		content: 'No filtrar'
	},
	{
		value: 2,
		content: 'Ciclo actual'
	}
];

export const optLevelMock: ISelect[] = [
	{
		value: -1,
		content: 'Todos',
	},
	{
		value: 1,
		content: 'Level 1'
	},
	{
		value: 2,
		content: 'Level 2'
	},
	{
		value: 3,
		content: 'Level 3'
	},
	{
		value: 4,
		content: 'Level 4'
	},
	{
		value: 5,
		content: 'Level 5'
	},
	{
		value: 6,
		content: 'Level 6'
	},
	{
		value: 7,
		content: 'Level 7'
	},
	{
		value: 8,
		content: 'Level 8'
	},
	{
		value: 9,
		content: 'Level 9'
	},
	{
		value: 10,
		content: 'Level 10'
	},
	{
		value: 11,
		content: 'Level 11'
	},
	{
		value: 12,
		content: 'Level 12'
	},
	{
		value: 13,
		content: 'Level 13'
	},
	{
		value: 14,
		content: 'Level 14'
	}
];

export const activationManagerTableMock: IAccountTreeActivationManagerTable[] = [
	{
		id: 1,
		afilationDate: 'Fri, 01 Sep 2023 16:00:13 GMT',
		fullname: 'Julio Gonzales del Carpio',
		docNumber: '47280864',
		phone: '+51 47280864',
		active: true
	},
	{
		id: 2,
		afilationDate: 'Sat, 02 Sep 2023 16:00:13 GMT',
		fullname: 'Maria Rodriguez',
		docNumber: '78901234',
		phone: '+51 78901234',
		active: true
	},
	{
		id: 3,
		afilationDate: 'Sun, 03 Sep 2023 16:00:13 GMT',
		fullname: 'Carlos Perez',
		docNumber: '56789012',
		phone: '+51 56789012',
		active: true
	},
	{
		id: 4,
		afilationDate: 'Mon, 04 Sep 2023 16:00:13 GMT',
		fullname: 'Laura Smith',
		docNumber: '12345678',
		phone: '+51 12345678',
		active: false
	},
	{
		id: 5,
		afilationDate: 'Tue, 05 Sep 2023 16:00:13 GMT',
		fullname: 'John Doe',
		docNumber: '87654321',
		phone: '+51 87654321',
		active: true
	},
	{
		id: 6,
		afilationDate: 'Wed, 06 Sep 2023 16:00:13 GMT',
		fullname: 'Alice Johnson',
		docNumber: '98765432',
		phone: '+51 98765432',
		active: true
	},
	{
		id: 7,
		afilationDate: 'Thu, 07 Sep 2023 16:00:13 GMT',
		fullname: 'David Brown',
		docNumber: '34567890',
		phone: '+51 34567890',
		active: false
	},
	{
		id: 8,
		afilationDate: 'Fri, 08 Sep 2023 16:00:13 GMT',
		fullname: 'Eva White',
		docNumber: '65432109',
		phone: '+51 65432109',
		active: true
	},
	{
		id: 9,
		afilationDate: 'Sat, 09 Sep 2023 16:00:13 GMT',
		fullname: 'Michael Lee',
		docNumber: '23456789',
		phone: '+51 23456789',
		active: true
	},
	{
		id: 10,
		afilationDate: 'Sun, 10 Sep 2023 16:00:13 GMT',
		fullname: 'Sophia Taylor',
		docNumber: '45678901',
		phone: '+51 45678901',
		active: true
	},
	{
		id: 11,
		afilationDate: 'Mon, 11 Sep 2023 16:00:13 GMT',
		fullname: 'William Davis',
		docNumber: '56789012',
		phone: '+51 56789012',
		active: false
	},
	{
		id: 12,
		afilationDate: 'Tue, 12 Sep 2023 16:00:13 GMT',
		fullname: 'Olivia Johnson',
		docNumber: '78901234',
		phone: '+51 78901234',
		active: true
	},
	{
		id: 13,
		afilationDate: 'Wed, 13 Sep 2023 16:00:13 GMT',
		fullname: 'Daniel Martin',
		docNumber: '34567890',
		phone: '+51 34567890',
		active: false
	},
	{
		id: 14,
		afilationDate: 'Thu, 14 Sep 2023 16:00:13 GMT',
		fullname: 'Sophia Brown',
		docNumber: '98765432',
		phone: '+51 98765432',
		active: true
	},
	{
		id: 15,
		afilationDate: 'Fri, 15 Sep 2023 16:00:13 GMT',
		fullname: 'James Wilson',
		docNumber: '65432109',
		phone: '+51 65432109',
		active: true
	},
	{
		id: 16,
		afilationDate: 'Sat, 16 Sep 2023 16:00:13 GMT',
		fullname: 'Emily Taylor',
		docNumber: '23456789',
		phone: '+51 23456789',
		active: true
	},
	{
		id: 17,
		afilationDate: 'Sun, 17 Sep 2023 16:00:13 GMT',
		fullname: 'Michael Davis',
		docNumber: '45678901',
		phone: '+51 45678901',
		active: false
	},
	{
		id: 18,
		afilationDate: 'Mon, 18 Sep 2023 16:00:13 GMT',
		fullname: 'Olivia Wilson',
		docNumber: '56789012',
		phone: '+51 56789012',
		active: true
	},
	{
		id: 19,
		afilationDate: 'Tue, 19 Sep 2023 16:00:13 GMT',
		fullname: 'Ethan Johnson',
		docNumber: '78901234',
		phone: '+51 78901234',
		active: true
	},
	{
		id: 20,
		afilationDate: 'Wed, 20 Sep 2023 16:00:13 GMT',
		fullname: 'Mia Smith',
		docNumber: '34567890',
		phone: '+51 34567890',
		active: false
	},
	{
		id: 21,
		afilationDate: 'Thu, 21 Sep 2023 16:00:13 GMT',
		fullname: 'Liam Martin',
		docNumber: '98765432',
		phone: '+51 98765432',
		active: true
	},
	{
		id: 22,
		afilationDate: 'Fri, 22 Sep 2023 16:00:13 GMT',
		fullname: 'Ava Brown',
		docNumber: '65432109',
		phone: '+51 65432109',
		active: true
	},
	{
		id: 23,
		afilationDate: 'Sat, 23 Sep 2023 16:00:13 GMT',
		fullname: 'Noah Taylor',
		docNumber: '23456789',
		phone: '+51 23456789',
		active: true
	},
	{
		id: 24,
		afilationDate: 'Sun, 24 Sep 2023 16:00:13 GMT',
		fullname: 'Emma Davis',
		docNumber: '45678901',
		phone: '+51 45678901',
		active: false
	},
	{
		id: 25,
		afilationDate: 'Mon, 25 Sep 2023 16:00:13 GMT',
		fullname: 'Liam Wilson',
		docNumber: '56789012',
		phone: '+51 56789012',
		active: true
	},
	{
		id: 26,
		afilationDate: 'Tue, 26 Sep 2023 16:00:13 GMT',
		fullname: 'Olivia Johnson',
		docNumber: '78901234',
		phone: '+51 78901234',
		active: true
	},
	{
		id: 27,
		afilationDate: 'Wed, 27 Sep 2023 16:00:13 GMT',
		fullname: 'Ethan Martin',
		docNumber: '34567890',
		phone: '+51 34567890',
		active: false
	},
	{
		id: 28,
		afilationDate: 'Thu, 28 Sep 2023 16:00:13 GMT',
		fullname: 'Ava Brown',
		docNumber: '65432109',
		phone: '+51 65432109',
		active: true
	},
	{
		id: 29,
		afilationDate: 'Fri, 29 Sep 2023 16:00:13 GMT',
		fullname: 'Noah Taylor',
		docNumber: '23456789',
		phone: '+51 23456789',
		active: true
	},
	{
		id: 30,
		afilationDate: 'Sat, 30 Sep 2023 16:00:13 GMT',
		fullname: 'Emma Davis',
		docNumber: '45678901',
		phone: '+51 45678901',
		active: false
	}
];
