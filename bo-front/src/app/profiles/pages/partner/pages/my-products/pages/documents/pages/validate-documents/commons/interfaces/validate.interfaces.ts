/* export interface IStep {
	label: string;
} */

export interface IStep {
	id: number;
	label: string;
}

export interface IAuthorizedPerson {
	name: string;
	lastName: string;
	nroDocument: string;
	fecha: string;
	documentFile: string;
}

export interface IStep2FormData {
	typeLegalization: number;
	idResidenceCountry: number;
	districtAddress: string;
	address: string;
	documentToLegalize: number;
	email: string;
	availability: number;
	firma: number;
	legalizationMethod: number;
	province: string;
}

export interface IFormDataChange {
	value: any;
	valid: boolean;
	sucursalSeleccionada?: any;
	sucursalesCercanas?: any[];
	error?: string | null;
	loader?: boolean;
}
