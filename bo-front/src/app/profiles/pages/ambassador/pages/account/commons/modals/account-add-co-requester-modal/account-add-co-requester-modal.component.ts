import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { INewPartnerStep1Data } from '../../../../../commons/interfaces/new-partner.interfaces';
import { typeDocumentOptMock } from '../../../../../commons/mocks/mock-personal-information';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AccountAddCoRequesterPresenter } from './account-add-co-requester-modal.presenter';

@Component({
	selector: 'app-account-add-co-requester-modal',
	templateUrl: './account-add-co-requester-modal.component.html',
	styleUrls: [],
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, InputComponent, SelectComponent, DateComponent],
	providers: [AccountAddCoRequesterPresenter]
})
export class AccountAddCoRequesterModalComponent {
	public form: FormGroup;
	public docTypeOpt = typeDocumentOptMock;

	constructor(
		public accountAddCoRequesterPresenter: AccountAddCoRequesterPresenter,
		public ref: DynamicDialogRef
	) {}

	ngOnInit(): void {}

	onSubmit() {
		this.closeModal(this.accountAddCoRequesterPresenter.coRequesterForm.value);
	}

	closeModal(data: any) {
		this.ref.close(data);
	}
}
