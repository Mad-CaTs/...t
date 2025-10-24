import { CommonModule } from '@angular/common';
import { Component, EventEmitter, input, Input, Output } from '@angular/core';
import { DocumentDetailItemComponent } from './components/document-detail-item/document-detail-item.component';
import { MatIconModule } from '@angular/material/icon';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';

@Component({
	selector: 'app-document-detail-card',
	standalone: true,
	imports: [CommonModule, DocumentDetailItemComponent, MatIconModule],
	templateUrl: './document-detail-card.component.html',
	styleUrl: './document-detail-card.component.scss'
})
export class DocumentDetailCardComponent {
	@Input() typeDocument!: any;
	@Input() date!: string;
	@Input() isLegalization: boolean = false;
	@Input() userInfo: any;
	private destroy$: Subject<void> = new Subject<void>();
	@Input() nationalitiesList: ISelect[] = [];

	constructor(private newPartnerService: NewPartnerService) {}

	ngOnInit(): void {

		/* 		this.getNationalities();
		 */ console.log('userInfoendetalele', this.userInfo);
	}

	/* 	getNationalities() {
		this.newPartnerService
			.getCountriesList()
			.pipe(takeUntil(this.destroy$))
			.subscribe((paises) => {
				this.nationalitiesList = paises;
				console.log('✅ Datos recibidos:', this.nationalitiesList);
				this.nationalitiesLoaded.emit(this.nationalitiesList);
			});
	} */

	/*  */
}
