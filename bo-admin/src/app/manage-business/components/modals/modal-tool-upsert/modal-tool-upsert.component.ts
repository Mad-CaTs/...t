import { Component, Input } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import { catchError, finalize, map } from 'rxjs/operators';
import { of } from 'rxjs';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';
import { ToolApiService } from '@app/core/services/api/manage-business/tool-api.service';

/* === Modules === */

import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-modal-tool-upsert',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-tool-upsert.component.html',
	styleUrls: ['./modal-tool-upsert.component.scss']
})
export class ModalToolUpsertComponent {
	@Input() id: number = 0;
	@Input() formType: 'tutorial' | 'image' | 'document' | 'presentation' = 'tutorial';
	@Input() formTypeId: number = 1;
	@Input() investmentProject: number = 0;
	@Input() onSuccess: () => void = () => {};

	public formTutorial: FormGroup;
	public formDocument: FormGroup;
	public loading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private modalManager: NgbModal,
		private toastManager: ToastService,
		private toolApi: ToolApiService
	) {
		this.formTutorial = builder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			url: ['', [Validators.required]]
		});

		this.formDocument = builder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			file: [null, []]
		});
	}

	/* === Events === */
	public onSubmit() {
		const raw =
			this.formType == 'tutorial' ? this.formTutorial.getRawValue() : this.formDocument.getRawValue();
		const _onSuccess = map((res) => {
			this.instanceModal.close();

			const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
			const modal = ref.componentInstance as ModalConfirmationComponent;

			modal.body = 'Se creó la herramienta con éxito';
			modal.icon = 'bi bi-check-circle-fill text-info fa-2x';
			modal.title = 'Éxito';
			this.onSuccess();
		});
		const _onError = catchError((err) => {
			this.toastManager.addToast('Hubo un error al crear herramientas', 'error');
			return of(undefined);
		});
		const _onFinalize = finalize(() => (this.loading = false));

		let format: number = 1;

		if (this.formType === 'tutorial') format = 5;
		else if (this.formType === 'image') format = 7;

		this.loading = true;
		this.toolApi
			.fetchCreate({
				nameDocument: raw.title,
				fileName:
					'https://empresas.blogthinkbig.com/wp-content/uploads/2019/11/Imagen3-245003649.jpg?w=800',
				idInvestmentProject: this.investmentProject,
				idEducationalDocumentCategory: this.formTypeId,
				idEducationalDocumentFormat: format
			})
			.pipe(_onSuccess, _onError, _onFinalize)
			.subscribe();
	}

	/* === Getters === */
	get title() {
		return this.id ? 'Editar herramienta' : 'Agregar herramienta';
	}
}
