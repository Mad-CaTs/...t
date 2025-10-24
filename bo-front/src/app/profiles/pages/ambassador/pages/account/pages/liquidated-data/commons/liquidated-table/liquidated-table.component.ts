import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize } from 'rxjs';
import { ITableLiquidated } from '../../interfaces/liquidated';
import { ArrayDatePipe } from '@shared/pipe/array-date.pipe';

@Component({
  selector: 'app-beneficiary-table',
  standalone: true,
  imports: [CommonModule,
    PaginatorModule,
    TableComponent,
    DynamicDialogModule,
    ButtonModule,
    ProgressSpinnerModule,
    PaginationNgPrimeComponent,
    ArrayDatePipe],
  templateUrl: './liquidated-table.component.html',
  styleUrl: './liquidated-table.component.scss'
})
export class LiquidatedTableComponent {
  @Input() dataBody: ITableLiquidated[] = [];
  @Input() totalRecords: number = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  isButtonLoading: { [key: number]: boolean } = {};
  public id: string = '';
  public rows: number = 1000;
  public first: number = 0;
  dialogRef: DynamicDialogRef;
  @Input()isLoading: boolean = true;
  userInfo: any;
  align: string = 'right';
  public selected: FormControl = new FormControl(1);

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
    console.log("dataBody",this.dataBody)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataBody']) {
      console.log('Datos recibidos en el hijo:', this.dataBody);

      if (this.dataBody) {
        this.selected.setValue(this.dataBody[0]?.id || 1);
        this.tableService.updateTable(this.dataBody, this.id, this.rows);
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
    return this.tableService.getTable<ITableLiquidated>(this.id);
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    this.isLoading = true;
    this.pageChange.emit({ page: event.page, rows: this.rows });
  }

  onRefresh(event: any): void {
    this.rows = event.rows || this.rows;
    this.isLoading = true;
    this.refresh.emit({ rows: this.rows });
  }

  get headers() {
		const result = [
			'Nombres',
			'Apellidos',
			'Género',
			'Correo Electrónico',
			'Documento',
			'Fecha de Creación',
			'Fecha de Liquidación',
			
		];
	return result;
	}

  get minWidthHeaders() {
		return [20, 100, 100, 100, 100,100,100];
	}


}
