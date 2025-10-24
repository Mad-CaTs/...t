import { IDashboardInfoCard, IDashboardOption } from '../interfaces/dashboard-options';

export const DASHBOARD_OPTIONS: IDashboardOption[] = [
	{
		title: 'Seguimiento de ticket',
		icon: 'pi pi-eye',
		description: 'Consulta y da seguimiento al estado de los tickets que hayas generado.',
/* 		route: '/ventas'
 */	},
	{
		title: 'Nuevo ticket',
		icon: 'assets/icons/edit.svg',
		description: 'Genera un nuevo ticket para registrar tu requerimiento o reclamo.',
		route: '/profile/ambassador/tickets/new-ticket'
	}
];

export const DASHBOARD_INFO_CARDS: IDashboardInfoCard[] = [
	{
		type: 'Traspaso',
		title: 'De membresía socio vigente',
		subtitle: 'Juan Pérez',
		user: 'JP078778',
		color: 'danger'
	},
	{
		type: 'Migración',
		title: 'Membresía vitalicia',
		subtitle: 'María López',
		user: 'ML8900',
		color: 'warning'
	},
	{
		type: 'Periodo de Gracia',
		title: 'USD 50.90',
		subtitle: 'Carlos Ruiz',
		user: 'CR87455',
		color: 'primary'
	}
];

export const TICKET_OPTIONS: IDashboardOption[] = [
	{
		title: 'Traspasos',
		icon: 'pi pi-eye',
		description: 'Aquí podrás realizar el traspaso de tu cuenta o membresía a otro socio.',
		route: '/profile/ambassador/tickets/transfer-steps'
	},
	{
		title: 'Migración',
		icon: 'assets/icons/edit.svg',
		description: 'Solicita la migración de tu membresía o portafolio a otro socio.',
/* 		route: '/profile/ambassador/tickets/new-ticket'
 */	},
	{
		title: 'Periodo de gracia',
		icon: 'pi pi-eye',
		description: 'Consulte si cuenta con un período de gracia activo.',
/* 		route: '/ventas'
 */	},
	{
		title: 'Actualización de datos',
		icon: 'assets/icons/edit.svg',
		description: 'Solicita la actualización de tus datos personales y de contacto.',
/* 		route: '/profile/ambassador/tickets/new-ticket'
 */	}
];
