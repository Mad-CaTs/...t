import { ITransferOption } from '../../../commons/interfaces';

 export const TRANSFER_OPTIONS: ITransferOption[] = [
	{
		id: 1,
		icon: '/assets/icons/tickets/arrange-circle.svg',
		title: 'De cuenta normal a nuevo socio',
		description: 'Aquí podrás transferir tu cuenta unitaria a un nuevo socio de forma sencilla.'
	},
	{
		id: 2,
		icon: '/assets/icons/tickets/people.svg',
		title: 'De cuenta multicódigo a nuevo socio',
		description:
			'Aquí podrás transferir uno de tus perfiles de tu cuenta multicódigo a un nuevo socio de forma sencilla.'
	},
	{
		id: 3,
		icon: '/assets/icons/tickets/custom-user.svg',
		title: 'De membresía a nuevo socio',
		description: 'Aquí podrás realizar el traspaso de membresía a un nuevo socio.'
	},
	{
		id: 4,
		icon: '/assets/icons/tickets/support.svg',
		title: 'De membresía a socio vigente',
		description: 'Aquí podrás realizar el traspaso de membresía a un socio vigente.'
	}
]; 

export const ICONS_MAP: Record<number, string> = {
  1: '/assets/icons/tickets/arrange-circle.svg',
  2: '/assets/icons/tickets/people.svg',
  3: '/assets/icons/tickets/custom-user.svg',
  4: '/assets/icons/tickets/support.svg'
};



export const TRANSFER_STEPS: string[] = [
  'Elige la opción de traspaso',
  'Formulario de traspaso',
  'Envío de documentos',
  'Confirmación de solicitud'
];
