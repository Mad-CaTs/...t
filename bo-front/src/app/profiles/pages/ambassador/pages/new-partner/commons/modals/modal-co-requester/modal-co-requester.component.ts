import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import { typeDocumentOptMock } from '../../mock/mock';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { ModalCoRequesterPresenter } from './modal-co-requester.presenter';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-co-requester',
	templateUrl: './modal-co-requester.component.html',
	styleUrls: ['./modal-co-requester.component.scss'],

	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		InputComponent,
		SelectComponent,
		DateComponent,
		ReactiveFormsModule
	],
	providers: [ModalCoRequesterPresenter]
})
export class ModalCoRequesterComponent implements OnInit {
	documentTypeList: ISelect[];
	@Output() modalClosed = new EventEmitter<any>();
	nroDocumentPlaceholder: string = '';

	get form(): FormGroup {
		return this.modalCoRequesterPresenter.coRequesterForm;
	}

	constructor(
		public modalCoRequesterPresenter: ModalCoRequesterPresenter,
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig
	) {}

	ngOnInit(): void {
		this.documentTypeList = this.config.data.documentTypeList;
		if (this.config.data.coRequesterData) {
			this.modalCoRequesterPresenter.coRequesterForm.patchValue(this.config.data.coRequesterData);
		}
		this.toggleDocumentField();
		this.form.get('idDocument')?.valueChanges.subscribe(() => this.toggleDocumentField());
	}

	closeModal(data = null) {
		this.ref.close(data);
	}

	onSubmit() {
		this.closeModal(this.modalCoRequesterPresenter.coRequesterForm.value);
	}

	toggleDocumentField() {
		const document = this.form.get('idDocument')?.value;
		const nroDocumentControl = this.form.get('nroDocument');

		const isValid = (val: any): boolean => val !== null && val !== undefined && val !== '';

		if (isValid(document)) {
			this.nroDocumentPlaceholder = 'Ingresar Número de documento';
			nroDocumentControl?.enable();
		} else {
			this.nroDocumentPlaceholder = 'Selecciona documento primero';
			nroDocumentControl?.reset();
			nroDocumentControl?.disable();
		}
	}
}
