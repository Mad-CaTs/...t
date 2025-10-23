import { Component } from '@angular/core';

import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-modal-wallet-edit-limit-date',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-wallet-edit-limit-date.component.html',
	styleUrls: ['./modal-wallet-edit-limit-date.component.scss']
})
export class ModalWalletEditLimitDateComponent {
	public form: FormGroup;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private toastManager: ToastService
	) {
		this.form = builder.group({
			startDate: [new Date(), [Validators.required]],
			endDate: [new Date(), [Validators.required]]
		});
	}

	/* === Events === */
	public onSubmit() {
		this.toastManager.addToast('Se editó la fecha límite con éxito', 'success');
		this.instanceModal.close();
	}
}
