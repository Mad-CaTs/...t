import { Injectable } from '@angular/core';
import { IReportDownloader } from '../interfaces/report.interface';
import { UserReportDownloader } from './downloaders/user-report-downloader.service';
import { StateReportDownloader } from './downloaders/state-report-downloader.service';
import { SubscriptionReportDownloader } from './downloaders/subscription-report-downloader.service';
import { AffiliateReportDownloader } from './downloaders/affiliate-report-downloader.service';
import { CountryReportDownloader } from './downloaders/country-report-downloader.service';
import { RangeReportDownloader } from './downloaders/range-report-downloader.service';
import { CompoundClosureReportDownloader } from './downloaders/compound-closure-report-downloader.service';
import { ResidualClosureReportDownloader } from './downloaders/residual-closure-report-downloader.service';

export type ReportType = 'user' | 'usuario' | 'estados' | 'afiliado' | 'rangos' | 'suscripcion' | 
						 'cierre-residual' | 'cierre-compuesto' | 'codigos-paises';

@Injectable({
	providedIn: 'root'
})
export class ReportDownloaderFactory {

	constructor(
		private userDownloader: UserReportDownloader,
		private stateDownloader: StateReportDownloader,
		private subscriptionDownloader: SubscriptionReportDownloader,
		private affiliateDownloader: AffiliateReportDownloader,
		private countryDownloader: CountryReportDownloader,
		private rangeDownloader: RangeReportDownloader,
		private compoundClosureDownloader: CompoundClosureReportDownloader,
		private residualClosureDownloader: ResidualClosureReportDownloader
	) {}

	getDownloader(reportType: ReportType): IReportDownloader {
		switch (reportType) {
			case 'user':
			case 'usuario':
				return this.userDownloader;
				
			case 'estados':
				return this.stateDownloader;
				
			case 'afiliado':
				return this.affiliateDownloader;
				
			case 'rangos':
				return this.rangeDownloader;
				
			case 'suscripcion':
				return this.subscriptionDownloader;
				
			case 'cierre-residual':
				return this.residualClosureDownloader;
				
			case 'cierre-compuesto':
				return this.compoundClosureDownloader;
				
			case 'codigos-paises':
				return this.countryDownloader;
				
			default:
				throw new Error(`Tipo de reporte no reconocido: ${reportType}`);
		}
	}
}