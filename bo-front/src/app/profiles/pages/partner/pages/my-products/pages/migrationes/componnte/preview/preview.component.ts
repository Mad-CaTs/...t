import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TableModule } from 'primeng/table';
import { MigrationService } from '../../pages/commons/services/migration-service.service';
import { IMigrationDetail, ISimulationData } from '../../commons/interfaces/migration.interface';
import MyProductDetailComponent from '../../../details/details.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalProdtsDetailComponent } from '../../../../commons/modals/modal-prodts-detail/modal-prodts-detail';
import { DataSchedules } from '../../../../commons/interfaces/pay-fee.interface';
import { ISelectedMembershipIds } from '../../pages/commons/interfaces/Migration.interface';
import { TableComponent } from '@shared/components/table/table.component';
import { Location } from '@angular/common';
import ModalDeteilMigrationComponent from '../../pages/commons/modals/modal-deteil-migration-package/modal-deteil-migration-package';
import { PackagePortfolioSharingService } from '../../pages/commons/services/pakage-portafolio-sharingService.service';

@Component({
	selector: 'app-preview',
	standalone: true,
	imports: [MyProductDetailComponent, CommonModule, MatIconModule, TableModule, TableComponent],
	templateUrl: './preview.component.html',
	styleUrl: './preview.component.scss'
})
export default class PreviewComponent {
	@Input() option: {
		idOption: any;
		migrationDetail: IMigrationDetail;
	};
	@Output() closePreview = new EventEmitter<void>();
	data: any[] = [];
	/* 	data: ISimulationData[] = [];
	 */ isLoading: boolean = false;
	@Input() isPreviewVisible: boolean;
	firstMembershipName: string;
	quotasCount: number;
	formattedCreationDate: string;
	formattedMigrateDate: string;
	@Input() membershipIds!: ISelectedMembershipIds;
	selectedPackageDetail: any;
	@Input() currentTab!: number;
	constructor(
		private migrationService: MigrationService,
		private dialogService: DialogService,
		private location: Location,
		private packagePortfolioSharingService: PackagePortfolioSharingService
	) {}

	ngOnInit() {
		this.selectedPackageDetail = this.packagePortfolioSharingService.getSelectedPackageData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['membershipIds'] && this.membershipIds) {
			const { idSus, idPackage, idPackageDetail } = this.membershipIds;
			this.getSimulationData(idSus, idPackage, idPackageDetail);
		}
	}

	get firstWordPackageName(): string {
		if (!this.selectedPackageDetail?.name) return '';
		const words = this.selectedPackageDetail.name.split(' ');
		return words.slice(0, 2).join(' ');
	}

	/* 	checkAndLoadTableData() {
		
		 	if (this.option && this.option.migrationDetail) {
			const { idSuscription, idPackageNew, idPackageDetailNew, creationDate, migrateDate } =
				this.option.migrationDetail;
			const idOption = this.option.idOption;
			this.extractFirstMembershipName(this.option.migrationDetail.membershipPackageToMigrate);
			this.formattedCreationDate = this.formatDate(creationDate);
			this.formattedMigrateDate = this.formatDate(migrateDate);
			this.getSimulationData(idSuscription, idPackageNew, idPackageDetailNew);
		} 
	} */

	formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('es-PE');
	}

	get todayDate(): string {
		const today = new Date();
		const day = String(today.getDate()).padStart(2, '0');
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const year = today.getFullYear();
		return `${day}/${month}/${year}`;
	}

	/* 
	extractFirstMembershipName(membershipPackage: string) {
		if (membershipPackage) {
			this.firstMembershipName = membershipPackage.split(' ')[0];
		}
	} */

	getSimulationData(idSuscription: number, idPackageNew: number, idPackageDetailNew: number) {
		this.isLoading = true;

		this.migrationService.getPreviewMigration(idSuscription, idPackageNew, idPackageDetailNew).subscribe({
			next: (response) => {
				this.isLoading = false;
				if (Array.isArray(response) && response.length > 0) {
					this.data = response;
					this.countQuotas();
				} else {
					console.warn('⚠️ La respuesta no contiene datos válidos:', response);
				}
			},
			error: (err) => {
				this.isLoading = false;
				console.error('❌ Error al obtener simulación:', err);
			}
		});
	}

	countQuotas() {
		this.quotasCount = this.data.filter((item) => /N°/.test(item.quoteDescription)).length;
	}

	close() {
		this.closePreview.emit();
	}

	goBack() {
		this.location.back();
	}

	openModalDeteilMigration(element: any) {
		const firstPendingIndex = this.data.findIndex((item: any) => item.idStatePayment === 0);
		let canContinue = false;
		if (firstPendingIndex !== -1 && this.data[firstPendingIndex] === element) {
			canContinue = true;
		}

		const modalData = {
			element: element,
			hideFields: true,
			cronograma: this.data,
			canContinue,
			selectedPackage: this.selectedPackageDetail,
			currentTab: this.currentTab
		};
		const ref = this.dialogService.open(ModalDeteilMigrationComponent, {
			header: 'Detalle',
			width: '50vw',
			data: modalData
		});
		ref.onClose.subscribe((result: any) => {});
	}
}
