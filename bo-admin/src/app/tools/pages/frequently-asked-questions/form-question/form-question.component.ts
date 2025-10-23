import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { QuestionFormComponent } from '@app/tools/components/question-form/question-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalNotifyComponent } from '@app/entry/components/modals/modal-notify/modal-notify.component';
import { FrequentlyQuestionsService } from '@app/tools/services/frequently-questions.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

import { handleHttpError } from '@app/event/utils/handle-http-error.util';
import { image } from 'html2canvas/dist/types/css/types/image';

@Component({
	selector: 'app-form-question',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, QuestionFormComponent, ModalNotifyComponent],
	templateUrl: './form-question.component.html',
	styleUrls: ['./form-question.component.scss']
})
export class FormQuestionComponent implements OnInit {
	private notifyOnGetIdError = false;

	questionForm: FormGroup;
	editMode: boolean = false;
	imageUrl: string | null = null;
	questionData: any = null;

	notifyTitle: string = '';
	notifyMessage: string = '';
	notifyType: 'success' | 'error' = 'success';
	showNotify: boolean = false;

	private loadingModalRef: NgbModalRef | null = null;

	constructor(
		private fb: FormBuilder,
		private frequentlyQuestionsService: FrequentlyQuestionsService,
		private modalService: NgbModal,
		private cd: ChangeDetectorRef,
		private router: Router,
		private route: ActivatedRoute
	) {
		this.questionForm = this.fb.group({
			question: ['', Validators.required],
			description: [null, Validators.required],
			image: [null, Validators.required],
			imageurl: [null]
		});
	}

	ngOnInit(): void {
		const idParam = this.route.snapshot.paramMap.get('id');
		if (idParam) {
			this.editMode = true;
			this.frequentlyQuestionsService.getQuestionById(+idParam).subscribe({
				next: (data) => {
					this.questionData = data.data;
					this.imageUrl = data.data.imageurl || null;
					this.patchFormWithQuestion();
					this.cd.detectChanges();
				},
				error: (err) => {
					const notify = handleHttpError(err);
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.notifyType = notify.notifyType;
					this.showNotify = true;
					this.notifyOnGetIdError = true;
					this.cd.detectChanges();
				}
			});
		}
	}

	private patchFormWithQuestion(): void {
		this.questionForm.patchValue({
			question: this.questionData.question ?? '',
			description: this.questionData.description ?? '',
			image: this.questionData.imageurl
				? { name: 'Imagen actual', url: this.questionData.imageurl, isUrl: true }
				: null,
			imageurl: this.questionData.imageurl ?? null
		});
		this.cd.detectChanges();
	}
	private normalizeField(value: string): string {
		return value.trim().replace(/\s+/g, ' ');
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

	onSubmit(): void {
		// 1) Normaliza los campos de texto
		['question', 'description'].forEach((key) => {
			const control = this.questionForm.get(key);
			if (control && typeof control.value === 'string') {
				control.setValue(this.normalizeField(control.value), { emitEvent: false });
			}
		});
		// 2) Marca todos como tocados
		this.questionForm.markAllAsTouched();
		if (this.questionForm.invalid) return;

		// 3) Mapea los campos del formulario a los nombres del modelo Event
		const formValue = this.questionForm.value;
		let ImageFileToSend = formValue.image;

		// Si el flyer es el actual y no es un File, pero el backend espera un archivo, crea un Blob vacío con el nombre original
		if (ImageFileToSend && ImageFileToSend.isUrl && !(ImageFileToSend instanceof File)) {
			// Puedes usar un Blob vacío, pero con el nombre del flyer actual
			ImageFileToSend = new File([new Blob()], ImageFileToSend.name || 'image.png', {
				type: 'image/png'
			});
		}

		const mapped: any = {
			usermember: 'admin',
			question: formValue.question,
			suggested: false,
			description: formValue.description,
			imageFile: ImageFileToSend,
			imageurl: formValue.imageurl || null
		};
		if (this.editMode && this.questionData && this.questionData.id) {
			const clean = (val: any) => (val === null || val === undefined ? '' : val);
			const isUnchanged =
				clean(this.questionData.question) === clean(mapped.question) &&
				clean(this.questionData.description) === clean(mapped.description) &&
				((mapped.imageFile && mapped.imageFile.isUrl) ||
					(!this.questionData.imageurl && !mapped.image));
			if (isUnchanged) {
				this.notifyTitle = 'Sin cambios';
				this.notifyMessage = 'No se detectaron cambios en el formulario.';
				this.notifyType = 'error';
				this.showNotify = true;
				this.cd.detectChanges();
				return;
			}
			this.showLoadingModal();
			this.frequentlyQuestionsService.updateQuestion(mapped, this.questionData.id).subscribe({
				next: (response) => {
					this.hideLoadingModal();

					this.notifyTitle = 'Éxito';
					this.notifyMessage = 'La pregunta frecuente se actualizó correctamente.';
					this.notifyType = 'success';
					this.showNotify = true;
					this.cd.detectChanges();
				},
				error: (err) => {
					this.hideLoadingModal();
					const notify = handleHttpError(err);
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.notifyType = notify.notifyType;
					this.showNotify = true;
					this.cd.detectChanges();
				}
			});
		} else {
			this.showLoadingModal();
			this.frequentlyQuestionsService.createQuestion(mapped).subscribe({
				next: (response) => {
					this.hideLoadingModal();
					this.notifyTitle = 'Éxito';
					this.notifyMessage = 'La pregunta frecuente se creó correctamente.';
					this.notifyType = 'success';
					this.showNotify = true;
					this.cd.detectChanges();
					this.questionForm.reset();
				},
				error: (err) => {
					this.hideLoadingModal();
					const notify = handleHttpError(err);
					this.notifyTitle = notify.notifyTitle;
					this.notifyMessage = notify.notifyMessage;
					this.notifyType = notify.notifyType;
					this.showNotify = true;
					this.cd.detectChanges();
				}
			});
		}
	}

	onEnterKey(event: any): void {
		event.preventDefault();
		this.onSubmit();
	}

	onNotifyClose(): void {
		this.showNotify = false;
		if (this.notifyType === 'success' || this.notifyOnGetIdError) {
			this.router.navigate(['/dashboard/tools/frequently-asked-questions']);
			this.notifyOnGetIdError = false;
		}
	}

	onCancel(): void {
		this.router.navigate(['/dashboard/tools/frequently-asked-questions']);
	}
}
