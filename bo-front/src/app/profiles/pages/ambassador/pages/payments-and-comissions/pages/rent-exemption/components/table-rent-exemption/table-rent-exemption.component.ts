import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { TableComponent } from '@shared/components/table/table.component';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RentExemptionCreationModalComponent } from '../../modals/rent-exemption-creation-modal/rent-exemption-creation-modal.component';
import { ITableRentExemption } from '../../interfaces/rentExemption';
import { FormControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PaginatorModule } from 'primeng/paginator';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

@Component({
	selector: 'app-table-rent-exemption',
	standalone: true,
	imports: [
		CommonModule,
		PaginatorModule,
		TableComponent,
		DynamicDialogModule,
		ButtonModule,
		PaginationNgPrimeComponent
	],
	templateUrl: './table-rent-exemption.component.html',
	styleUrls: ['./table-rent-exemption.component.scss']
})
export class TableRentExemptionComponent implements OnInit {
	@Input() dataBody: ITableRentExemption[] = [];
	@Input() totalRecords: number = 0;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	public id: string = '';
	public rows: number = 10;
	public first: number = 0;
	dialogRef: DynamicDialogRef;
	isLoading: boolean = true;
	userInfo: any;
	align: string = 'right';
	public selected: FormControl = new FormControl(1);
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		private dialogService: DialogService,
		public tableService: TablePaginationService,
		private userInfoService: UserInfoService
	) {
		this.id = tableService.addTable(this.dataBody, this.rows);
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnInit(): void {
		this.selected.setValue(this.dataBody[0]?.id || 1);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody']) {
			if (this.dataBody) {
				this.selected.setValue(this.dataBody[0]?.id || 1);
				this.tableService.updateTable(this.dataBody, this.id, this.rows);
				this.isLoading = false;
			} else {
				setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			}
		}
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	get table() {
		return this.tableService.getTable<ITableRentExemption>(this.id);
	}

	viewFile(file: string) {
		window.open(file, '_blank');
	}

	uploadDocument() {
		this.dialogRef = this.dialogService.open(RentExemptionCreationModalComponent, {
			header: 'Exoneración de renta',
			width: '50%',
			data: {
				userId: this.userInfo.id
			}
		});

		this.dialogRef.onClose.subscribe((data) => {
			/*Forzar la condición para evitar undefined->false*/
			if (data === true) {
				const ref = this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'La exoneración de renta se guardo correctamente.',
						title: '¡Éxito!',
						icon: 'assets/icons/Inclub.png'
					}
				});
				ref.onClose.subscribe(() => {
					this.onRefresh({ rows: this.rows });
				});
			} else if (data === false) {
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'La exoneración de renta no se pudo guardar.',
						title: '¡Error!',
						icon: 'check_circle_outline'
					}
				});
			}
		});
	}

	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.isLoading = true;
		this.pageChange.emit({ page: event.page, rows: this.rows });
	}

	onRefresh(event: any): void {
		this.rows = event.rows;
		this.isLoading = true;
		this.refresh.emit({ rows: this.rows });
	}
}
