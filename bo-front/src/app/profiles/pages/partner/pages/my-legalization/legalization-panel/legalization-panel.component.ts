import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LegalizationComponent } from './pages/legalization/pages/legalization/legalization.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ITabs } from 'src/app/profiles/commons/interface';
import TabProfilesComponent from 'src/app/profiles/commons/components/tab-profiles/tab-profiles.component';
import { getPanelTabs } from '../commons/constants';
import { LegalizationService } from '../commons/services/legalization.service';
import { DocumentService } from '../../my-products/pages/documents/commons/services/documents-service';
import { LegalDocument, LegalDocumentPackage } from '@shared/interfaces/legal-document-package';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Location } from '@angular/common';
import { LegalizationRequestService } from './pages/document-status/commons/services/legalization-request-service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DocumentStatusComponent } from './pages/document-status/document-status.component';

@Component({
	selector: 'app-legalization-panel',
	standalone: true,
	imports: [
		CommonModule,
		LegalizationComponent,
		DocumentStatusComponent,
		TabProfilesComponent,
		LoaderComponent,
		BreadcrumbComponent
	],
	templateUrl: './legalization-panel.component.html',
	styleUrl: './legalization-panel.component.scss'
})
export default class LegalizationPanelComponent {
	currentTab: number = 1;
	profileTabs: ITabs[] = [];
	packageId!: string | null; // o `number | null` si lo conviertes luego
	legalizationData: LegalDocumentPackage | null = null;
	groupedDocuments: any = null;
	filteredDocuments: any[] = [];
	isLoading: boolean = false;
	tipoLabel: any;
	public selectedProduct: any;
	breadcrumbItems: { label: string; action?: () => void; isActive?: boolean }[] = [];
	public userInfo: any;
	constructor(
		private dialogService: DialogService,
		private route: ActivatedRoute,
		private router: Router,
		private documentService: DocumentService,
		private location: Location,
		private legalizationRequestService: LegalizationRequestService,
		private userInfoService: UserInfoService
	) {
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnInit(): void {
		this.packageId = this.route.snapshot.paramMap.get('id');
		this.selectedProduct = JSON.parse(sessionStorage.getItem('selectedProduct') || '{}');
		this.setBreadcrumbItems();
		if (this.packageId) {
			this.getGroupedLegalizationData(+this.packageId);
		}
		this.initPanelTabs();
		this.initTabFromQueryParams();
	}

	private setBreadcrumbItems(): void {
		this.tipoLabel = this.selectedProduct?.tipo === 1 ? 'Certificados' : 'Contratos';
		this.breadcrumbItems = [
			{
				label: 'Legalización',
				action: () => this.router.navigate(['/profile/partner/my-legalization'])
			},
			{ label: this.tipoLabel, isActive: true }
		];
	}

	goBack() {
		this.location.back();
	}

	private initPanelTabs(): void {
		this.profileTabs = getPanelTabs(this.setTab.bind(this));
	}

	private initTabFromQueryParams(): void {
		const tabParam = this.route.snapshot.queryParamMap.get('tab');
		const tabFromQuery = Number(tabParam);
		this.currentTab = tabParam && (tabFromQuery === 1 || tabFromQuery === 2) ? tabFromQuery : 1;
		this.profileTabs = this.profileTabs.map((tab, index) => ({
			...tab,
			isActive: index === this.currentTab - 1
		}));
	}

	setTab(id: number): void {
		this.currentTab = id;
		this.profileTabs = this.profileTabs.map((tab, index) => ({
			...tab,
			isActive: index === id - 1
		}));
		this.router.navigate([], {
			relativeTo: this.route,
			queryParams: { tab: id }
		});
	}

	getGroupedLegalizationData(idSubscription: number): void {
		this.isLoading = true;
		this.documentService.getGroupedLegalDocuments(idSubscription).subscribe({
			next: (data) => {
				this.legalizationData = data;
				if (this.selectedProduct?.tipo === 1) {
					this.filteredDocuments = this.ordenarPorIdLegal(data.certificados || []);
				} else if (this.selectedProduct?.tipo === 2) {
					this.filteredDocuments = this.ordenarPorIdLegal(data.contratos || []);
				} else {
					this.filteredDocuments = [];
				}
				this.isLoading = false;
			},
			error: (error) => {
				console.error('❌ Error al obtener los documentos legales:', error);
				this.isLoading = false;
			}
		});
	}

	private ordenarPorIdLegal(documents: LegalDocument[]): LegalDocument[] {
		return [...documents].sort((a, b) => a.idLegalDocument - b.idLegalDocument);
	}
}
