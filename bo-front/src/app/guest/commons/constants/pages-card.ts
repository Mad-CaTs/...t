import { Pages } from '../enums/guest.enum';
import { Panel } from '../interfaces/guest-components.interface';

export const PagesCard: Record<Pages, Panel> = {
	[Pages.MY_PURCHASES]: {
		title: 'Mis Compras',
		description: 'Aquí podrás encontrar todas tus compras y nominarlas.'
	},
	[Pages.MY_TICKETS]: {
		title: 'Mis Entradas',
		description: 'Aquí podrás encontrar todas tus entradas y descargarlas.'
	},
	[Pages.MY_DETAILS_TICKETS]: {
		title: 'Detalles de Entradas',
		description: 'Aquí podrás ver los detalles de tus entradas.'
	},
	[Pages.MY_PASSWORD]: {
		title: 'Mi Contraseña',
		description: 'Aquí podrás cambiar tu contraseña.'
	},
	[Pages.MY_PROFILE]: {
		title: 'Mi perfil',
		description: 'Aquí podrás encontrar todas información personal'
	},
	[Pages.MY_MARKET]: {
		title: 'Mi Tienda',
		description:'Aquí podrás adquirir tu membresía, ¿Qué esperas?.'
	}
};
