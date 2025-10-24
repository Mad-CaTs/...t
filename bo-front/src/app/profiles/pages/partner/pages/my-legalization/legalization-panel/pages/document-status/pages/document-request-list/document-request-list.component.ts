import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CardProductComponent } from 'src/app/profiles/pages/partner/pages/my-products/pages/product/commons/components/card-product/card-product.component';
import { getStatusColor } from '../../commons/constans';
import { LegalizationRequestService } from '../../commons/services/legalization-request-service';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-document-request-list',
	standalone: true,
	imports: [CommonModule, CardProductComponent, MatIconModule, ProgressSpinnerModule],
	templateUrl: './document-request-list.component.html',
	styleUrl: './document-request-list.component.scss'
})
export class DocumentRequestListComponent implements OnInit {
	public filteredDocuments: any[] = [];
	idUsuario: number;
	messageError: string | null = null;
	isLoading: boolean = false;
	@Output() documentsLoaded = new EventEmitter<any[]>();

	getStatusColor = getStatusColor;

	constructor(
		private legalizationRequestService: LegalizationRequestService,
		private router: Router,
		private userInfoService: UserInfoService
	) {
		this.idUsuario = this.userInfoService.userInfo?.id;
	}

	ngOnInit(): void {
		this.loadUserRequests();
	}

	private loadUserRequests(): void {
		this.isLoading = true;

		this.legalizationRequestService.getUserDocumentsGrouped(this.idUsuario).subscribe({
			next: (response) => {
				this.isLoading = false;
				const documents = response.data?.documents ?? [];
				if (documents.length > 0) {
					this.filteredDocuments = documents;
					this.messageError = null;
				} else {
					this.filteredDocuments = [];
					this.messageError = 'No se encontraron datos para esta información.';
				}

				this.documentsLoaded.emit(this.filteredDocuments);
			},
			error: (err) => {
				this.isLoading = false;

				this.filteredDocuments = [];
				this.messageError = err?.error?.message || 'Ocurrió un error al obtener los documentos.';
				this.documentsLoaded.emit([]);
			}
		});
	}

	handleVerDocumentos(doc: any) {
		console.log("doc",doc)
		const documentKey = doc.documentKey;
		this.router.navigate(['/profile/partner/my-legalization/document-status-detail', documentKey]);
	}

	handleVerCertificado(doc: any) {
		console.log('Ver certificado del item:', doc);
	}
}
