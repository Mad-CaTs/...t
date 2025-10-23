import { Component, EventEmitter, Input, Output } from '@angular/core';

import type { ISelectOptReason } from '@interfaces/form-control.interface';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PaymentScheduleService } from '@app/validation-payments/services/payment-schedule.service';
import { Reason } from '@interfaces/reason.interface';
import { ModalLoadingComponent } from '../modal-loading/modal-loading.component';
import { ModalSuccessPaymentComponent } from '../modal-success-payment/modal-success-payment.component';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
	selector: 'app-modal-reject-payment',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InlineSVGModule, ModalComponent, FormControlModule],
	templateUrl: './modal-reject-payment.component.html',
	styleUrls: ['./modal-reject-payment.component.scss']
})
export class ModalRejectPaymentComponent {

	@Input() idSuscription!: number;
	@Input() listIdPaymentsValidate!: Number[];
	@Output() paymentRejected = new EventEmitter<void>();

	public step = 1;
	public form: FormGroup;
	private loadingModalRef: any;

	public MotiveOpt: ISelectOptReason[] = [];

	constructor(private instanceModal: NgbActiveModal, 
				private builder: FormBuilder,
				private paymentService : PaymentScheduleService,
				private modalService: NgbModal) {
		this.form = this.builder.group({
			motive: ['', [Validators.required]],
			detail: ['', [Validators.required, Validators.minLength(3)]]
		});
	}

	ngOnInit(): void {
		this.loadReasons();
	}


	private loadReasons(): void {
		this.paymentService.getReasons().subscribe(
		  (response: any) => {
			const reasons: Reason[] = response.data; 
			this.MotiveOpt = reasons.map(reason => ({
			  id: reason.idReason.toString(),
			  text: reason.reasonRejection,
			  typeReason: reason.typeReason,
			}));
		  },
		  
		  (error: any) => {
			console.error('Error al obtener las razones:', error);
		  }
		);
	  }
	

	/* === Events === */
	public onSubmit() {
		this.showLoadingModal();
		const selectedMotiveId  = this.form.get('motive')?.value;
    	const detail = this.form.get('detail')?.value;
    	const selectedMotive = this.MotiveOpt.find(motive => motive.id === selectedMotiveId);
    
		if (selectedMotive) {
			const body = {
				idSuscription: this.idSuscription,
				listIdPaymentsValidate: this.listIdPaymentsValidate,
				acceptedPayment: false,
				reasonRejection: {
					idReason: parseInt(selectedMotiveId),
					reasonRejection: selectedMotive.text,
					detail: detail,
					typeReason: selectedMotive.typeReason
				}
			};


			this.paymentService.validatePayment(body).subscribe({
				next: (response: any) => {
					this.closeLoadingModal();
					if (response) {
						this.paymentRejected.emit();
						this.step++;
					} else {
						alert("ERROR: " + response);
					}
				},
				error: (error: any) => {
					this.closeLoadingModal();
					console.error('Error:', error);
					alert("ERROR en la respuesta del servidor");
				}
			});
		}
		
		
	}

	/* === Getters === */
	get title() {
		if (this.step === 1) return 'Solicitud denegada';

		return 'Notificación';
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private closeLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
