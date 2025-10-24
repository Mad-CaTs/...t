export interface IPartnerListTable {
	readonly id: number;
	readonly username: string;
	readonly fullname: string;
	readonly date: string;
	readonly active: boolean;
	readonly rangeName: string;
}

export interface IPlacementListTable {
	readonly id: number;
	readonly username: string;
	readonly fullname: string;
	readonly date: string;
	readonly membership: string;
	readonly status: number;
}

export interface IAccountTreeActivationManagerTable {
	readonly id: number;
	readonly afilationDate: string;
	readonly fullname: string;
	readonly docNumber: string;
	readonly phone: string;
	readonly active: boolean;
}

export interface IConciliationDetailTable {
	readonly idConciliation: number;
	readonly amount: number | string;
	readonly idStatus: string;
	readonly periodDate: string;
	readonly statusName: string;
}

export interface IAccountTreeRangesTable {
	readonly id: number;
	readonly startCycle: string;
	readonly endCycle: string;
	readonly range: string;
	readonly active: boolean;
	readonly brandOnePoints: number;
	readonly brandTwoPoints: number;
}

export interface IAccountTreeOrganizationManagerTable {
	readonly id: number;
	readonly afilatitonDate: string;
	readonly fullname: string;
	readonly code: string;
	readonly active: boolean;
	readonly range: number;
}

export interface ITreeData {
	readonly id?: number;
	readonly name?: string;
	readonly statusId?: number;
	readonly childs: ITreeData[];
}

export interface ITreeDataV2 {
	readonly idsociomaster?: number;
	readonly name?: string;
	readonly statusId?: number;
	readonly childs: ITreeDataChildren[];
}
export interface ITreeDataChildren {
	parentId: number;
	readonly idsocio?: number;
	readonly nombre_socio?: string;
	readonly estado_socio?: number;
	readonly fechaRegistro?: string;
	compuestoTotal?: any;
	puntajeDeLaMembresia?: any;
	readonly subscriptionStatus: {
		idSubscription: number;
		status: number;
	}



	readonly children: ITreeDataChildren[];
}

export interface ILeyend {
	readonly idState: number;
	readonly nameState: string;
	readonly colorRGB: string;
}

export interface IMembership {
	readonly idPackage: number;
	readonly name: string;
	readonly codeMembership: string;
	readonly description: string;
	readonly idFamilyPackage: number;
	readonly status: number;
	readonly packageDetail: null;
}
