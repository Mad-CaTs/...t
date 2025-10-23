import { Component, Input, OnInit, Output } from '@angular/core';

import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

import type { INew, INewDto } from '@interfaces/api';
import type { IResponseData } from '@interfaces/globals.interface';

import { of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewsApiService } from '@app/core/services/api';
import { ToastService } from '@app/core/services/toast.service';

/* === Modules === */

import { CommonModule } from '@angular/common';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

const URL_PATTERN =
	/(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g;

@Component({
	selector: 'app-modal-upsert-news',
	standalone: true,
	imports: [CommonModule, ModalComponent, FormControlModule, ReactiveFormsModule],
	templateUrl: './modal-upsert-news.component.html',
	styleUrls: ['./modal-upsert-news.component.scss']
})
export class ModalUpsertNewsComponent implements OnInit {
	@Input() id: number = 0;
	@Input() onRefreshTable: Function = () => {};

	public form: FormGroup;

	public loading: boolean = false;

	constructor(
		public instanceModal: NgbActiveModal,
		private builder: FormBuilder,
		private newsApi: NewsApiService,
		private toastService: ToastService,
		private modalManager: NgbModal
	) {
		this.form = builder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			description: ['', [Validators.required, Validators.minLength(4)]],
			date: [new Date().toISOString(), [Validators.required]],
			status: ['', [Validators.required]],
			imageUrl: ['', [Validators.required, Validators.pattern(URL_PATTERN)]],
			videoUrl: ['', [Validators.pattern(URL_PATTERN)]]
		});
	}

	ngOnInit(): void {
		if (!this.id) return;

		this.loading = true;

		const _onFinalize = finalize(() => (this.loading = false));
		const _onSuccess = map((res: IResponseData<INew>) => {
			const newEntity = res.data;
			let date = new Date();

			if (newEntity.publishDate) {
				date = new Date(newEntity.publishDate[0], newEntity.publishDate[1], newEntity.publishDate[2]);
			}

			this.form.setValue({
				title: newEntity.title,
				description: newEntity.description,
				date: date.toISOString(),
				status: newEntity.status ? '1' : '2',
				imageUrl: newEntity.imageUrl || '',
				videoUrl: newEntity.videoUrl || ''
			});
		});
		const _onError = catchError((err) => {
			this.toastService.addToast(err, 'error');
			this.instanceModal.close();
			return of(undefined);
		});

		this.newsApi.fetchGetById(this.id).pipe(_onSuccess, _onError, _onFinalize).subscribe();
	}

	/* === Events === */
	public onSubmit() {
		const raw = this.form.getRawValue();
		let payload: INewDto = {
			title: raw.title,
			description: raw.description,
			publish_date: raw.date,
			image_url: raw.imageUrl,
			status: raw.status === '1'
		};

		this.loading = true;

		if (raw.videoUrl) payload['video_url'] = raw.videoUrl;

		const _onFinalize = finalize(() => (this.loading = false));
		const _onSuccess = map((res) => {
			this.instanceModal.close();

			const ref = this.modalManager.open(ModalConfirmationComponent, { centered: true, size: 'md' });
			const modal = ref.componentInstance as ModalConfirmationComponent;

			modal.title = 'Noticia guardada con éxito';
			modal.body = 'La noticia fue creada con éxito';
			modal.icon = 'bi bi-check-circle text-success';
			this.onRefreshTable();
		});
		const _onError = catchError((err) => {
			this.toastService.addToast(err, 'error');
			return of(undefined);
		});

		if (!this.id) this.newsApi.fetchCreate(payload).pipe(_onSuccess, _onError, _onFinalize).subscribe();
		else this.newsApi.fetchUpdate(this.id, payload).pipe(_onSuccess, _onError, _onFinalize).subscribe();
	}

	/* === Getters === */
	get title() {
		return this.id ? 'Editar noticia' : 'Agregar Noticia';
	}
}
