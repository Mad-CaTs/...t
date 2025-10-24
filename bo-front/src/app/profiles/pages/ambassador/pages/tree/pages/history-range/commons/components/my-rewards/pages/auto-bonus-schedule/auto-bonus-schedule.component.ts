import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { Location } from '@angular/common';
import { ScheduleDetailComponent } from '@shared/components/schedule-detail/schedule-detail.component';
import { DetailScheduleMockService } from '../../commons/mock';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableBonoCardComponent } from '../../commons/components/table-bono-card/table-bono-card.component';
import { ModalBonusDetailComponent } from '../../commons/modals/modal-bonus-list-detail/modal-bonus-list-detail';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalAssignedPrizeDetailComponent } from '../../commons/modals/modal-assigned-prize-details/modal-assigned-prize-details';

@Component({
	selector: 'app-auto-bonus-schedule',
	standalone: true,
	imports: [
		CommonModule,
		BreadcrumbComponent,
		ScheduleDetailComponent,
		PaginationNgPrimeComponent,
		TableBonoCardComponent
	],
	templateUrl: './auto-bonus-schedule.component.html',
	styleUrl: './auto-bonus-schedule.component.scss'
})
export class AutoBonusScheduleComponent {
	breadcrumbItems: BreadcrumbItem[] = [];
	public cardsData = [];
	public rows: number = 10;
	@Input() totalRecords: number = 0;
	align: string = 'right';
	public first: number = 0;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();

	constructor(
		private location: Location,
		private mockService: DetailScheduleMockService,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.initBreadcrumb();
		this.cardsData = this.mockService.cardsData;
	}

	public initBreadcrumb(): void {
		this.breadcrumbItems = [
			{
				label: 'Volver',
				action: () => this.goBack()
			},
			{
				label: 'Cronograma'
			}
		];
	}
	goBack() {
		this.location.back();
	}

	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.pageChange.emit({ page: event.page, rows: this.rows });
	}

	onRefresh(event: any): void {
		this.rows = event.rows;
		this.refresh.emit({ rows: this.rows });
	}

	onClickBtnOpenDetailModal(): void {
		const ref = this.dialogService.open(ModalAssignedPrizeDetailComponent, {
			width: '50vw',
			styleClass: 'custom-modal-header position-relative',
			closable: false
		});

		ref.onClose.subscribe(() => {});
	}
}
