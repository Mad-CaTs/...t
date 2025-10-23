import { Component, Input } from '@angular/core';

import type { INavigationTab } from '@interfaces/shared.interface';
import type { ISelectOpt } from '@interfaces/form-control.interface';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-modal-manual-validator',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule, NavigationComponent],
	templateUrl: './modal-manual-validator.component.html',
	styleUrls: ['./modal-manual-validator.component.scss']
})
export class ModalManualValidatorComponent {
	@Input() multiple: boolean = false;

	public readonly navData: INavigationTab[] = [
		{ path: '', name: 'Pago 1' },
		{ path: '', name: 'Pago 2' },
		{ path: '', name: 'Pago 3' }
	];

	public form: FormGroup;

	public openVoucher: boolean = false;
	public rejectView: boolean = false;

	public motiveOpts: ISelectOpt[] = [
		{ id: '1', text: 'El código  de operación es incorrecto o no existe' }
	];

	constructor(public instanceModal: NgbActiveModal, private modal: NgbModal, private builder: FormBuilder) {
		this.form = builder.group({
			rejectMotive: ['', [Validators.required]]
		});
	}

	/* === Validate === */
	public onValidate() {
		this.instanceModal.close();
		const ref = this.modal.open(ModalConfirmationComponent, { centered: true });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Notificación de verificación';
		modal.body = 'Se envió un correo al Socio';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
	}

	public onReject() {
		this.rejectView = true;
	}

	public onSendReject() {
		this.instanceModal.close();
		const ref = this.modal.open(ModalConfirmationComponent, { centered: true });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.title = 'Notificación de rechazo';
		modal.body = 'Se envió un correo al Socio';
		modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
	}

	/* === Getters === */
	get title() {
		if (this.rejectView) return 'Motivo de Rechazo';

		return 'Validador Manual';
	}
}
