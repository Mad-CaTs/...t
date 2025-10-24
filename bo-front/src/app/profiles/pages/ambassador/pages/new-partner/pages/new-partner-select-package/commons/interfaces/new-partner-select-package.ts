export interface PackageToTransfer {
	idSubscription: number;
	idSponsor: number;
	typeUser: number;
	nameSubscription: string;
	familyPackageName: string;
	creationDate: string;
	idStatus: number;
	numberQuotas: number;
}

export interface DialogData {
	title: string;
	message: string;
	icon: {
		name: string;
		color: string;
		bgColor: string;
		borderColor: string;
	};
}