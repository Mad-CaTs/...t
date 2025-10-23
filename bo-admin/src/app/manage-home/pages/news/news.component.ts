import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';

import { TableModel } from '@app/core/models/table.model';

import { ModalUpsertNewsComponent } from '@app/manage-home/components/modals';

import type { ITableNews } from '@interfaces/manage-home.interface';
import type { INew, ITableNewDto, ITableResponse } from '@interfaces/api';
import type { IResponseData } from '@interfaces/globals.interface';

import { Subscription, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';

import { TableService } from '@app/core/services/table.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';
import { NewsApiService } from '@app/core/services/api';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';

@Component({
	selector: 'app-news',
	standalone: true,
	imports: [CommonModule, FormControlModule, ReactiveFormsModule, TablesModule],
	templateUrl: './news.component.html',
	styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit, OnDestroy {
	public readonly table: TableModel<ITableNews>;

	public form: FormGroup;

	private subs: Subscription[] = [];

	constructor(
		private tableService: TableService,
		private builder: FormBuilder,
		private modalManager: NgbModal,
		private toastService: ToastService,
		private newsApi: NewsApiService,
		private cdr: ChangeDetectorRef
	) {
		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableNews>({
			headers: ['Título', 'Descripción', 'Fecha', 'Estado', 'Editar'],
			noCheckBoxes: true
		});
		this.table.data = [];

		this.form = builder.group({
			search: ['']
		});
	}

	ngOnInit(): void {
		this.onSearch();

		this.subs.push(this.table.pageControl.valueChanges.subscribe(() => this.onSearch()));
	}

	ngOnDestroy(): void {
		this.subs.forEach((s) => s.unsubscribe());
	}

	/* === Events === */
	public onSearch() {
		const search = this.form.get('search')?.value as string;
		const _onFinalize = finalize(() => (this.table.loading = false));
		const _onSuccess = map((res: IResponseData<ITableResponse<INew>>) => {
			const data = res.data;

			this.table.data = data.data.map((d) => ({
				id: d.newsId,
				title: d.title,
				description: d.description,
				date: d.publishDate ? `${d.publishDate[2]}-${d.publishDate[1]}-${d.publishDate[0]}` : '-',
				status: d.status ? 'Publicado' : 'Inactivo'
			}));
			this.table.count = data.totalElements;
			this.cdr.detectChanges();
		});
		const _onError = catchError((err) => {
			this.toastService.addToast(err, 'error');
			return of(undefined);
		});
		let dto: ITableNewDto = { page: Number(this.table.pageControl.value), size: 10 };

		if (search) dto.title = search;

		this.newsApi.fetchTable(dto).pipe(_onSuccess, _onError, _onFinalize).subscribe();
	}

	public onCreate() {
		const ref = this.modalManager.open(ModalUpsertNewsComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertNewsComponent;

		modal.onRefreshTable = () => this.onSearch();
	}

	public onEdit(id: number) {
		const ref = this.modalManager.open(ModalUpsertNewsComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalUpsertNewsComponent;

		modal.id = id;
		modal.onRefreshTable = () => this.onSearch();
	}
}
