import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { DataSharingService } from '../../../../../commons/services/data-sharing.service';
import StoreComponent from 'src/app/profiles/pages/ambassador/pages/store/store.component';
import { TreeService } from 'src/app/profiles/pages/ambassador/pages/tree/commons/services/tree.service';
import { PdfService } from '@shared/services/pdf-service';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalDocumentComponent } from '@shared/components/modal/modal-document/modal-document.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BeneficiaryService } from 'src/app/profiles/pages/ambassador/pages/account/pages/beneficiary-data/services/beneficiary-service.service';
import { finalize, forkJoin, take } from 'rxjs';
@Component({
	selector: 'card-product',
	templateUrl: 'card-product.component.html',
	styleUrls: ['./card-product.component.css'],
	standalone: true,
	imports: [MatIconModule, MatButtonModule, RouterLink, StoreComponent, CommonModule, MatProgressBarModule]
})
export class CardProductComponent implements OnInit {
	@Input() membershipType: string;
	@Input() subscriptionStatus: string;
	@Input() idStatus: number;
	@Input() installmentNumber: number;
	@Input() pacValue: number;
	@Input() date: string;
	@Input() id: number;
	@Input() idPackageDetail: number;
	@Input() idPackage: number;
	@Input() idFamilyPackage: number;
	@Input() fromLegalModule: boolean = false;
	@Input() fromLegalizarStatus: boolean = false;
	 @Input() firstButtonLabel: string = 'Ver Documentos';
	@Input() secondButtonLabel: string = 'Ver Certificado';
	@Output() firstButtonClick = new EventEmitter<number>();
	@Output() secondButtonClick = new EventEmitter<number>(); 
	@Input() progressValue: number = 0;

	stateColor: string;
	isLoading = false;
	contenidoHTML: string = '';
	/* 	@Input() statusColor: string;
	 */ isMigrationEnabled: boolean = false;

	@Input() statusColor: { textColor: string; backgroundColor: string } = {
		textColor: '#000000',
		backgroundColor: 'rgba(0, 0, 0, 0.2)'
	};

	private loadingModalRef: NgbModalRef | null = null;
	beneficiariesUsed: number | null = null;
	beneficiariesMax: number | null = null;
	isCountsLoading = false;

	constructor(
		private router: Router,
		private dataSharingService: DataSharingService,
		private treeService: TreeService,
		private pdfService: PdfService,
		private http: HttpClient,
		private modal: NgbModal,
		private beneficiaryService: BeneficiaryService
	) {}

	ngOnInit(): void {
		console.log('idFamilyPackage', this.idFamilyPackage);
		this.updateMigrationButtonState();
		this.loadBeneficiaryCounts();
		/* 		this.cargarHTMLExterno();
		 */
	}
	/* cargarHTMLExterno(): void {
		this.http.get('assets/archivo.html', { responseType: 'text' })
			.subscribe({
				next: (data) => this.contenidoHTML = data,
				error: (err) => console.error('Error al cargar el archivo HTML:', err)
			});
	} */
	formatDate(dateString: string): string {
		const [datePart] = dateString.split(' ');
		const [year, month, day] = datePart.split('-');
		return `${day}/${month}/${year}`;
	}

	 onFirstButtonClick() {
		this.firstButtonClick.emit(this.id); 
	  }
	  
	  onSecondButtonClick() {
		this.secondButtonClick.emit(this.id);
	  } 
	  

	onCronogramaClick() {
		this.router.navigate([`/profile/partner/my-products/details/${this.id}`], {});
	}

	public onDocumentoClick(membershipType: string) {
		const dateOnly = this.date.split(' ')[0];
		this.router.navigate([`/profile/partner/my-products/documents/${this.idFamilyPackage}/${this.id}`], {
			queryParams: {
				date: dateOnly
			}
		});
	}

	private updateMigrationButtonState(): void {
		this.isMigrationEnabled = this.subscriptionStatus === 'ACTIVO';
	}

	onMigrationClick(): void {
		if (this.isMigrationEnabled) {
			this.router.navigate(['/profile/partner/my-products/migration'], {
				queryParams: { id: this.idPackageDetail, idsus: this.id }
			});
		}
	}

	onReleasePointsClick(): void {
		this.router.navigate(['/profile/partner/my-products/release-points', this.id], {});
	}

	onLegalizarClick(): void {
		this.router.navigate(['/profile/partner/my-legalization/legalization-panel']);
	}

	onBeneficiariosClick(){
		this.router.navigate([`/profile/ambassador/account/beneficiary-data`], {queryParams: {sid: this.id}});
	}

	private loadBeneficiaryCounts(): void {
		if (!this.id || !this.idPackageDetail) return;

		this.isCountsLoading = true;

		forkJoin({
			people: this.beneficiaryService.getBeneFiciariesBySubscriptionId(this.id),
			detail: this.beneficiaryService.getPackageById(this.idPackageDetail)
			})
			.pipe(finalize(() => (this.isCountsLoading = false)), take(1))
			.subscribe(({ people, detail }: any) => {
			this.beneficiariesUsed = (people?.data ?? []).length;
			this.beneficiariesMax  = Number(detail?.numberBeneficiaries) || 0;
			});
	}

	get hasCounts(): boolean {
		return this.beneficiariesUsed != null && this.beneficiariesMax != null;
	}
	get isFull(): boolean {
		return this.hasCounts && this.beneficiariesUsed! >= this.beneficiariesMax!;
	}
	get hasAvailable(): boolean {
		return this.hasCounts && this.beneficiariesUsed! < this.beneficiariesMax!;
	}
}
