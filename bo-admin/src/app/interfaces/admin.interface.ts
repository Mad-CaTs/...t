export interface IFamilyPackageTable {
	readonly id: number;
	readonly name: string;
	readonly activeVersion: number;
	readonly description: string;
	readonly lastVersion: number;
	readonly lastVersionDescription: string;
}

export interface IPackageTable {
	readonly id: number;
	readonly colorPackage: string;
	readonly package: string;
	readonly familyPackageId: number;
	readonly code: string;
	readonly description: string;
	readonly status: number; // 0 for deactive and 1 for active
}

export interface IPackageDetailTable {
	readonly packageId: number;
	readonly packageName: string;
	readonly packageDescription: string;
	readonly colorPackage: string;
	readonly code: string;
	readonly normalPrice: number;
	readonly initialPrice: number;
	readonly cuotePrice: number;
	readonly duration: string;
	readonly maxCuotes: number;
	readonly initialCuotes: number;
	readonly adquisitionPoints: number;
	readonly numberValuable: number;
	readonly partnerEarn: number;
	readonly familyPackageId: number;
}

export interface IPackagePromotionalCodeTable {
	readonly id: number;
	readonly username: string;
	readonly fullname: string;
	readonly email: string;
	readonly docNumber: string;
	readonly docType: string;
	readonly phone: string;
	readonly codes: number;
	readonly rangeName: string;
}

export interface IEventsGeneralTable {
	readonly id: number;
	readonly photoUrl: string;
	readonly presentator: string;
	readonly subType: string;
	readonly startDate: string;
	readonly finishDate: string;
	readonly meetingUrl: string | null;
	readonly recordUrl: string | null;
	readonly status: string;
	readonly statusId: number;
}

export interface IEventTypeTable {
	readonly id: number;
	readonly relationWithSubTipo: number;
	readonly name: string;
	readonly active: boolean;
}

export interface IEventSubTypeTable {
	readonly id: number;
	readonly name: string;
	readonly eventTypeName: string;
	readonly landingName: string;
	readonly landingUrl: string;
	readonly gender: number; // 0 for male, 1 for female and 2 for all genders
	readonly ranges: string[]; // The name of the ranges such as "Gold", "Platinum"
	readonly eventsRelations: number;
}
