import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { ITableRentExemption } from '../../../rent-exemption/interfaces/rentExemption';
import { FormControl } from '@angular/forms';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { DynamicDialogRef, DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { CommonModule } from '@angular/common';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-table-prize',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorModule,
    TableComponent,
    DynamicDialogModule,
    ButtonModule,
    PaginationNgPrimeComponent
  ],
  templateUrl: './table-prize.component.html',
  styleUrl: './table-prize.component.scss'
})
export class TablePrizeComponent {
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
