import { Component, EventEmitter, Output } from '@angular/core';

import type { ISelectOptReason } from '@interfaces/form-control.interface';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { PaymentScheduleService } from '@app/validation-payments/services/payment-schedule.service';

@Component({
	selector: 'app-modal-reject-car',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InlineSVGModule, ModalComponent, FormControlModule],
	templateUrl: './modal-reject-car.component.html',
	styleUrls: ['./modal-reject-car.component.scss']
})
export class ModalRejectCarComponent {
	@Output() carConfirmed = new EventEmitter<void>();

	public step = 1;
	public form: FormGroup;

	public MotiveOpt: ISelectOptReason[] = [];

	constructor(
		private instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private paymentService: PaymentScheduleService,
		private modalService: NgbModal
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
		this.MotiveOpt = [
			{ id: '1', text: 'No cumple con la cantidad de ciclos calificados', typeReason: 1 },
			{
				id: '2',
				text: 'El monto de vehículo de la proforma excede el monto del bono auto',
				typeReason: 2
			},
			{ id: '3', text: 'Falta de información en la proforma', typeReason: 3 },
			{ id: '4', text: 'El color o modelo del vehículo no se encuentra disponible', typeReason: 4 }
		];
	}

	/* === Events === */
	public onSubmit() {
		const selectedMotiveId = this.form.get('motive')?.value;
		const detail = this.form.get('detail')?.value;
		const selectedMotive = this.MotiveOpt.find((motive) => motive.id === selectedMotiveId);
		this.carConfirmed.emit();
		this.step++;
		setTimeout(() => {
			this.instanceModal.close();
		}, 3000);
	}

	/* === Getters === */
	get title() {
		if (this.step === 1) return 'Solicitud denegada';

		return 'Notificación';
	}
}
