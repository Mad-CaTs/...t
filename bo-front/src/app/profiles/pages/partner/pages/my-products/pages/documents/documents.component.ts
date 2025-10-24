import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DocumentService } from './commons/services/documents-service';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { TABS } from './commons/constants';
import { INavigation } from '@init-app/interfaces';
import { Location } from '@angular/common';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { DocumentDetailItemComponent } from './commons/components/document-detail-card/components/document-detail-item/document-detail-item.component';
import { MatIconModule } from '@angular/material/icon';
import { DocumentCardComponent } from './commons/components/document-card/document-card.component';
import { ModalDocumentosComponent } from './commons/modals/modal-documentos/modal-documentos.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DocumentDetailCardComponent } from './commons/components/document-detail-card/document-detail-card.component';
import { CardDocumentsComponent } from './pages/validate-documents/commons/components/card-documents/card-documents.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LegalDocumentPackage } from '@shared/interfaces/legal-document-package';

@Component({
	selector: 'app-documents',
	standalone: true,
	imports: [
		CommonModule,
		NavigationComponent,
		BreadcrumbComponent,
		MatIconModule,
		DocumentDetailCardComponent,
		DocumentCardComponent,
		ProgressSpinnerModule
	],
	templateUrl: './documents.component.html',
	styleUrl: './documents.component.scss'
})
export class DocumentsComponent {
	tabs: INavigation[] = TABS;
	currentTab: number = 1;
	currentView: 'products' | 'documents' = 'products';

	public documentLinks: string[] = [];

	public isState: boolean = true;
	public typeDocument: string;
	public date: string;
	public documents: any;
	isDisabled: boolean = true;
	public userInfo: any;
	/*   public documentLinks: [];
	 */ public userID: number;
	public suscriptionId: number;
	//public documentsAll: { name: string; link: string }[] = [];
	public documentsAll: LegalDocumentPackage;
	public isLoading: boolean = false;
	ref: DynamicDialogRef;
	products: any;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userInfoService: UserInfoService,
		private documentService: DocumentService,
		private location: Location,
		private dialogService: DialogService
	) {
		this.userInfo = this.userInfoService.userInfo;
		console.log("userInfoendetalelekey",this.userInfo)

	}

	ngOnInit(): void {
		console.log("userInfoendetalelekey1",this.userInfo)

		this.initializeSubscriptionId();
		this.initializeTypeDocument();
		this.getDocuments();
		this.loadStoredProducts();
	}

	private initializeSubscriptionId(): void {
		this.suscriptionId = Number(this.route.snapshot.paramMap.get('id'));
	}

	private initializeTypeDocument(): void {
		this.typeDocument = this.route.snapshot.paramMap.get('idFamilyPackage');
	}

	private loadStoredProducts(): void {
		const storedProducts = localStorage.getItem('products');
		if (storedProducts) {
			this.products = JSON.parse(storedProducts);
			const product = this.products.find((p) => p.id === this.suscriptionId);
			if (product) {
				this.typeDocument = product;
			}
		}
	}

	get navPosition() {
		const percentaje = this.isState ? '0%' : '100%';
		return `translateX(${percentaje})`;
	}

	breadcrumbItems = [
		{ label: 'Mis productos', action: () => this.goBack() },
		{ label: 'Documentos', isActive: true }
	];

	setTab(id: number): void {
		this.currentTab = id;
	}
	goBack() {
		this.location.back();
	}
	goLiberarPuntos() {
		this.currentView = 'products';
	}

	recibirData(data: any) {
  console.log('Data recibida desde hijo:', data);
  // Aquí puedes guardarla en una variable, procesarla, etc.
/*   this.dataApi = data;
 */}


	getDocuments(): void {
		const idFamily = +this.typeDocument;
		const idPackage = 2;
		const idSubscription = +this.suscriptionId;
		this.isLoading = true;
		this.documentService.getLegalDocumentPackage(idSubscription).subscribe({
			next: (response) => {
				this.documentsAll = response;
				this.isLoading = false;
			}
		});

		
		//this.documentService.getDocuments(idFamily, idPackage, idSubscription).subscribe({
		//	next: (response) => {
		//		const linksString = response.data[0];

		//		const links =
		//			linksString.replace(/[\[\]]/g, '').match(/https?:\/\/[^\s,]*(?:\s[^\s,]*)*/g) || [];

		//		const sanitizedLinks = links.map((link) => link.replace(/\s/g, '%20'));

		//		console.log('Enlaces separados:', sanitizedLinks);

		//		this.documentLinks = sanitizedLinks;
		//		this.processLinks(this.documentLinks);
		//		this.isLoading = false;
		//	},
		//	error: (error) => {
		//		console.error('Error al consumir el servicio:', error);
		//		this.isLoading = false;
		//	}
		//});
	}

	/*
	processLinks(links: string[]): void {
		const predefinedNames = [
			'Beneficios',
			'Codigo de Etica',
			'Contrato',
			'Beneficios Adicionales',
			'Cronograma Pagos',
			'Pagaré',
			'Contrato RCI'
		];
		const predefined2Names = [
			'benefitplan',
			'codeofethic',
			'contracto',
			'AdditionalBenefit',
			'PaymentSchedule',
			'PromissoryNote',
			'rci'
		];
		const basePath = 'https://s3.us-east-2.amazonaws.com/backoffice.documents/contratos/';

		links.forEach((link) => {
			let found = false;

			// Remove the basePath if it exists
			let cleanLink = link.startsWith(basePath) ? link.replace(basePath, '') : link;

			const lowerCaseLink = cleanLink.toLowerCase();

			// Special case: If "ContractLaJoya" is found, map to "Cronograma Pagos"
			if (lowerCaseLink.includes('contractlajoya')) {
				this.documentsAll.push({ name: 'Cronograma Pagos', link });
				found = true;
			}
			// Special case: If "contrato" is found, map to "Contrato"
			else if (lowerCaseLink.includes('contrato')) {
				this.documentsAll.push({ name: 'Contrato', link });
				found = true;
			}
			// Normal predefined mappings
			else {
				for (let i = 0; i < predefined2Names.length; i++) {
					if (lowerCaseLink.includes(predefined2Names[i].toLowerCase())) {
						this.documentsAll.push({ name: predefinedNames[i], link });
						found = true;
						break;
					}
				}
			}

			if (!found) {
				console.log(`No se encontró coincidencia para el enlace: ${link}`);
			}
		});
	}

	extractNameFromLink(link: string): string {
		const parts = link.split('/');
		const fileName = parts[parts.length - 1];
		return fileName.split('.')[0];
	}
  */
	/*-------------------------sin uso hasta que se implemente flujo de  firma digital*/
	openModal() {
		this.ref = this.dialogService.open(ModalDocumentosComponent, {
			width: '35vw',
			contentStyle: { 'max-height': '500px', overflow: 'auto' },
			baseZIndex: 10000,
			closable: false
		});
	}
}
