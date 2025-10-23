export interface ILoginResponse {
	readonly token: string;
    readonly expiration: string;
    readonly authorities: { id: number; name: string; url: string }[];
	readonly token_type: string;
	readonly token_expire: string;
	readonly jti: string;
	readonly role?: number;
}

export interface ITableResponse<T> {
	readonly currentPage: number;
	readonly data: T[];
	readonly elPerPage: number;
	readonly totalElements: number;
}

export interface INew {
	createdAt: number[];
	description: string;
	imageUrl: string;
	newsId: number;
	publishDate: number[];
	status: boolean;
	title: string;
	updatedAt: number[];
	videoUrl: string | null;
}

export interface ITool {
	fileName: string;
	idEducationalDocument: number;
	idEducationalDocumentCategory: number;
	idEducationalDocumentFormat: number;
	idInvestmentProject: number;
	nameDocument: string;
}
