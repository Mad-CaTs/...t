import { ISelect } from '@shared/interfaces/forms-control';

export interface IMembershipData {
	idLegalDocument: number;
	name: string;
	description: string;
	creationDate: any[];
	updateDate: any[];
}

export interface ISelectedElement {
	id: number;
	idFamilyPackage: number;
	familyPackageName: string;
	nameSuscription: string;
	volumen: number;
	idGracePeriodParameter: number | null;
	idPackage: number;
	idPackageDetail: number;
	idStatus: number;
	idUser: number;
	numberQuotas: number;
	status: string;
	volumenByFee: number;
	volumenRibera: number | null;
	creationDate: string;
	modificationDate: string;
}

export interface IModalLegalizationData {
	payTypeList: ISelect[];
	selectedElement: ISelectedElement;
	membershipData: IMembershipData;
}
