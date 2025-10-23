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
import { PackageDetailAdministratorService } from '@app/manage-business/services/PackageDetailAdministratorService';

@Component({
	selector: 'app-modal-detail-edit',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-detail-edit.component.html',
	styleUrls: ['./modal-detail-edit.component.scss']
})
export class ModalDetailEditComponent {
	@Input() id: number = 0;
	@Input() data: ITableDetailPackage;
	@Input() currentVersion: String;
	@Input() familypackage: ISelectOpt;

	//@Input() cuotePrices!: string;

	public form: FormGroup;
	public loading: boolean = false;

	status = true;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private toastManager: ToastService,
		private modalManager: NgbModal,
		private cdr: ChangeDetectorRef,
		private packageDetailAdministratorService: PackageDetailAdministratorService
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
		this.form.get('family')?.disable();
		this.form.get('package')?.disable();
	}

	ngOnInit(): void {
		if (this.data) {
			this.form.patchValue({
				package: this.data.packageName,
				family: this.familypackage.text,
				lastVersion: this.currentVersion,
				months: this.data.months,
				price: this.data.price,
				cuotes: this.data.cuotes,
				initialPrice: this.data.initialPrice,
				cuotePrice: this.data.cuotePrice,
				volume: this.data.volume,
				cuoteN: this.data.intialCuoteN,
				comission: this.data.comission,
				accionsN: this.data.actionsN,
				interCuote: this.data.interCuote,
				points: this.data.points,
				pointsFree: this.data.pointsFree,
				freePointStatus: this.data.freePointStatus
			});

			console.log('formulario', this.data);
		}

		this.cdr.detectChanges();
	}

	/* === Events === */
	public onSubmit() {
		this.loading = true;
		const raw = this.form.getRawValue();
		const body = {
			idPackageDetail: this.data.id,
			idPackage: this.data.idPackage,
			monthsDuration: Number(raw.months),
			price: Number(raw.price),
			numberQuotas: Number(raw.cuotes),
			initialPrice: Number(raw.initialPrice),
			quotaPrice: Number(raw.cuotePrice),
			volume: Number(raw.volume),
			numberInitialQuote: Number(raw.cuoteN),
			comission: Number(raw.comission),
			numberShares: Number(raw.accionsN),
			idFamilyPackage: this.familypackage.id,
			idMembershipVersion: Number(raw.lastVersion),
			membershipMaintenance: 0,
			isSpecialFractional: false,
			points: Number(raw.points),
			pointsToRelease: Number(raw.pointsFree),
			installmentInterval: Number(raw.interCuote),
			canReleasePoints: raw.freePointStatus == true
		};

		console.log('datos a enviar EDITAR', body);

		this.loading = true;

		//Consume el servicio para actualizar los detalles del paquete
		this.packageDetailAdministratorService.updatePackageDetail(body).subscribe(
			//console.log(this.packageDetailAdministratorService.updatePackageDetail());
			(response) => {
				console.log('UPDATE', response);
				this.instanceModal.close();
				const ref = this.modalManager.open(ModalConfirmationComponent, {
					centered: true,
					size: 'md'
				});
				const modal = ref.componentInstance as ModalConfirmationComponent;

				modal.body = 'Se actualizó el detalle del paquete exitosamente.';
				modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
				modal.title = 'Éxito';
			},
			(error) => {
				this.toastManager.addToast('Hubo un error al actualizar.', 'error');
				console.error('Update failed', error);
				return of(undefined);
			}
		);
	}

	/* === Getters === */
	get title() {
		return 'Editar detalle de paquetes';
	}
}
