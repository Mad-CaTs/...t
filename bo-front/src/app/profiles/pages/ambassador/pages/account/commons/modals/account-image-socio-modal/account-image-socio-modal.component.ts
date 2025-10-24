import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-account-image-socio-modal',
	standalone: true,
	imports: [ReactiveFormsModule],
	templateUrl: './account-image-socio-modal.component.html',
	styleUrl: './account-image-socio-modal.component.scss'
})
export class AccountImageSocioModalComponent {
	formImageSocio: FormGroup;

	constructor(public ref: DynamicDialogRef) {}

	closeModal() {
		this.ref.close();
	}

	uploadFile() {
		this.ref.close();
	}
}
