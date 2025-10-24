import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { AccordionModule } from 'primeng/accordion';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PackagePortfolioSharingService } from '../commons/services/pakage-portafolio-sharingService.service';
import { MigrationService } from '../commons/services/migration-service.service';
import { IModalAlertData } from '../commons/interfaces/Migration.interface';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
	selector: 'app-migration-portafolios',
	standalone: true,
	imports: [TableModule, CommonModule, RadiosComponent, AccordionModule],
	templateUrl: './migration-portafolios.component.html',
	styleUrl: './migration-portafolios.component.scss'
})
export default class MigrationPortafoliosComponent implements OnInit {
	availablePortafolios: any[] = [];
	@Input() idPackageDetail: number;
	@Input() idSus: number;
	form: FormGroup;
	isLoading: boolean = false;
	selectedPortfolio: any;
	selectedPaymentData: any;
	currentTab: number = 2;
	migrationDetail: any;
	selectdedPakage: any;

	constructor(
		private migrationService: MigrationService,
		private fb: FormBuilder,
		private location: Location,
		private packagePortfolioSharingService: PackagePortfolioSharingService,
		private route: ActivatedRoute,
		private router: Router,
		private dialogService: DialogService
	) {
		this.form = this.fb.group({
			packageDetailId: [null]
		});
	}

	ngOnInit(): void {
		this.retrieveQueryParams();
	}

	retrieveQueryParams() {
		this.route.queryParams.subscribe((params) => {
			this.idPackageDetail = +params['id'];
			this.idSus = +params['idsus'];
			this.loadAvailablePortafolios(this.idPackageDetail);
		});
	}

	private loadAvailablePortafolios(id: number): void {
		this.isLoading = true;
		this.migrationService.getAvailablePortafolios(id).subscribe({
			next: (response) => {
				this.availablePortafolios = response.data;
				this.isLoading = false;

				if (!this.availablePortafolios[0]?.packageList?.length) {
					this.isLoading = false;
					alert(
						'No se puede realizar la migración de portafolios. La suscripción actual es la más alta disponible.'
					);
					this.location.back();
				}
			},
			error: (error) => {
				console.error('Error al cargar paquetes disponibles:', error);
			}
		});
	}

	onPackageSelection(val: any) {
		const selectedPackage = this.findPortfolioById(val);
		if (selectedPackage) {
			this.selectdedPakage = selectedPackage;
			this.packagePortfolioSharingService.setSelectedPackageData(this.selectdedPakage);
		}
	}

	onClickButton() {
		if (!this.selectdedPakage) {
			this.showModalAlert({
				title: 'Seleccionar paquete',
				message: 'Debe seleccionar el paquete al cual desea migrar.',
				type: 'warning',
				icon: 'pi pi-exclamation-triangle'
			});
			return;
		}

		const packageDetail =
			this.selectdedPakage.packageDetail && this.selectdedPakage.packageDetail.length > 0
				? this.selectdedPakage.packageDetail[0]
				: null;

		if (packageDetail) {
			this.router.navigate([
				'/profile/partner/my-products/simulador-cronograma',
				{
					idSus: this.idSus,
					idPackageDetail: packageDetail.idPackageDetail,
					idPackage: this.selectdedPakage.idPackage,
					currentTab: this.currentTab
				}
			]);
		}
	}

	private findPortfolioById(id: number): any {
		for (const family of this.availablePortafolios) {
			const foundPackage = family.packageList.find((p) => p.idPackage === id);
			if (foundPackage) {
				return foundPackage;
			}
		}
		return null;
	}
/* 	goBack(): void {
		this.router.navigate(['/profile/partner/my-products/migration-payment'], {
			queryParams: { currentTab: this.currentTab }
		});
	} */

	private showModalAlert(data: IModalAlertData, onCloseCallback?: () => void): void {
		const ref = this.dialogService.open(ModalAlertComponent, {
			data: {
				message: data.message,
				type: data.type,
				title: data.title,
				icon: data.icon
			}
		});

		ref.onClose.subscribe(() => {
			if (onCloseCallback) onCloseCallback();
		});
	}

	 
	goBack(): void {
		this.location.back();
	} 
}
