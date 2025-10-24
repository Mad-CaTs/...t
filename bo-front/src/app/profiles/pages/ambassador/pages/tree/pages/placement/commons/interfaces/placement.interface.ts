export interface IPlacement {
	readonly idSponsor: number;
	readonly idSon: number[];
}

export interface IPlacementPut {
	readonly idsociomaster: number;
	readonly idSocio: number;
	readonly idSocioNuevo: number;
	readonly tipo: string;
}