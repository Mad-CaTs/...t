import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TariffTableOneComponent } from './components/tariff-table-one/tariff-table-one.component';
import { ILegalRateOne, ILegalRatesResponse, ITariffItem } from '@interfaces/legal-module.interface';
import { LegalService } from '@app/legal/services/LegalService';

@Component({
	selector: 'app-rate-legalization',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		TariffTableOneComponent,
		FormsModule,
		InlineSVGModule,
		NgbAccordionModule
	],

	templateUrl: './rate-legalization.component.html',
	styleUrls: ['./rate-legalization.component.scss']
})
export class RateLegalizationComponent {
	//regularContracts = regularContracts;
	//regularCertificates = regularCertificates;
	//expressContracts = expressContracts;
	//expressCertificates = expressCertificates;

	regularContracts: ILegalRateOne[] = [];
	regularCertificates: ILegalRateOne[] = [];
	expressContracts: ILegalRateOne[] = [];
	expressCertificates: ILegalRateOne[] = [];

	constructor(private legalService: LegalService) {}

	ngOnInit(): void {
		this.legalService.getAllRates().subscribe({
			next: (response: ILegalRatesResponse) => {
				const activeRates = response.data.filter((item) => item.status === 1);

				this.regularContracts = activeRates.filter(
					(item) => item.legalType === 1 && item.documentType === 2
				);
				this.regularCertificates = activeRates.filter(
					(item) => item.legalType === 1 && item.documentType === 1
				);

				this.expressContracts = activeRates.filter(
					(item) => item.legalType === 2 && item.documentType === 2
				);
				this.expressCertificates = activeRates.filter(
					(item) => item.legalType === 2 && item.documentType === 1
				);
			},
			error: (err) => {
				console.error('Error cargando tarifas:', err);
			}
		});
	}
}
