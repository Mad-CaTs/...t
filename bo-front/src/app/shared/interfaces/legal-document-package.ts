
export interface LegalDocumentPackage {
	listLegalDocuments: LegalDocument[];
	idSubscription: number;
	idFamily: number;
	idPackage: number;
}

export interface LegalDocument {
  numberSerial: number;
  idDocument: number;
	idLegalDocument: number;
	name: string;
	description: string;
	creationDate?: number[];
	updateDate?: number[];
	idSubscription: number;
	idFamily: number;
	idPackage: number;
	id: number;
	idFamilyPackage: number;
}
