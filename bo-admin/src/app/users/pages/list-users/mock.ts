import type { ISelectOpt } from '@interfaces/form-control.interface';
import type { IPartnersRegisteredTable } from '@interfaces/partners.interface';

export const asOptMock: ISelectOpt[] = [
	{ id: '1', text: 'Usuario' },
	{ id: '2', text: 'Patrocinador' }
];

export const statusOptMock: ISelectOpt[] = [
	{ id: '1', text: 'Todos' },
	{ id: '2', text: 'Inactivo' },
	{ id: '3', text: 'Activo' },
	{ id: '4', text: 'Pendiente validación inicial' },
	{ id: '5', text: 'Rechazo inicial' },
	{ id: '6', text: 'Pagar Despues' },
	{ id: '7', text: 'Deuda 1' },
	{ id: '8', text: 'Deuda 2' },
	{ id: '9', text: 'Deuda 3' },
	{ id: '10', text: 'PreLiquidacion' },
	{ id: '11', text: 'Congelado' },
	{ id: '12', text: 'Pendiente validación cuota' },
	{ id: '13', text: 'Rechazo cuota' },
	{ id: '14', text: 'Suscripción finalizada' },
	{ id: '15', text: 'Pendiente validación migración' },
	{ id: '16', text: 'Rechazo migración' },
	{ id: '17', text: 'Liquidacion' },
	{ id: '18', text: 'Pendiente Validacion Cuota Adelantada' }
];

export const familyPackageOptMock: ISelectOpt[] = [
	{ id: '1', text: 'Todos' },
	{ id: '2', text: 'KEOLA' },
	{ id: '3', text: 'INRESORTS RIBERA DEL RÍO' },
	{ id: '4', text: 'KIT DE INICIO' },
	{ id: '5', text: 'SEMILLA RIBERA DEL RÍO' },
	{ id: '6', text: 'INRESORTS LA JOYA' },
	{ id: '7', text: 'SEMILLA INRESORTS LA JOYA' }
];
export const packageOptMock: ISelectOpt[] = [
	{ id: '1', text: 'Todos' },
	{ id: '2', text: 'Platinium' },
	{ id: '3', text: 'Gold' },
	{ id: '4', text: 'Clasic' },
	{ id: '5', text: 'Infinite' },
	{ id: '6', text: 'ELITE' },
	{ id: '7', text: 'Premium' },
	{ id: '8', text: 'Infinite Premium' }
];

export const dataBodyMock: IPartnersRegisteredTable[] = [
	{
		id: '1',
		username: 'libelula',
		fullname: 'Ana Paez',
		lastname: 'De las casas',
		startDate: '30 de diciembre del 2023',
		email: 'libelula@gmail.com',
		phone: '948 516 230',
		docNumber: '888747412',
		docType: 'DNI',
		partner: 'Sin Patrocinador',
		status: 'Activo',
		subscriptionQuantity: 10,
		gender: "1" // 1 for female
	},
	{
		id: '2',
		username: 'juancito',
		fullname: 'Juan Rosales',
		lastname: 'Gonzales flores',
		startDate: '10 de febrero del 2023',
		email: 'juancito@gmail.com',
		phone: '948 534 230',
		docNumber: '8887471232',
		docType: 'LAS',
		partner: 'libelula (Ana Paez)',
		status: 'Inactivo',
		subscriptionQuantity: 1,
		gender: "0" // 0 for male
	},
	{
		id: '3',
		username: 'mariagomez',
		fullname: 'Maria Gomez',
		lastname: 'Lopez',
		startDate: '5 de junio del 2023',
		email: 'mariagomez@gmail.com',
		phone: '948 456 789',
		docNumber: '777555444',
		docType: 'DNI',
		partner: 'Sin Patrocinador',
		status: 'Activo',
		subscriptionQuantity: 5,
		gender: "1" // 1 for female
	},
	{
		id: '4',
		username: 'pedroruiz',
		fullname: 'Pedro Ruiz',
		lastname: 'Martinez',
		startDate: '20 de abril del 2023',
		email: 'pedroruiz@gmail.com',
		phone: '948 987 654',
		docNumber: '666333999',
		docType: 'DNI',
		partner: 'mariagomez (Maria Gomez)',
		status: 'Inactivo',
		subscriptionQuantity: 2,
		gender: "0" // 0 for male
	},
	{
		id: '5',
		username: 'lucasgarcia',
		fullname: 'Lucas Garcia',
		lastname: 'Fernandez',
		startDate: '15 de agosto del 2023',
		email: 'lucasgarcia@gmail.com',
		phone: '948 456 321',
		docNumber: '555444666',
		docType: 'DNI',
		partner: 'Sin Patrocinador',
		status: 'Activo',
		subscriptionQuantity: 8,
		gender: "0" // 0 for male
	},
	{
		id: '6',
		username: 'anamolina',
		fullname: 'Ana Molina',
		lastname: 'Rodriguez',
		startDate: '3 de marzo del 2023',
		email: 'anamolina@gmail.com',
		phone: '948 123 456',
		docNumber: '999888777',
		docType: 'DNI',
		partner: 'lucasgarcia (Lucas Garcia)',
		status: 'Activo',
		subscriptionQuantity: 3,
		gender: "1" // 1 for female
	},
	{
		id: '7',
		username: 'carlosruiz',
		fullname: 'Carlos Ruiz',
		lastname: 'Gutierrez',
		startDate: '25 de mayo del 2023',
		email: 'carlosruiz@gmail.com',
		phone: '948 789 123',
		docNumber: '654321987',
		docType: 'DNI',
		partner: 'lucasgarcia (Lucas Garcia)',
		status: 'Inactivo',
		subscriptionQuantity: 1,
		gender: "0" // 0 for male
	},
	{
		id: '8',
		username: 'luisacosta',
		fullname: 'Luisa Costa',
		lastname: 'Sanchez',
		startDate: '7 de noviembre del 2023',
		email: 'luisacosta@gmail.com',
		phone: '948 987 321',
		docNumber: '321654987',
		docType: 'DNI',
		partner: 'Sin Patrocinador',
		status: 'Activo',
		subscriptionQuantity: 12,
		gender: "1" // 1 for female
	},
	{
		id: '9',
		username: 'pablogomez',
		fullname: 'Pablo Gomez',
		lastname: 'Mendoza',
		startDate: '12 de abril del 2023',
		email: 'pablogomez@gmail.com',
		phone: '948 123 789',
		docNumber: '741852963',
		docType: 'DNI',
		partner: 'Sin Patrocinador',
		status: 'Activo',
		subscriptionQuantity: 20,
		gender: "0" // 0 for male
	},
	{
		id: '10',
		username: 'lauragonzalez',
		fullname: 'Laura Gonzalez',
		lastname: 'Ramirez',
		startDate: '8 de septiembre del 2023',
		email: 'lauragonzalez@gmail.com',
		phone: '948 987 654',
		docNumber: '852963741',
		docType: 'DNI',
		partner: 'pablogomez (Pablo Gomez)',
		status: 'Inactivo',
		subscriptionQuantity: 1,
		gender: "1" // 1 for female
	}
];
