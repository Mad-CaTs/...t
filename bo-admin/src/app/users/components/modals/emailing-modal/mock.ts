export const emailingTypes = [
	{
		id: '1',
		icon: 'bi bi-file-earmark-break',
		title: 'Correo de documentos',
		helper: 'Se envía correo de bienvenida con sus documentos (contrato, certificado, beneficios, etc).'
	},
	{
		id: '2',
		icon: 'bi bi-signpost-split',
		title: 'Correo Subir Recibo',
		helper: 'Correo con un link para subir recibo faltante del Registro.'
	},
	{
		id: '3',
		icon: 'bi bi-piggy-bank',
		title: 'Cuota Faltante',
		helper: 'Se le enviara un correo para notificar que esta a falta de una cuota'
	},
	{
		id: '4',
		icon: 'bi bi-credit-card-2-front',
		title: 'Correo Pago Exitoso',
		helper: 'Se le enviara un correo para notificar que su pago fue exitoso'
	}
];

export const mockData = [
	{
		id: '1',
		username: 'juanito',
		fullname: 'Juanito de las casas Ke Ho',
		email: 'juanito@gmail.com',
		partner: {
			username: 'omar123',
			fullname: 'Juanito de las casas Ke Ho',
			email: 'omarcito@gmail.com'
		},
		master: {
			username: 'fressia',
			fullname: 'Fressia Flores',
			email: 'fressia@gmail.com'
		},
		subscriptions: [
			{
				id: '1',
				name: 'PREMIUM',
				fromDate: '09/02/2020',
				email: 'juanito12@gmail.com'
			},
			{
				id: '2',
				name: 'GOLD',
				fromDate: '03/18/2022',
				email: 'juanito_gold@gmail.com'
			},
			{
				id: '3',
				name: 'SILVER',
				fromDate: '06/10/2023',
				email: 'juanito_silver@gmail.com'
			}
		]
	},
	{
		id: '2',
		username: 'user2',
		fullname: 'María López',
		email: 'maria@gmail.com',
		partner: {
			username: 'user3',
			fullname: 'Carlos Rodríguez',
			email: 'carlos@gmail.com'
		},
		master: {
			username: 'user4',
			fullname: 'Luisa Fernández',
			email: 'luisa@gmail.com'
		},
		subscriptions: [
			{
				id: '4',
				name: 'BASIC',
				fromDate: '05/12/2021',
				email: 'maria_basic@gmail.com'
			},
			{
				id: '5',
				name: 'PREMIUM',
				fromDate: '08/25/2022',
				email: 'maria_premium@gmail.com'
			},
			{
				id: '6',
				name: 'STANDARD',
				fromDate: '11/30/2023',
				email: 'maria_standard@gmail.com'
			}
		]
	},
	{
		id: '3',
		username: 'user3',
		fullname: 'Carlos Rodríguez',
		email: 'carlos@gmail.com',
		partner: {
			username: 'user2',
			fullname: 'María López',
			email: 'maria@gmail.com'
		},
		master: {
			username: 'user4',
			fullname: 'Luisa Fernández',
			email: 'luisa@gmail.com'
		},
		subscriptions: [
			{
				id: '7',
				name: 'STANDARD',
				fromDate: '04/05/2020',
				email: 'carlos_standard@gmail.com'
			},
			{
				id: '8',
				name: 'GOLD',
				fromDate: '07/18/2021',
				email: 'carlos_gold@gmail.com'
			},
			{
				id: '9',
				name: 'PREMIUM',
				fromDate: '10/23/2022',
				email: 'carlos_premium@gmail.com'
			}
		]
	},
	{
		id: '4',
		username: 'user4',
		fullname: 'Luisa Fernández',
		email: 'luisa@gmail.com',
		partner: {
			username: 'user2',
			fullname: 'María López',
			email: 'maria@gmail.com'
		},
		master: {
			username: 'user3',
			fullname: 'Carlos Rodríguez',
			email: 'carlos@gmail.com'
		},
		subscriptions: [
			{
				id: '10',
				name: 'GOLD',
				fromDate: '12/15/2019',
				email: 'luisa_gold@gmail.com'
			},
			{
				id: '11',
				name: 'SILVER',
				fromDate: '03/28/2021',
				email: 'luisa_silver@gmail.com'
			},
			{
				id: '12',
				name: 'BASIC',
				fromDate: '06/30/2022',
				email: 'luisa_basic@gmail.com'
			}
		]
	},
	{
		id: '5',
		username: 'user5',
		fullname: 'Ana Smith',
		email: 'ana@gmail.com',
		partner: {
			username: 'user6',
			fullname: 'Eduardo García',
			email: 'eduardo@gmail.com'
		},
		master: {
			username: 'user7',
			fullname: 'Laura Johnson',
			email: 'laura@gmail.com'
		},
		subscriptions: [
			{
				id: '13',
				name: 'SILVER',
				fromDate: '02/09/2020',
				email: 'ana_silver@gmail.com'
			},
			{
				id: '14',
				name: 'GOLD',
				fromDate: '05/22/2021',
				email: 'ana_gold@gmail.com'
			},
			{
				id: '15',
				name: 'PREMIUM',
				fromDate: '08/03/2022',
				email: 'ana_premium@gmail.com'
			}
		]
	},
	{
		id: '6',
		username: 'user6',
		fullname: 'Eduardo García',
		email: 'eduardo@gmail.com',
		partner: {
			username: 'user5',
			fullname: 'Ana Smith',
			email: 'ana@gmail.com'
		},
		master: {
			username: 'user8',
			fullname: 'Pedro Pérez',
			email: 'pedro@gmail.com'
		},
		subscriptions: [
			{
				id: '16',
				name: 'BRONZE',
				fromDate: '07/17/2021',
				email: 'eduardo_bronze@gmail.com'
			},
			{
				id: '17',
				name: 'STANDARD',
				fromDate: '10/29/2022',
				email: 'eduardo_standard@gmail.com'
			},
			{
				id: '18',
				name: 'BASIC',
				fromDate: '01/10/2024',
				email: 'eduardo_basic@gmail.com'
			}
		]
	},
	{
		id: '7',
		username: 'user7',
		fullname: 'Laura Johnson',
		email: 'laura@gmail.com',
		partner: {
			username: 'user8',
			fullname: 'Pedro Pérez',
			email: 'pedro@gmail.com'
		},
		master: {
			username: 'user6',
			fullname: 'Eduardo García',
			email: 'eduardo@gmail.com'
		},
		subscriptions: [
			{
				id: '19',
				name: 'PREMIUM',
				fromDate: '09/12/2020',
				email: 'laura_premium@gmail.com'
			},
			{
				id: '20',
				name: 'GOLD',
				fromDate: '12/25/2021',
				email: 'laura_gold@gmail.com'
			},
			{
				id: '21',
				name: 'SILVER',
				fromDate: '03/10/2023',
				email: 'laura_silver@gmail.com'
			}
		]
	},
	{
		id: '8',
		username: 'user8',
		fullname: 'Pedro Pérez',
		email: 'pedro@gmail.com',
		partner: {
			username: 'user7',
			fullname: 'Laura Johnson',
			email: 'laura@gmail.com'
		},
		master: {
			username: 'user6',
			fullname: 'Eduardo García',
			email: 'eduardo@gmail.com'
		},
		subscriptions: [
			{
				id: '22',
				name: 'GOLD',
				fromDate: '02/05/2021',
				email: 'pedro_gold@gmail.com'
			},
			{
				id: '23',
				name: 'BRONZE',
				fromDate: '05/18/2022',
				email: 'pedro_bronze@gmail.com'
			},
			{
				id: '24',
				name: 'PREMIUM',
				fromDate: '08/21/2023',
				email: 'pedro_premium@gmail.com'
			}
		]
	},
	{
		id: '9',
		username: 'user9',
		fullname: 'Marta Martínez',
		email: 'marta@gmail.com',
		partner: {
			username: 'user10',
			fullname: 'Andrés Castro',
			email: 'andres@gmail.com'
		},
		master: {
			username: 'user7',
			fullname: 'Laura Johnson',
			email: 'laura@gmail.com'
		},
		subscriptions: [
			{
				id: '25',
				name: 'STANDARD',
				fromDate: '03/08/2020',
				email: 'marta_standard@gmail.com'
			},
			{
				id: '26',
				name: 'PREMIUM',
				fromDate: '06/21/2021',
				email: 'marta_premium@gmail.com'
			},
			{
				id: '27',
				name: 'GOLD',
				fromDate: '09/04/2022',
				email: 'marta_gold@gmail.com'
			}
		]
	},
	{
		id: '10',
		username: 'user10',
		fullname: 'Andrés Castro',
		email: 'andres@gmail.com',
		partner: {
			username: 'user9',
			fullname: 'Marta Martínez',
			email: 'marta@gmail.com'
		},
		master: {
			username: 'user8',
			fullname: 'Pedro Pérez',
			email: 'pedro@gmail.com'
		},
		subscriptions: [
			{
				id: '28',
				name: 'BASIC',
				fromDate: '04/11/2021',
				email: 'andres_basic@gmail.com'
			},
			{
				id: '29',
				name: 'PREMIUM',
				fromDate: '07/24/2022',
				email: 'andres_premium@gmail.com'
			},
			{
				id: '30',
				name: 'SILVER',
				fromDate: '10/07/2023',
				email: 'andres_silver@gmail.com'
			}
		]
	}
];
