import { INavigation } from '@init-app/interfaces';
import {
	IAccountTreeOrganizationManagerTable,
	IAccountTreeRangesTable
} from '../../../../commons/interfaces';

export const historyRangeNavigationMock: INavigation[] = [
	{ id: 1, text: 'Mis Logros' },
	{ id: 5, text: 'Mis Premios' },
	{ id: 2, text: 'Rangos Adquiridos' },
	{ id: 3, text: 'Rango Residual' }
];

export const accountTreeRangesMock: IAccountTreeRangesTable[] = [
	{
		id: 1,
		startCycle: 'Mon, 01 Sep 2023 16:04:29 GMT',
		endCycle: 'Mon, 04 Sep 2023 16:04:29 GMT',
		range: 'Plata',
		active: false,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 2,
		startCycle: 'Tue, 05 Sep 2023 16:04:29 GMT',
		endCycle: 'Fri, 08 Sep 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 3,
		startCycle: 'Sat, 09 Sep 2023 16:04:29 GMT',
		endCycle: 'Tue, 12 Sep 2023 16:04:29 GMT',
		range: 'Diamante',
		active: false,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 4,
		startCycle: 'Wed, 13 Sep 2023 16:04:29 GMT',
		endCycle: 'Sat, 16 Sep 2023 16:04:29 GMT',
		range: 'Bronce',
		active: true,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 5,
		startCycle: 'Sun, 17 Sep 2023 16:04:29 GMT',
		endCycle: 'Wed, 20 Sep 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 6,
		startCycle: 'Thu, 21 Sep 2023 16:04:29 GMT',
		endCycle: 'Sun, 24 Sep 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 7,
		startCycle: 'Mon, 25 Sep 2023 16:04:29 GMT',
		endCycle: 'Thu, 28 Sep 2023 16:04:29 GMT',
		range: 'Diamante',
		active: true,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 8,
		startCycle: 'Fri, 29 Sep 2023 16:04:29 GMT',
		endCycle: 'Mon, 02 Oct 2023 16:04:29 GMT',
		range: 'Bronce',
		active: true,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 9,
		startCycle: 'Tue, 03 Oct 2023 16:04:29 GMT',
		endCycle: 'Fri, 06 Oct 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 10,
		startCycle: 'Sat, 07 Oct 2023 16:04:29 GMT',
		endCycle: 'Tue, 10 Oct 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 11,
		startCycle: 'Wed, 11 Oct 2023 16:04:29 GMT',
		endCycle: 'Sat, 14 Oct 2023 16:04:29 GMT',
		range: 'Diamante',
		active: true,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 12,
		startCycle: 'Sun, 15 Oct 2023 16:04:29 GMT',
		endCycle: 'Wed, 18 Oct 2023 16:04:29 GMT',
		range: 'Bronce',
		active: true,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 13,
		startCycle: 'Thu, 19 Oct 2023 16:04:29 GMT',
		endCycle: 'Sun, 22 Oct 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 14,
		startCycle: 'Mon, 23 Oct 2023 16:04:29 GMT',
		endCycle: 'Thu, 26 Oct 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 15,
		startCycle: 'Fri, 27 Oct 2023 16:04:29 GMT',
		endCycle: 'Mon, 30 Oct 2023 16:04:29 GMT',
		range: 'Diamante',
		active: true,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 16,
		startCycle: 'Tue, 31 Oct 2023 16:04:29 GMT',
		endCycle: 'Fri, 03 Nov 2023 16:04:29 GMT',
		range: 'Bronce',
		active: true,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 17,
		startCycle: 'Sat, 04 Nov 2023 16:04:29 GMT',
		endCycle: 'Tue, 07 Nov 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 18,
		startCycle: 'Wed, 08 Nov 2023 16:04:29 GMT',
		endCycle: 'Sat, 11 Nov 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 19,
		startCycle: 'Sun, 12 Nov 2023 16:04:29 GMT',
		endCycle: 'Wed, 15 Nov 2023 16:04:29 GMT',
		range: 'Diamante',
		active: true,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 20,
		startCycle: 'Thu, 16 Nov 2023 16:04:29 GMT',
		endCycle: 'Sun, 19 Nov 2023 16:04:29 GMT',
		range: 'Bronce',
		active: true,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 21,
		startCycle: 'Mon, 20 Nov 2023 16:04:29 GMT',
		endCycle: 'Thu, 23 Nov 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 22,
		startCycle: 'Fri, 24 Nov 2023 16:04:29 GMT',
		endCycle: 'Mon, 27 Nov 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 23,
		startCycle: 'Tue, 28 Nov 2023 16:04:29 GMT',
		endCycle: 'Fri, 01 Dec 2023 16:04:29 GMT',
		range: 'Diamante',
		active: true,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 24,
		startCycle: 'Sat, 02 Dec 2023 16:04:29 GMT',
		endCycle: 'Tue, 05 Dec 2023 16:04:29 GMT',
		range: 'Bronce',
		active: true,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 25,
		startCycle: 'Wed, 06 Dec 2023 16:04:29 GMT',
		endCycle: 'Sat, 09 Dec 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 26,
		startCycle: 'Sun, 10 Dec 2023 16:04:29 GMT',
		endCycle: 'Wed, 13 Dec 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	},
	{
		id: 27,
		startCycle: 'Thu, 14 Dec 2023 16:04:29 GMT',
		endCycle: 'Sun, 17 Dec 2023 16:04:29 GMT',
		range: 'Diamante',
		active: true,
		brandOnePoints: 200,
		brandTwoPoints: 100
	},
	{
		id: 28,
		startCycle: 'Mon, 18 Dec 2023 16:04:29 GMT',
		endCycle: 'Thu, 21 Dec 2023 16:04:29 GMT',
		range: 'Bronce',
		active: false,
		brandOnePoints: 50,
		brandTwoPoints: 25
	},
	{
		id: 29,
		startCycle: 'Fri, 22 Dec 2023 16:04:29 GMT',
		endCycle: 'Mon, 25 Dec 2023 16:04:29 GMT',
		range: 'Plata',
		active: true,
		brandOnePoints: 0,
		brandTwoPoints: 0
	},
	{
		id: 30,
		startCycle: 'Tue, 26 Dec 2023 16:04:29 GMT',
		endCycle: 'Fri, 29 Dec 2023 16:04:29 GMT',
		range: 'Oro',
		active: true,
		brandOnePoints: 100,
		brandTwoPoints: 50
	}
];

export const accountTreeOrganizationManager: IAccountTreeOrganizationManagerTable[] = [
	{
		id: 1,
		afilatitonDate: 'Mon, 01 Sep 2023 16:04:29 GMT',
		fullname: 'Carlos Pascual Rojas Escate',
		code: 'CR42536501',
		active: true,
		range: 0
	},
	{
		id: 2,
		afilatitonDate: 'Tue, 02 Sep 2023 16:04:29 GMT',
		fullname: 'Maria Rodriguez Perez',
		code: 'MR78901234',
		active: true,
		range: 1
	},
	{
		id: 3,
		afilatitonDate: 'Wed, 03 Sep 2023 16:04:29 GMT',
		fullname: 'Juan Garcia Fernandez',
		code: 'JG56789012',
		active: true,
		range: 2
	},
	{
		id: 4,
		afilatitonDate: 'Thu, 04 Sep 2023 16:04:29 GMT',
		fullname: 'Laura Smith Johnson',
		code: 'LS12345678',
		active: false,
		range: 3
	},
	{
		id: 5,
		afilatitonDate: 'Fri, 05 Sep 2023 16:04:29 GMT',
		fullname: 'John Doe Williams',
		code: 'JD87654321',
		active: true,
		range: 0
	},
	{
		id: 6,
		afilatitonDate: 'Sat, 06 Sep 2023 16:04:29 GMT',
		fullname: 'Alice Johnson Davis',
		code: 'AJ98765432',
		active: true,
		range: 1
	},
	{
		id: 7,
		afilatitonDate: 'Sun, 07 Sep 2023 16:04:29 GMT',
		fullname: 'David Brown Martin',
		code: 'DB34567890',
		active: false,
		range: 2
	},
	{
		id: 8,
		afilatitonDate: 'Mon, 08 Sep 2023 16:04:29 GMT',
		fullname: 'Eva White Taylor',
		code: 'EW65432109',
		active: true,
		range: 3
	},
	{
		id: 9,
		afilatitonDate: 'Tue, 09 Sep 2023 16:04:29 GMT',
		fullname: 'Michael Lee Garcia',
		code: 'ML23456789',
		active: true,
		range: 0
	},
	{
		id: 10,
		afilatitonDate: 'Wed, 10 Sep 2023 16:04:29 GMT',
		fullname: 'Sophia Taylor Perez',
		code: 'ST45678901',
		active: true,
		range: 1
	},
	{
		id: 11,
		afilatitonDate: 'Thu, 11 Sep 2023 16:04:29 GMT',
		fullname: 'William Davis Gonzalez',
		code: 'WD56789012',
		active: false,
		range: 2
	},
	{
		id: 12,
		afilatitonDate: 'Fri, 12 Sep 2023 16:04:29 GMT',
		fullname: 'Olivia Johnson Smith',
		code: 'OJ78901234',
		active: true,
		range: 3
	},
	{
		id: 13,
		afilatitonDate: 'Sat, 13 Sep 2023 16:04:29 GMT',
		fullname: 'Daniel Martin Rodriguez',
		code: 'DM34567890',
		active: false,
		range: 0
	},
	{
		id: 14,
		afilatitonDate: 'Sun, 14 Sep 2023 16:04:29 GMT',
		fullname: 'Sophia Brown Garcia',
		code: 'SB98765432',
		active: true,
		range: 1
	},
	{
		id: 15,
		afilatitonDate: 'Mon, 15 Sep 2023 16:04:29 GMT',
		fullname: 'James Wilson Davis',
		code: 'JWD65432109',
		active: true,
		range: 2
	},
	{
		id: 16,
		afilatitonDate: 'Tue, 16 Sep 2023 16:04:29 GMT',
		fullname: 'Emily Taylor Johnson',
		code: 'ETJ23456789',
		active: true,
		range: 3
	},
	{
		id: 17,
		afilatitonDate: 'Wed, 17 Sep 2023 16:04:29 GMT',
		fullname: 'Michael Davis Perez',
		code: 'MDP45678901',
		active: false,
		range: 0
	},
	{
		id: 18,
		afilatitonDate: 'Thu, 18 Sep 2023 16:04:29 GMT',
		fullname: 'Olivia Wilson Gonzalez',
		code: 'OWG56789012',
		active: true,
		range: 1
	},
	{
		id: 19,
		afilatitonDate: 'Fri, 19 Sep 2023 16:04:29 GMT',
		fullname: 'Ethan Johnson Smith',
		code: 'EJS78901234',
		active: true,
		range: 2
	},
	{
		id: 20,
		afilatitonDate: 'Sat, 20 Sep 2023 16:04:29 GMT',
		fullname: 'Mia Smith Perez',
		code: 'MSP34567890',
		active: false,
		range: 3
	},
	{
		id: 21,
		afilatitonDate: 'Sun, 21 Sep 2023 16:04:29 GMT',
		fullname: 'Liam Martin Davis',
		code: 'LMD98765432',
		active: true,
		range: 0
	},
	{
		id: 22,
		afilatitonDate: 'Mon, 22 Sep 2023 16:04:29 GMT',
		fullname: 'Ava Brown Taylor',
		code: 'ABT65432109',
		active: true,
		range: 1
	},
	{
		id: 23,
		afilatitonDate: 'Tue, 23 Sep 2023 16:04:29 GMT',
		fullname: 'Noah Taylor Johnson',
		code: 'NTJ23456789',
		active: true,
		range: 2
	},
	{
		id: 24,
		afilatitonDate: 'Wed, 24 Sep 2023 16:04:29 GMT',
		fullname: 'Emma Davis Smith',
		code: 'EDS45678901',
		active: false,
		range: 3
	},
	{
		id: 25,
		afilatitonDate: 'Thu, 25 Sep 2023 16:04:29 GMT',
		fullname: 'Liam Wilson Perez',
		code: 'LWP56789012',
		active: true,
		range: 0
	},
	{
		id: 26,
		afilatitonDate: 'Fri, 26 Sep 2023 16:04:29 GMT',
		fullname: 'Olivia Johnson Gonzalez',
		code: 'OJG78901234',
		active: true,
		range: 1
	},
	{
		id: 27,
		afilatitonDate: 'Sat, 27 Sep 2023 16:04:29 GMT',
		fullname: 'Ethan Martin Smith',
		code: 'EMS34567890',
		active: false,
		range: 2
	},
	{
		id: 28,
		afilatitonDate: 'Sun, 28 Sep 2023 16:04:29 GMT',
		fullname: 'Ava Brown Davis',
		code: 'ABD98765432',
		active: true,
		range: 3
	},
	{
		id: 29,
		afilatitonDate: 'Mon, 29 Sep 2023 16:04:29 GMT',
		fullname: 'Noah Taylor Perez',
		code: 'NTP65432109',
		active: true,
		range: 0
	},
	{
		id: 30,
		afilatitonDate: 'Tue, 30 Sep 2023 16:04:29 GMT',
		fullname: 'Emma Davis Johnson',
		code: 'EDJ23456789',
		active: true,
		range: 1
	}
];
