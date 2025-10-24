import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { MatIconModule } from '@angular/material/icon';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { TransferDocumentsFormPresenter } from './transfer-documents-form.presenter';

@Component({
	selector: 'app-transfer-documents-submission',
	standalone: true,
	providers: [TransferDocumentsFormPresenter],
	imports: [CommonModule, FileComponent, MatIconModule, RadiosComponent],
	templateUrl: './transfer-documents-submission.component.html',
	styleUrls: ['./transfer-documents-submission.component.scss']
})
export class TransferDocumentsSubmissionComponent {
	isStatusTrue = false;
	@Output() formChange = new EventEmitter<any>();
	@Input() initialData: any;
	constructor(public presenter: TransferDocumentsFormPresenter) {}

	ngOnInit(): void {
		this.emitForm();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['initialData'] && this.initialData) {
			const patch: Record<string, any> = {};
			['documentoIdentidad', 'partnerDocument', 'declaracionJurada'].forEach((key) => {
				const value = this.initialData[key];
				patch[key] = value instanceof File ? value : value?.file || null;
			});

			this.presenter.form.patchValue(patch, { emitEvent: false });
		}
	}

	onFileSelected(event: any) {
		const file = event.target.files[0];
		if (file) {
			this.presenter.form.get('file')?.setValue(file);
		}
	}

	public optHasPendingConciliations = [
		{ content: 'Sí', value: 1 },
		{ content: 'No', value: 2 }
	];

	public optConciliationResponsible = [
		{ content: 'Yo realizaré la regularización', value: 1 },
		{ content: 'El nuevo socio se encargará de pagar', value: 2 }
	];

	emitForm() {
		this.presenter.form.valueChanges.subscribe(() => {
			const form = this.presenter.form;
			if (form.valid) {
				this.formChange.emit(form.value);
			}
		});
	}
}
