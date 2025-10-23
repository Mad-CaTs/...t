import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { TransferService } from '@app/transfers/services/transfer.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ITableTransferRequest } from '@interfaces/transfer.interface';
import { LiquidationService } from '@app/liquidations/services/liquidation.service';

@Component({
	selector: 'app-modal-confirmation',
	templateUrl: './modal-confirmation.component.html',
	styleUrls: ['./modal-confirmation.component.scss'],
	standalone: true,
	imports: [ModalComponent, CommonModule]
})
export class ModalConfirmationLiquidationComponent {
	@Input() liquidation: any;
	@Input() title: string;
	@Input() icon: string;
	@Input() fullname!: string;
	@Input() dateRequest!: string;
	@Input() package!: string;
	@Input() membership!: string;
	@Input() reason!: string;

	@Output() liquidationConfirmed = new EventEmitter<ITableTransferRequest>();

	private loadingModalRef: NgbModalRef | null = null; 

	constructor(public instanceModal: NgbActiveModal, private modalManager: NgbModal,
		private liquidationService: LiquidationService,
		private cdr: ChangeDetectorRef,
		public modal: NgbModal, 
	) {}

	public onSubmit() {
		const payload = {
			idLiquidation: this.liquidation.id,
			acceptedLiquidation: true,
			suscription: this.liquidation.membership[0].idSuscription
		};
	
		// Mostrar modal de carga
		this.showLoadingModal();
		//Consumir el servicio de validación de traspasos
		this.liquidationService.validateTransfer(payload).subscribe(
			(response) => {
	
				//Ocultar modal de carga
				this.hideLoadingModal();
	
				setTimeout(() => {
					this.liquidationConfirmed.emit(this.liquidation);
					this.instanceModal.close();
	
					const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
					const modal = ref.componentInstance as ModalConfirmationComponent;
	
					modal.title = 'Solicitud exitosa';
					modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
					modal.body = 'La solicitud ha sido aprobada exitosamente.';
				}, 1000);
			},
			(error) => {
				//En caso de error, ocultar el modal de carga
				this.hideLoadingModal();
				console.error('Error al validar el traspaso:', error);
			}
		);
	}
	

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
