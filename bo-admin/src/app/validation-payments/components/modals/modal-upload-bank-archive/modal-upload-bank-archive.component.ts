import { Component } from '@angular/core';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
	selector: 'app-modal-upload-bank-archive',
	standalone: true,
	imports: [CommonModule, ModalComponent, ReactiveFormsModule, FormControlModule],
	templateUrl: './modal-upload-bank-archive.component.html',
	styleUrls: ['./modal-upload-bank-archive.component.scss']
})
export class ModalUploadBankArchiveComponent {
	public form: FormGroup;

	constructor(public instanceModal: NgbActiveModal, private builder: FormBuilder, private modal: NgbModal) {
		this.form = builder.group({
			bank: ['', Validators.required],
			accountType: ['', Validators.required],
			file: [null, Validators.required]
		});
	}

	/* === Events === */
	public onSubmit() {
		this.instanceModal.close();
		const ref = this.modal.open(ModalConfirmationComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalConfirmationComponent;

		modal.body = 'Archivo cargado';
		modal.icon = 'bi bi-check2-circle text-primary fs-60px';
		modal.title = 'Éxito';
	}
}
