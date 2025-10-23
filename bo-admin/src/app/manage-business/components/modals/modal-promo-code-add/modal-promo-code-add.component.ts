import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-modal-promo-code-add',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-promo-code-add.component.html',
	styleUrls: ['./modal-promo-code-add.component.scss']
})
export class ModalPromoCodeAddComponent {
	public form: FormGroup;

	constructor(public instanceModal: NgbActiveModal, private builder: FormBuilder) {
		this.form = builder.group({
			user: ['1', [Validators.required]],
			family: ['', [Validators.required]],
			version: ['', [Validators.required]]
		});

		this.form.get('user')?.disable();
	}

	/* === Getters === */
	get title() {
		return 'Agregar código promocional';
	}
}
