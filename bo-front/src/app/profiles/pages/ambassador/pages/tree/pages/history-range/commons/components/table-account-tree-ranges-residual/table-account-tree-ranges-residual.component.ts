import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ITablePeriodResidual } from '../../interfaces/periodResidual';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { getMedalImage, statusMap } from '../../constants';
import { TreeService } from '../../../../../commons/services/tree.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-table-account-tree-ranges-residual',
	standalone: true,
	imports: [
		CommonModule,
		PaginatorModule,
		TableComponent,
		DynamicDialogModule,
		ButtonModule,
		PaginationNgPrimeComponent,
		ReactiveFormsModule
	],
	templateUrl: './table-account-tree-ranges-residual.component.html',
	styleUrls: ['./table-account-tree-ranges-residual.component.scss']
})
export class TableAccountTreeRangesResidualComponent {
	@Input() dataBody: ITablePeriodResidual[] = [];
	@Input() totalRecords: number = 0;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Output() btnClick = new EventEmitter<any>();
	stateColors: { [key: string]: string } = {};
	public rows: number = 10;
	isLoading: boolean = true;
	public first: number = 0;
	public id: string = '';
	align: string = 'right';
	public selected: FormControl = new FormControl(1);
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		public userInfoService: UserInfoService,
		public tableService: TablePaginationService, 
		private treeService: TreeService) {
		this.id = tableService.addTable(this.dataBody, this.rows);
		this.treeService.getListAllStates().subscribe({
			next: (response) => {
				response.forEach((state) => {
					this.stateColors[state.idState] = state.colorRGB;
				});
			}
		});
	}

	ngOnInit(): void {
		this.selected.setValue(this.dataBody[0]?.id || 1);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody']) {
			const prevValue = changes['dataBody'].previousValue;
			const currentValue = changes['dataBody'].currentValue;

			if (JSON.stringify(prevValue) !== JSON.stringify(currentValue)) {
				console.log(
					'dataBody cambiado:',
					this.dataBody.map((item) => item.range)
				);
				this.tableService.updateTable(this.dataBody, this.id, this.rows);
				this.isLoading = false;
			} else {
				console.log('dataBody no cambió realmente');
			}
		}
	}

	/*  ngOnChanges(changes: SimpleChanges): void {
	if (changes['dataBody']) {
	  if (this.dataBody && this.dataBody.length > 0) {
		this.selected.setValue(this.dataBody[0]?.id || 1);
		this.tableService.updateTable(this.dataBody, this.id, this.rows);
		this.isLoading = false;
	  } else {
		setTimeout(() => {
		  this.isLoading = false;
		}, 1000);
	  }
	}
  } */

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	get table() {
		return this.tableService.getTable<ITablePeriodResidual>(this.id);
	}

	getStatusColor(idStatus: string): { textColor: string; backgroundColor: string } {
		const colorHex = this.stateColors[idStatus] || '#000000';
		console.log(idStatus);
		console.log(colorHex);
		return {
			textColor: colorHex,
			backgroundColor: this.hexToRgba(colorHex, 0.2)
		};
	}

	private hexToRgba(hex: string, alpha: number): string {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	getStatusById(id: number): string {
		return statusMap[id] || 'Estado desconocido';
	}

	onClickBtn() {
		const selectedId = this.selected.value;
		const selectedData = this.dataBody.find((item) => item.id === selectedId);
		if (selectedData) {
			this.btnClick.emit(selectedData);
		}
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

	get headers() {
		const result = [
			'Ciclo',
			'Rango',
			'Imagen del rango',
			'Estado',
			'Puntos Directos Rama 1',
			'Puntos Directos Rama 2',
			'Puntos Directos Rama 3'
		];
		return result;
	}

	get minWidthHeaders() {
		const result = [50, 50, 50, 30, 20, 20];
		return result;
	}

	getMedalImage(name: string): string {
		return getMedalImage(name);
	}
}
