export interface ITableDto {
	page: number;
	size: number;
}

export interface ILoginDto {
	username: string;
	password: string;
}

export interface ITableNewDto extends ITableDto {
	title?: string;
}

export interface INewDto {
	title: string;
	description: string;
	publish_date: string;
	image_url: string;
	video_url?: string;
	status: boolean;
}

export interface IFamilyDto {
	name: string;
	description: string;
}

export interface IPackageDto {
	name: string;
	codeMemberShip: string;
	description: string;
	idFamilyPackage: number;
	estatus: number;
}

export interface IPackageDetailDto {
	packageId: number;
	monthsDuration: number;
	price: number;
	numberQuotas: number;
	initialPrice: number;
	quotaPrice: number;
	volume: number;
	numberInitialQuote: number;
	comission: number;
	numberShares: number;
	familyPackageId: number;
	membershipVersionId: number;
	// membershipMaintenance: number;
}

export interface IToolDto {
	nameDocument: string;
	fileName: string;
	idInvestmentProject: number;
	idEducationalDocumentCategory: number;
	idEducationalDocumentFormat: number;
}

export interface ITypeChangeDto {
	buys: number;
	sale: number;
}