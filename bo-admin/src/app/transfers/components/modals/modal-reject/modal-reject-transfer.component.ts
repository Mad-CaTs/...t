import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import type { ISelectOptReason } from '@interfaces/form-control.interface';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PaymentScheduleService } from '@app/validation-payments/services/payment-schedule.service';
import { TransferService } from '@app/transfers/services/transfer.service';
import { ITableTransferRequest } from '@interfaces/transfer.interface';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-reject-transfer',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InlineSVGModule, ModalComponent, FormControlModule],
	templateUrl: './modal-reject-transfer.component.html',
	styleUrls: ['./modal-reject-transfer.component.scss']
})
export class ModalRejectTransferComponent {
	@Input() transfer: ITableTransferRequest;
	@Input() id: number;

	@Output() transferRejected = new EventEmitter<any>();

	public step = 1;
	public form: FormGroup;

	public MotiveOpt: ISelectOptReason[] = [];

	private loadingModalRef: NgbModalRef | null = null;
	rejectionTypes: any[] = [];

	constructor(
		private instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private transferService: TransferService,
		private modal: NgbModal
	) {
		this.form = this.builder.group({
			motive: ['', [Validators.required]],
			detail: ['', [Validators.required, Validators.minLength(3)]]
		});
	}

	ngOnInit(): void {
		this.loadRejectionTypes();
	}

	loadRejectionTypes(): void {
		this.transferService.getRejectionTypes().subscribe((res: any) => {
			this.rejectionTypes = res.data;
			this.MotiveOpt = this.rejectionTypes.map((item) => ({
				id: item.idTransferRejectionType,
				text: item.detailRejectionTransfer,
				typeReason: item.idTransferRejectionType
			}));
		});
	}

	/* === Events === */
	public onSubmit() {
		const selectedMotiveId = this.form.get('motive')?.value;
		const detail = this.form.get('detail')?.value;
		const payload = {
			id_transfer_request: this.transfer.idTransferRequest,
			id_transfer_rejection_type: selectedMotiveId,
			detail_rejection_transfer: detail
		};

		this.showLoadingModal();

		this.transferService.rejectTransfer(payload).subscribe(
			(response) => {
				this.hideLoadingModal();
				setTimeout(() => {
					this.transferRejected.emit(payload);
					this.instanceModal.close();
					const ref = this.modal.open(ModalConfirmationComponent, { centered: true, size: 'md' });
					const modal = ref.componentInstance as ModalConfirmationComponent;
					modal.title = 'Rechazar solicitud';
					modal.icon = 'bi bi-x-circle-fill text-danger fa-2x';
					modal.body = 'La solicitud de transferencia ha sido rechazada con éxito.';
				}, 1000);
			},
			(error) => {
				this.hideLoadingModal();
				this.instanceModal.close();
				console.error('Error al rechazar el traspaso:', error);
				const ref = this.modal.open(ModalConfirmationComponent, { centered: true, size: 'md' });
				const modal = ref.componentInstance as ModalConfirmationComponent;
				modal.title = 'Error';
				modal.icon = 'bi bi-exclamation-triangle-fill text-warning fa-2x';
				modal.body =
					error?.error?.message ||
					'Ocurrió un error al rechazar la transferencia. Intenta nuevamente.';
			}
		);
	}

	/* === Getters === */
	get title() {
		if (this.step === 1) return 'Solicitud denegada';

		return 'Notificación';
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
