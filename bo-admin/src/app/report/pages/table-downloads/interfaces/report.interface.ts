export interface DownloadParams {
	startDate?: Date | null;
	endDate?: Date | null;
	periodId?: number;
	state?: number;
	countries?: number[];
	month?: number;
	year?: number;
	packageId?: number;
	familyId?: number;
}

export interface ReportDownloadResult {
	blob: Blob;
	filename: string;
	success: boolean;
	error?: string;
}

export interface IReportDownloader {
	download(params?: DownloadParams): Promise<ReportDownloadResult>;
	generateFilename(params?: DownloadParams): string;
}