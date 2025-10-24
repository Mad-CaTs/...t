import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MigrationService } from '../commons/services/migration-service.service';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { MIGRATION_TABS } from 'src/app/profiles/pages/ambassador/pages/store/commons/constants';
import { Location } from '@angular/common';
import { INavigation } from '@init-app/interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { NewPartnerPaymentComponent } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-payment/new-partner-payment.component';
import { NewPartnerFormPresenter } from 'src/app/profiles/pages/ambassador/pages/new-partner/new-partner.presenter';
import { PackagePortfolioSharingService } from '../commons/services/pakage-portafolio-sharingService.service';
import {
	IAvailablePackages,
	IModalAlertData,
	IPackageDetail
} from '../commons/interfaces/Migration.interface';
import MigrationPortafoliosComponent from '../migration-portafolios/migration-portafolios.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
	selector: 'app-migration-package',
	standalone: true,
	imports: [
		CommonModule,
		RadiosComponent,
		MatCheckboxModule,
		NgbAccordionModule,
		NavigationComponent,
		TableModule,
		PanelModule,
		FormsModule,
		MigrationPortafoliosComponent,
		NewPartnerPaymentComponent
	],
	providers: [DialogService, NewPartnerFormPresenter],
	templateUrl: './migration-package.component.html',
	styleUrl: './migration-package.component.scss'
})
export default class MigrationPackageComponent implements OnInit {
	form: FormGroup;
	idPackageDetail: number;
	idSus: number;
	availablePackages: IAvailablePackages[] = [];
	@Output() prevState = new EventEmitter<void>();
	tabs: INavigation[] = MIGRATION_TABS;
	currentTab: number = 1;
	selectdedPakage: any;
	selectdedPakageId: number;
	isLoading: boolean = false;
	@Input() residenceContry;
	selectedPaymentData: any;
	packageDeteil: IPackageDetail[] = [];
	migrationDetail: any;
	selectedPackage: any;

	constructor(
		private fb: FormBuilder,
		private route: ActivatedRoute,
		private migrationService: MigrationService,
		private location: Location,
		private packagePortfolioSharingService: PackagePortfolioSharingService,
		public presenter: NewPartnerFormPresenter,
		private router: Router,
		private dialogService: DialogService
	) {
		this.form = this.fb.group({
			packageDetailId: ['']
		});
	}

	ngOnInit(): void {
		this.retrieveQueryParams();
	}

	getForm(form: string) {
		return this.presenter.multiStepForm.controls[form];
	}
	goBack(): void {
		this.location.back();
	}

	setTab(id: number): void {
		this.currentTab = id;
	}

	private retrieveQueryParams(): void {
		this.route.queryParamMap.subscribe((params) => {
			this.idPackageDetail = +params.get('id');
			this.idSus = +params.get('idsus');

			if (this.idPackageDetail) {
				this.loadAvailablePackages(this.idPackageDetail);
			}
		});
	}

	private loadAvailablePackages(id: number): void {
		this.isLoading = true;
		this.migrationService.getAvailablePackages(id).subscribe({
			next: (response) => {
				this.availablePackages = [response.data];
				this.isLoading = false;
				if (!this.availablePackages[0]?.packageList?.length) {
					this.isLoading = false;
					this.showMigrationAlert();

					/* 	alert(
						'No se puede realizar la migración. La suscripción actual es la más alta disponible y solo se permiten migraciones de paquetes de menor a mayor.'
					);
					this.router.navigate(['/profile/partner/my-products']); */
				}
			}
		});
	}

	/* 	private showMigrationAlert(): void {
		this.showModalAlert(
			'Migración no disponible',
			'No se puede realizar la migración. La suscripción actual es la más alta disponible y solo se permiten migraciones de paquetes de menor a mayor.',
			'warning',
			() => this.router.navigate(['/profile/partner/my-products'])
		);
	} */

	private showMigrationAlert(): void {
		this.showModalAlert(
			{
				message:
					'No se puede realizar la migración. La suscripción actual es la más alta disponible y solo se permiten migraciones de paquetes de menor a mayor.',
				title: 'Migración no disponible',
				type: 'warning',
				icon: 'pi pi-exclamation-triangle'
			},
			() => this.router.navigate(['/profile/partner/my-products'])
		);
	}

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

	onPackageSelection(val: any) {
		const selectedPackage = this.findPackageById(val);
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

	private findPackageById(id: number): any {
		for (const family of this.availablePackages) {
			const foundPackage = family.packageList.find((p) => p.idPackage === id);
			if (foundPackage) {
				return foundPackage;
			}
		}
		return null;
	}
}
