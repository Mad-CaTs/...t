import { ChangeDetectorRef, Component, Input } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import type { IPackageDetailDto } from '@interfaces/api';

import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PackagesApiService } from '@app/core/services/api/manage-business/packages-api.service';
import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */

import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITableDetailPackage } from '@interfaces/manage-business.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';
import { PackageDetailAdministratorService } from '@app/manage-business/services/PackageDetailAdministratorService';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';

@Component({
	selector: 'app-modal-detail-create',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-detail-create.component.html',
	styleUrls: ['./modal-detail-create.component.scss']
})
export class ModalDetailCreateComponent {
	@Input() id: number = 0;
	@Input() currentVersion: String;
	@Input() familyPackageOptions: ISelectOpt[] = [];
	packageOptions: ISelectOpt[] = [];

	public form: FormGroup;
	public loading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private toastManager: ToastService,
		private modalManager: NgbModal,
		private cdr: ChangeDetectorRef,
		private packageService: PackageAdministratorService,
		private packageDetailService: PackageDetailAdministratorService,
		private membershipVersionService: MembershipVersionAdministratorService
	) {
		this.form = builder.group({
			family: ['1', [Validators.required]],
			package: ['', [Validators.required]],
			lastVersion: ['', [Validators.required]],
			months: ['', [Validators.required, Validators.min(1)]],
			price: ['', [Validators.required, Validators.min(1)]],
			cuotes: ['', [Validators.required, Validators.min(1)]],
			initialPrice: ['', [Validators.required, Validators.min(1)]],
			cuotePrice: ['', [Validators.required, Validators.min(2)]],
			volume: ['', [Validators.required, Validators.min(1)]],
			cuoteN: ['', [Validators.required, Validators.min(1)]],
			comission: ['', [Validators.required, Validators.min(0)]],
			accionsN: ['', [Validators.required, Validators.min(1)]],
			interCuote: ['', [Validators.required, Validators.min(1)]],
			points: ['', [Validators.required, Validators.min(0)]],
			pointsFree: ['', [Validators.required, Validators.min(1)]],
			freePointStatus: [true]
		});

		this.form.get('lastVersion')?.disable();
	}

	ngOnInit(): void {
		this.form.get('family')?.valueChanges.subscribe(() => {
			this.loadPackages();
		});

		this.loadPackages();

		this.cdr.detectChanges();
	}

	private loadPackages() {
		const currentFamily = this.form.get('family')?.value;

		if (currentFamily) {
			this.packageService
				.getPackagesByIdFamilyPackage(currentFamily)
				.pipe(
					map((response) =>
						response.map((item) => ({
							id: String(item.idPackage),
							text: item.name
						}))
					)
				)
				.subscribe(
					(packageOptions: ISelectOpt[]) => {
						this.packageOptions = packageOptions;
					},
					(error) => {
						console.error('Error al cargar los paquetes:', error);
					}
				);

			this.membershipVersionService
				.getLastMembershipVersionByFamilyPackage(currentFamily.toString())
				.subscribe(
					(data) => {
						if (data) {
							const lastVersion = data.idMembershipVersion;
							this.form.get('lastVersion')?.setValue(lastVersion);
							this.cdr.detectChanges();
						} else {
							console.error('No se encontró la última versión de membresía');
						}
					},

					(error) => {
						console.error('Error al obtener la última versión de membresía:', error);
					}
				);
		}
	}

	/* === Events === */
	public onSubmit() {
		const raw = this.form.getRawValue();
		const idFamily = this.form.get('family')?.value;
		const idPackage = this.form.get('package')?.value;
		const body = {
			idPackage: idPackage,
			monthsDuration: Number(raw.months),
			price: Number(raw.price),
			numberQuotas: Number(raw.cuotes),
			initialPrice: Number(raw.initialPrice),
			quotaPrice: Number(raw.cuotePrice),
			volume: Number(raw.volume),
			numberInitialQuote: Number(raw.cuoteN),
			comission: Number(raw.comission),
			numberShares: Number(raw.accionsN),
			idFamilyPackage: idFamily,
			idMembershipVersion: Number(raw.lastVersion),
			membershipMaintenance: 0,
			isSpecialFractional: false,
			points: Number(raw.points),
			pointsToRelease: Number(raw.pointsFree),
			installmentInterval: Number(raw.interCuote),
			canReleasePoints: raw.freePointStatus == true
		};

		console.log('datos a enviar CREAR', body);

		this.loading = true; // Muestra el indicador de carga

		this.packageDetailService.createPackageDetail(body).subscribe({
			next: (response) => {
				if (response.status === 200) {
					this.instanceModal.close();

					const ref = this.modalManager.open(ModalConfirmationComponent, {
						centered: true,
						size: 'md'
					});
					const modal = ref.componentInstance as ModalConfirmationComponent;

					modal.body = 'Se actualizó el detalle del paquete exitosamente.';
					modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
					modal.title = 'Éxito';
				}
			},
			error: (error) => {
				if (error.status === 409) {
					this.toastManager.addToast('Ya existe un Detalle con ese Paquete y Versión', 'warning');
					this.instanceModal.close();
				} else {
					console.error('Error:', error);
					this.toastManager.addToast('Ocurrió un error al crear el PackageDetail.', 'error');
					this.instanceModal.close();
				}
			}
		});
	}

	/* === Getters === */
	get title() {
		return 'Agregar detalle de paquete';
	}
}
