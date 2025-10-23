import { ITableAbstract } from './shared.interface';

export interface ITableTransferRequest extends ITableAbstract {
	ordenNumber: number;
	requester_username: string;
	requester_name: string;
	requester_last_name: string;
	requestDate: string;
	fullnameTransferApplicant: string;
	usedPrizes: string;
	reason: string;
	suscriptions: number[];
	icon?: string;
	idTransferType: number;
	dni_url?: string;
	dni_receptor_url?: string;
	declaration_jurada_url?: string;
	user_to_nombre: string;
	transferTypeName?: string;
	user_to_apellido: string;
	user_from_nombre: string;
	user_from_last_name: string;
	sponsor_nombre: string;
	sponsor_last_name: string;
	idTransferRequest: number;
	username_to: string;
	user_to_fecha_nacimiento: string;
	user_to_genero: string;
	user_to_nacionalidad: number;
	user_to_correo_electronico: string;
	user_to_numero_documento: string;
	user_to_distrito: string;
	user_to_direccion: string;
	user_to_celular: string;
	user_to_tipo_documento: number;
	username_from: string;
	childId: number;
	newUserId: string;
	user_to_pais_residencia: string;
	user_to_estado_civil: number;
	usernameChild: string;
	name_memberhip: string;
	id_user_to: number;
	idUserTo: number;
	idMembership: number;
	sponsorId: number;
}

export interface ITransferType {
	id: number;
	name: string;
	description: string;
}

export interface ITableTransferHistorico {
	id: number;
	ordenNumber: number;
	requester_username: string;
	requester_name: string;
	requester_last_name: string;
	requestDate: string;
	fullnameTransferApplicant: string;
	usedPrizes: string;
	reason: string;
	suscriptions: number[];
	username_to: string;
	aprovational_date: string;
	user_from_nombre: string;
	user_from_last_name: string;
	user_to_nombre: string;
	user_to_apellido: string;
	idTransferType: number;
	user_to_pais_residencia: string;
	nameMembership: string;
}
