import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { MIGRATION_TABS } from 'src/app/profiles/pages/ambassador/pages/store/commons/constants';
import { INavigation } from '@init-app/interfaces';
import { DialogService } from 'primeng/dynamicdialog';
import { Location } from '@angular/common';
import { MigrationOptionCardComponent } from '../../componnte/migration-option-card/migration-option-card.component';
import PreviewComponent from '../../componnte/preview/preview.component';
import { IMigrationDetail, IMigrationOption } from '../../commons/interfaces/migration.interface';
import { MigrationService } from '../commons/services/migration-service.service';
import ModalDeteilMigrationComponent from '../commons/modals/modal-deteil-migration-package/modal-deteil-migration-package';
import { ModalPlacementErrorComponent } from 'src/app/profiles/pages/ambassador/pages/tree/pages/placement/commons/modals/modal-placement-error/modal-placement-error.component';
import { catchError, EMPTY } from 'rxjs';
import { IModalAlertData, ISelectedMembershipIds } from '../commons/interfaces/Migration.interface';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
	selector: 'app-simulador-cronograma',
	standalone: true,
	imports: [MigrationOptionCardComponent, CommonModule, NavigationComponent, PreviewComponent],
	templateUrl: './simulador-cronograma.component.html',
	styleUrl: './simulador-cronograma.component.scss',
	providers: [DialogService]
})
export default class SimuladorCronogramaComponent implements OnInit {
	migrationOptions: IMigrationDetail[];
	isLoading = false;
	idSus!: number;
	idPackageDetail!: number;
	idPackage!: number;
	tabs: INavigation[] = MIGRATION_TABS;
	title = '';
	subtitle = '';
	currentTab!: number;
	/* 	selectedPaymentData: any;
	 */ selectedOptionId: number | null = null;
	isPreviewVisible = false;
	selectedPreviewOption!: IMigrationOption;
	selectedMembershipIds: ISelectedMembershipIds;

	constructor(
		private migrationService: MigrationService,
		private route: ActivatedRoute,
		private dialogService: DialogService,
		private location: Location,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.initializeRouteParams();
	}

	initializeRouteParams() {
		this.route.params.subscribe((params) => {
			this.idSus = Number(params['idSus']);
			const idPackageDetail = Number(params['idPackageDetail']);
			const idPackage = Number(params['idPackage']);
			this.currentTab = Number(params['currentTab']);
			this.selectedMembershipIds = {
				idSus: this.idSus,
				idPackageDetail,
				idPackage
			};
			if (this.currentTab !== undefined && this.currentTab !== null) {
				this.updateTexts();
				this.setTab(this.currentTab);
				/* ////////////////////HASTA HABILITAR VISTA OPCIONES */
				/* if (this.idSus && idPackageDetail && idPackage) {
					this.loadMigrationOptions(this.idSus, idPackageDetail, idPackage);
				} */
			}
			this.cdr.detectChanges();
		});
	}

	updateTexts() {
		if (this.currentTab === 1) {
			this.title = 'Migrar paquetes';
			this.subtitle = 'Verifique los datos del paquete o membresía a migrar';
		} else if (this.currentTab === 2) {
			this.title = 'Migrar portafolio';
			this.subtitle = 'Verifique los datos del portafolio o familia a migrar';
		}
	}

	setTab(selectedTab: number): void {
		if (selectedTab !== this.currentTab) {
			console.warn('⚠️ No se puede cambiar de pestaña en esta vista.');
			return;
		}
		this.currentTab = selectedTab;
		this.updateTexts();
	}

	loadMigrationOptions(idSus: number, idPackageDetail: number, idPackage: number): void {
		this.isLoading = true;
		this.migrationService.getMigrationDetail(idSus, idPackageDetail, idPackage).subscribe({
			next: (response) => {
				if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
					this.migrationOptions = response.data.filter((data: any) => data.idOption == 2);
				} else {
					this.showModalAlert({
						title: 'Seleccionar paquete',
						message: 'Debe seleccionar el paquete al cual desea migrar.',
						type: 'warning',
						icon: 'pi pi-exclamation-triangle'
					});
					return;
				}
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error en el registro:', error);
				this.showModalAlert({
					title: 'Error',
					message: 'Hubo un problema al obtener los datos. Por favor, intente nuevamente.',
					type: 'error',
					icon: 'pi pi-times-circle'
				});
				/* 				alert('Hubo un problema al obtener los datos. Por favor, intente nuevamente.');
				 */ this.isLoading = false;
			}
		});
	}

	onOptionSelected(selectedId: number) {
		this.selectedOptionId = selectedId;
	}

	showPreview(option: any) {
		this.selectedPreviewOption = option;
		this.isPreviewVisible = true;
	}

	hidePreview() {
		this.isPreviewVisible = false;
	}
	/* ---------------------------------FUNCION QUE SE USARA CUANDO SE IMPLEMENTE LA VISTA DE OPCIONES  */
	/* 	onClickButton() {
		if (this.selectedOptionId) {
			this.openModalDeteilMigration();
		} else {
			alert('Debe seleccionar una opción ');
		}
	}

	openModalDeteilMigration() {
		const modalData = {
			selectedPackage: this.selectedOptionId,
			deteilMigration: this.migrationOptions,
			idSus: this.idSus,
			currentTab: this.currentTab
		};

		const ref = this.dialogService.open(ModalDeteilMigrationComponent, {
			header: 'Detalle',
			width: '50vw',
			data: modalData
		});
		ref.onClose.subscribe((result: any) => {
			
		});
	} */
	//////////* //////////////////////////////////////////////////// */

	onClickButton() {
		if (!this.selectedMembershipIds) {
			console.warn('⚠️ No hay membershipIds aún, no se abrirá el preview');
			return;
		}
		this.isPreviewVisible = true;
	}

	goBack() {
		if (this.currentTab >= 1) {
			this.location.back();
		}
	}

	private showModalAlert(data: IModalAlertData, onCloseCallback?: () => void): void {
		const ref = this.dialogService.open(ModalAlertComponent, {
			header: data.title,
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
}
