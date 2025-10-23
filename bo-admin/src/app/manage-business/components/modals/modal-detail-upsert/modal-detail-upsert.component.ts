import { Component, Input } from '@angular/core';

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

@Component({
	selector: 'app-modal-detail-upsert',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-detail-upsert.component.html',
	styleUrls: ['./modal-detail-upsert.component.scss']
})
export class ModalDetailUpsertComponent {
	@Input() id: number = 0;

	public form: FormGroup;
	public loading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private toastManager: ToastService,
		private packagesApi: PackagesApiService,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			family: ['1', [Validators.required]],
			package: ['', [Validators.required]],
			lastVersion: ['4', [Validators.required]],
			months: ['', [Validators.required, Validators.min(1)]],
			price: ['', [Validators.required, Validators.min(1)]],
			cuotes: ['', [Validators.required, Validators.min(1)]],
			initialPrice: ['', [Validators.required, Validators.min(1)]],
			cuotePrice: ['', [Validators.required, Validators.min(1)]],
			volume: ['', [Validators.required, Validators.min(1)]],
			cuoteN: ['', [Validators.required, Validators.min(1)]],
			comission: ['', [Validators.required, Validators.min(1)]],
			accionsN: ['', [Validators.required, Validators.min(1)]]
		});

		this.form.get('lastVersion')?.disable();
	}

	/* === Events === */
	public onSubmit() {
		const raw = this.form.getRawValue();
		const dto: IPackageDetailDto = {
			packageId: Number(raw.package),
			monthsDuration: Number(raw.months),
			price: Number(raw.price),
			numberQuotas: Number(raw.cuotes),
			initialPrice: Number(raw.initialPrice),
			quotaPrice: Number(raw.cuotePrice),
			volume: Number(raw.volume),
			numberInitialQuote: Number(raw.cuoteN),
			comission: Number(raw.comission),
			numberShares: Number(raw.accionsN),
			familyPackageId: Number(raw.family),
			membershipVersionId: Number(raw.lastVersion)
			// membershipMaintenance: Number(raw.package) // What is this?
		};

		if (this.id) this.update(this.id, dto);
		else this.create(dto);
	}

	/* === Helpers === */
	private create(dto: IPackageDetailDto) {
		const _onSuccess = map((res) => {
			this.instanceModal.close();

			const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
			const modal = ref.componentInstance as ModalConfirmationComponent;

			modal.body = 'Se creó el detalle de paquete';
			modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
			modal.title = 'Éxito';
		});
		const _onError = catchError((e) => {
			this.toastManager.addToast('Hubo un error al crear.', 'error');
			return of(undefined);
		});
		const _onFinalize = finalize(() => (this.loading = false));

		this.loading = true;
		this.packagesApi.fetchDetailCreate(dto).pipe(_onSuccess, _onError, _onFinalize).subscribe();
	}

	private update(id: number, dto: Partial<IPackageDetailDto>) {
		const _onSuccess = map((res) => {
			this.instanceModal.close();

			const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
			const modal = ref.componentInstance as ModalConfirmationComponent;

			modal.body = 'Se actualizó el detalle de paquete';
			modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
			modal.title = 'Éxito';
		});
		const _onError = catchError((e) => {
			this.toastManager.addToast('Hubo un error al actualizar.', 'error');
			return of(undefined);
		});
		const _onFinalize = finalize(() => (this.loading = false));

		this.loading = true;
		this.packagesApi.fetchDetailUpdate(id, dto).pipe(_onSuccess, _onError, _onFinalize).subscribe();
	}

	/* === Getters === */
	get title() {
		if (this.id) return 'Editar detalle de paquete';

		return 'Agregar detalle de paquete';
	}
}
