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
import { LiquidationService } from '@app/liquidations/services/liquidation.service';
import { ITableLiquidationRequest } from '@interfaces/liquidation.interface';

@Component({
	selector: 'app-modal-reject-transfer',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InlineSVGModule, ModalComponent, FormControlModule],
	templateUrl: './modal-reject-transfer.component.html',
	styleUrls: ['./modal-reject-transfer.component.scss']
})
export class ModalRejectLiquidationComponent {
	@Input() liquidation: ITableLiquidationRequest;
	@Input() id: number;

	@Output() transferRejected = new EventEmitter<any>();

	public step = 1;
	public form: FormGroup;

	public MotiveOpt: ISelectOptReason[] = [];

	private loadingModalRef: NgbModalRef | null = null;


	constructor(
		private instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private __liquidationService: LiquidationService,
		private cdr: ChangeDetectorRef,
		private modal: NgbModal
	) {
		this.form = this.builder.group({
			motive: ['', [Validators.required]],
			detail: ['', [Validators.required, Validators.minLength(3)]]
		});
	}

	ngOnInit(): void {
		this.loadReasons();
	}

	private loadReasons(): void {
		this.__liquidationService.getAllReasonLiquidation().subscribe({
		  next: (reasons) => {
			this.MotiveOpt = reasons;
			this.cdr.detectChanges();
		  },
		  error: (err) => {
			console.error('Error loading reasons:', err);
			this.cdr.detectChanges();

		  }
		});
	  }
	  

	/* === Events === */
	public onSubmit() {
		const selectedMotiveId = this.form.get('motive')?.value;
		const detail = this.form.get('detail')?.value;
		const selectedMotive = this.MotiveOpt.find((motive) => motive.id === selectedMotiveId);

		console.log(this.liquidation);
		const payload = {
			idLiquidation: this.liquidation.id,
			acceptedLiquidation: false,
			reasonRejection: {
				idReason: selectedMotive?.id || '',
				reasonRejection: selectedMotive?.text || '',
				detail: detail
			},
			suscription: this.liquidation.membership[0].idSuscription
		};

		this.showLoadingModal();


		this.__liquidationService.validateTransfer(payload).subscribe(
			(response) => {
			  // Ocultar modal de carga
			  this.hideLoadingModal();
	  
			  setTimeout(() => {
				this.transferRejected.emit(payload);
				this.instanceModal.close();
	  
				const ref = this.modal.open(ModalConfirmationComponent, { centered: true, size: 'md' });
				const modal = ref.componentInstance as ModalConfirmationComponent;
	  
				modal.title = 'Solicitud denegada';
				modal.icon = 'bi bi-x-circle-fill text-danger fa-2x';
				modal.body = 'La solicitud de transferencia ha sido rechazada con éxito.';
			  }, 1000);
			},
			(error) => {
			  this.hideLoadingModal();
			  console.error('Error al rechazar el traspaso:', error);
			}
		  );
		}

	/* === Getters === */
	get title() {
		if (this.step === 1) return 'Solicitud denegada';

		return 'Notificación';
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
