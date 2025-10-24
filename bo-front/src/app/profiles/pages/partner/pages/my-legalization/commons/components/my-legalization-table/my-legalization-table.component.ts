import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { TableComponent } from '@shared/components/table/table.component';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { Router } from '@angular/router';
import { EmailShippingTablePresenter } from 'src/app/profiles/pages/ambassador/pages/email-shipping/email-shipping.presenter';
import { MatIconModule } from '@angular/material/icon';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalLegalizationRequest } from '../../modals/modal-legalization-request/modal-legalization-request';
import { ModalLegalizationSource } from '../../modals/modal-legalization-source/modal-legalization-source';
import { BorderedTableComponent } from '@shared/components/bordered-table/bordered-table.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DocumentService } from '../../../../my-products/pages/documents/commons/services/documents-service';
import { firstValueFrom, map } from 'rxjs';
import { LegalizationService } from '../../services/legalization.service';

@Component({
	selector: 'app-my-legalization-table',
	standalone: true,
	imports: [
		CommonModule,
		InputComponent,
		TableComponent,
		PaginationNgPrimeComponent,
		MatIconModule,
		BorderedTableComponent
	],
	providers: [EmailShippingTablePresenter],
	templateUrl: './my-legalization-table.component.html'
})
export class MyLegalizationTableComponent implements OnInit {
	form: FormGroup;
	rows: number = 10;
	public totalRecords: number = 0;
	currentPage: number = 1;
	align: string = 'center';
	public first: number = 0;
	public id: string = '';
	userInfoId: any;
	filteredData: any[] = [];
	states: { idState: number; nameState: string; colorRGB: string; value: number }[] = [];
	loadingRows: { [key: number]: boolean } = {};
	loadingMap: { [key: number]: boolean } = {};

	constructor(
		private emailShippingTablePresenter: EmailShippingTablePresenter,
		private router: Router,
		public tableService: TablePaginationService,
		private dialogService: DialogService,
		private userInfoService: UserInfoService,
		private documentService: DocumentService,
		private legalizationService: LegalizationService
	) {
		this.userInfoId = this.userInfoService.userInfo.id;
	}

	ngOnInit(): void {
		this.form = this.emailShippingTablePresenter.form;
		this.initData();
	}

	users: any[] = [];
	paginatedUsers: any[] = [];

	initData(): void {
		this.getSuscripciones();
		this.getEstados();
	}

	getSuscripciones(): void {
		const storedProducts = localStorage.getItem('products');
		if (storedProducts) {
			this.filteredData = JSON.parse(storedProducts);
			console.log('Suscripciones desde localStorage:', this.filteredData);
		} else {
			console.warn('No hay productos guardados en localStorage.');
			this.filteredData = [];
		}
	}
	getEstados(): void {
		const storedStates = localStorage.getItem('colors');
		if (storedStates) {
			this.states = JSON.parse(storedStates);
		} else {
			console.warn('No hay estados guardados en localStorage bajo "colors".');
			this.states = [];
		}
	}

	getStatusColorById(idStatus: number) {
		const state = this.states.find((s) => s.idState === idStatus);
		const colorHex = state ? state.colorRGB : '#000000';
		return {
			textColor: colorHex,
			backgroundColor: this.hexToRgba(colorHex, 0.2)
		};
	}

	hexToRgba(hex: string, alpha: number): string {
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	filterUsers(): void {
		this.currentPage = 1;
	}

	sendEmail(user: any): void {
		console.log('Enviar correo a:', user);
		this.router.navigate(['/profile/ambassador/email-shipping/email-shipping-type'], {
			state: { user }
		});
	}

	get headers() {
		const result = ['Membresía', 'Portafolio', 'N° de cuotas', 'Estado', 'Documentos', 'Legalizar'];
		return result;
	}

	get minWidthHeaders() {
		const result = [50, 50, 50, 100, 50, 50];
		return result;
	}

	openLegalizationRequestModal(element: any): void {
		const idSubscription = element.id;
		this.loadingRows[idSubscription] = true;

		this.documentService.getLegalDocumentPackage(idSubscription).subscribe(
			async (response) => {
				const packageData = response;
				const idFamily = response.idFamily;
				const listLegalDocuments = response.listLegalDocuments || [];

				const links: string[] = await Promise.all(
					listLegalDocuments.map(async (doc: any) => {
						const url = await firstValueFrom(
							this.getDocumentsLink$(idSubscription, doc.idLegalDocument, idFamily)
						).catch(() => '#');
						return url;
					})
				);

				listLegalDocuments.forEach((doc: any, index: number) => {
					doc.generatedLink = links[index];
				});

				this.loadingRows[idSubscription] = false;

				const ref = this.dialogService.open(ModalLegalizationRequest, {
					width: '50vw',
					styleClass: 'custom-modal-header position-relative',
					closable: false,
					data: {
						documentPackage: packageData
					}
				});

				ref.onClose.subscribe(() => {});
			},
			(error) => {
				console.error('Error al obtener el paquete legal:', error);
				this.loadingRows[idSubscription] = false;
			}
		);
	}

	getDocumentsLink$(idSubscription: number, idLegalDocument: number, idFamily: number) {
		return this.documentService.getDocumentsLink(idSubscription, idLegalDocument, idFamily, true).pipe(
			map((response: any) => {
							console.log('Response getDocumentsLink:', response);

				const linksString = response.data[0];
				const documentUrl =
					linksString.replace(/[\[\]]/g, '').match(/https?:\/\/[^\s,]*(?:\s[^\s,]*)*/g) || [];
				const sanitizedLinks = documentUrl.map((link: string) => link.replace(/\s/g, '%20'));
				return sanitizedLinks.length > 0 ? sanitizedLinks[0] : '#';
			})
		);
	}
	openLegalizationSourceModal(element: any): void {
		const id = element.id;
		this.loadingMap[id] = true;

		this.legalizationService.getDocumentCategories().subscribe({
			next: (opciones) => {
				this.loadingMap[id] = false;

				const ref = this.dialogService.open(ModalLegalizationSource, {
					width: '50vw',
					styleClass: 'custom-modal-header position-relative',
					closable: false,
					data: {
						payTypeList: opciones,
						selectedElement: element
					}
				});

				ref.onClose.subscribe(() => {});
			},
			error: (err) => {
				this.loadingMap[id] = false;
				console.error('Error al cargar opciones:', err);
			}
		});
	}
}
