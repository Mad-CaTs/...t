import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { TransferService } from '@app/transfers/services/transfer.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ITableTransferRequest } from '@interfaces/transfer.interface';
import { buildApproveTransferRequestPayload } from '@app/transfers/utils/approve-transfer-request.payload';

@Component({
	selector: 'app-modal-confirmation',
	templateUrl: './modal-confirmation.component.html',
	styleUrls: ['./modal-confirmation.component.scss'],
	standalone: true,
	imports: [ModalComponent, CommonModule]
})
export class ModalConfirmationTransferComponent {
	@Input() data!: ITableTransferRequest & { transferTypeName?: string };
	@Input() title!: string;
	@Input() icon!: string;
	@Input() transfer: ITableTransferRequest;
	@Output() transferConfirmed = new EventEmitter<ITableTransferRequest>();
	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		public instanceModal: NgbActiveModal,
		private modalManager: NgbModal,
		private transferService: TransferService,
		public modal: NgbModal
	) {}

	ngOnInit(): void {}

	public submit(): void {
		this.showLoadingModal();
		const payload = buildApproveTransferRequestPayload(this.transfer);
		this.transferService
			.approveTransfer(payload, this.transfer.idTransferType, this.transfer.idMembership)
			.subscribe({
				next: (response) => {
					this.actualizaEstados();
				},
				error: (err) => {
					this.hideLoadingModal();
					console.error('❌ Error al aprobar la solicitud:', err);

					const ref = this.modalManager.open(ModalConfirmationComponent, {
						centered: true,
						size: 'md'
					});
					const modal = ref.componentInstance as ModalConfirmationComponent;
					modal.title = 'Error en la aprobación';
					modal.icon = 'bi bi-x-circle-fill text-danger fa-2x';
					modal.body = 'No se pudo aprobar la solicitud. Por favor, intente nuevamente.';
				}
			});
	}

	public actualizaEstados(): void {
		const id = this.transfer.idTransferRequest;
		this.transferService.preApproveTransfer(id).subscribe({
			next: (res) => {
				this.hideLoadingModal();
				this.transferConfirmed.emit(this.transfer);
				this.instanceModal.close();
				if (this.transfer.idTransferType === 3) {
					this.reactivarPostLiquidacion();
				}
				const ref = this.modalManager.open(ModalConfirmationComponent, {
					centered: true,
					size: 'md'
				});
				const modal = ref.componentInstance as ModalConfirmationComponent;
				modal.title = 'Solicitud completada';
				modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
				modal.body = 'La solicitud ha sido aprobada y su estado actualizado correctamente.';
			},
			error: (err) => {
				this.hideLoadingModal();
				console.error('Error al actualizar el estado:', err);
				const ref = this.modalManager.open(ModalConfirmationComponent, {
					centered: true,
					size: 'md'
				});
				const modal = ref.componentInstance as ModalConfirmationComponent;
				modal.title = 'Error al actualizar estado';
				modal.icon = 'bi bi-x-circle-fill text-danger fa-2x';
				modal.body =
					'La solicitud fue aprobada, pero no se pudo actualizar su estado. Intente nuevamente.';
			}
		});
	}

	private reactivarPostLiquidacion(): void {
  const payload = {
    idSponsor: this.transfer.sponsorId,
    idUser: this.transfer.idUserTo
  };

  console.log('⚙️ Reactivando post liquidación con payload:', payload);

  this.transferService.reactivatePostLiquidation(payload).subscribe({
    next: (res) => {
      console.log('✅ Post liquidación reactivada:', res);
    },
    error: (err) => {
      console.error('❌ Error al reactivar post liquidación:', err);
    }
  });
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
