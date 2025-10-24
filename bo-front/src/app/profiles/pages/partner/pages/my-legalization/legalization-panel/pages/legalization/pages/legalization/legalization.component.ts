import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MyLegalizationTableComponent } from '../../comons/components/my-legalization-table/my-legalization-table.component';
import { DocumentCardComponent } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/commons/components/document-card/document-card.component';
import { LegalDocument, LegalDocumentPackage } from '@shared/interfaces/legal-document-package';
import { DocumentDetailCardComponent } from 'src/app/profiles/pages/partner/pages/my-products/pages/documents/commons/components/document-detail-card/document-detail-card.component';
import { DocumentSummaryCardComponent } from '../../comons/components/document-summary-card/document-summary-card.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-legalization',
	standalone: true,
	imports: [CommonModule, MatIconModule, DocumentSummaryCardComponent, DocumentDetailCardComponent],
	templateUrl: './legalization.component.html',
	styleUrl: './legalization.component.scss'
})
export class LegalizationComponent {
	public typeDocument: string;
	public date: string;
	@Input() listLegalDocuments!: LegalDocument[];
	@Input() selectedProduct: any;
	@Input() userInfo: any;
	private destroy$: Subject<void> = new Subject<void>();
	public nationalitiesList: ISelect[] = [];

	constructor(private newPartnerService: NewPartnerService) {}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['listLegalDocuments']) {
			console.log('✅ listLegalDocuments actualizado:', this.listLegalDocuments);
		}
	}

	ngOnInit(): void {
		this.getNationalities();
		console.log('listLegalDocumentskey', this.listLegalDocuments);
	}

	getNationalities() {
		this.newPartnerService
			.getCountriesList()
			.pipe(
				takeUntil(this.destroy$),
				tap((paises) => (this.nationalitiesList = paises))
			)
			.subscribe();
	}
}
