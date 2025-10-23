import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { LoadingComponent } from '@shared/components/loading/loading.component';

import type { ISelectOpt } from '@interfaces/form-control.interface';
import type { IResponseData } from '@interfaces/globals.interface';
import type { ITool } from '@interfaces/api';

import { catchError, finalize, map } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';

import { ToastService } from '@app/core/services/toast.service';
import { ToolApiService } from '@app/core/services/api/manage-business/tool-api.service';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
	selector: 'app-tools',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		FormControlModule,
		ReactiveFormsModule,
		LoadingComponent,
		NgbAccordionModule
	],
	templateUrl: './tools.component.html',
	styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit, OnDestroy {
	public form: FormGroup;
	public selected: number = 0;
	public loading: boolean = false;
	public tools: ITool[] = [];

	public toolOpts: ISelectOpt[] = [
		{
			id: '3',
			text: 'SECCIÓN 1 - TUTORIALES'
		},
		{
			id: '5',
			text: 'SECCIÓN 2 - IMAGENES'
		},
		{
			id: '1',
			text: 'SECCIÓN 3 - DOCUMENTOS'
		},
		{
			id: '2',
			text: 'SECCIÓN 4 - PRESENTACIÓN OPORTUNIDAD'
		}
	];

	private subscriptions: Subscription[] = [];

	constructor(
		private builder: FormBuilder,
		private toastManager: ToastService,
		private toolApi: ToolApiService,
		private cdr: ChangeDetectorRef
	) {
		this.form = builder.group({
			title: ['', [Validators.required, Validators.minLength(4)]],
			url: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.fetchApi();
	}

	ngOnDestroy(): void {
		this.subscriptions.forEach((s) => s.unsubscribe());
	}

	/* === Helpers === */
	public fetchApi() {
		const _onSuccess = map((res: IResponseData<ITool[]>) => {
			const tools = res.data;

			this.tools = tools;
		});
		const _onError = catchError((err) => {
			this.toastManager.addToast('Hubo un error al obtener herramientas', 'error');
			return of(undefined);
		});
		const _onFinalize = finalize(() => {
			this.loading = false;
			this.cdr.detectChanges();
		});

		this.loading = true;
		this.toolApi
			.fetchGet(this.selected + 1)
			.pipe(_onSuccess, _onError, _onFinalize)
			.subscribe();
	}

	public filterBySection(sectionId: string) {
		const formTypeId = Number(sectionId);

		return this.tools.filter((t) => t.idEducationalDocumentCategory === formTypeId);
	}

	/* === Events === */
	public onCreate(sectionId: string) {
		const raw = this.form.getRawValue();
		const formTypeId = Number(sectionId);
		const _onSuccess = map((res) => {
			this.toastManager.addToast('Se creó la herramienta con éxito', 'success');
			this.fetchApi();
			this.form.reset();
		});
		const _onError = catchError((err) => {
			this.toastManager.addToast('Hubo un error al crear herramientas', 'error');
			return of(undefined);
		});
		const _onFinalize = finalize(() => (this.loading = false));

		let format: number = 1;

		if (formTypeId === 3) format = 5;
		else if (formTypeId === 5) format = 7;

		this.loading = true;
		this.toolApi
			.fetchCreate({
				nameDocument: raw.title,
				fileName: raw.url,
				idInvestmentProject: this.selected + 1,
				idEducationalDocumentCategory: formTypeId,
				idEducationalDocumentFormat: format
			})
			.pipe(_onSuccess, _onError, _onFinalize)
			.subscribe();
	}

	public onDelete(id: number) {
		const _onSuccess = map((res) => {
			this.toastManager.addToast('Se eliminó con éxito', 'success');
			this.fetchApi();
		});
		const _onError = catchError((err) => {
			this.toastManager.addToast('Hubo un error al eliminar', 'error');
			return of(undefined);
		});
		const _onFinalize = finalize(() => (this.loading = false));

		this.loading = true;
		this.toolApi.fetchDelete(id).pipe(_onSuccess, _onError, _onFinalize).subscribe();
	}

	public onChangeSelected(newSelected: number) {
		this.selected = newSelected;
		this.fetchApi();
	}

	/* === Getters === */
	get tool() {
		return Number(this.form.get('tool')?.value);
	}

	get helperText() {
		if (this.tool === 3) return 'Tutoriales';
		if (this.tool === 5) return 'Imágenes';
		if (this.tool === 1) return 'Documentos muestra';
		if (this.tool === 2) return 'Presentación de oportunidad / Plan de mercadeo';

		return 'Título';
	}
}
