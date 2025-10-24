import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { DynamicDialogRef, DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ITableProspect } from '../../interfaces/prospect';
import { CommonModule } from '@angular/common';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TableComponent } from '@shared/components/table/table.component';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ProspectCreationModalComponent } from '../../modals/prospect-creation-modal/prospect-creation-modal.component';
import { ProspectService } from '../../services/prospect-service.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { finalize, pipe } from 'rxjs';
import { ArrayDateTimePipe } from '@shared/pipe/array-date-time.pipe';

@Component({
  selector: 'app-table-prospect',
  standalone: true,
  imports: [
    CommonModule,
    PaginatorModule,
    TableComponent,
    DynamicDialogModule,
    ProgressSpinnerModule,
    ButtonModule,
    PaginationNgPrimeComponent,
    ArrayDateTimePipe
  ],
  templateUrl: './table-prospect.component.html',
  styleUrl: './table-prospect.component.scss'
})
export class TableProspectComponent {
  @Input() dataBody: ITableProspect[] = [];
  @Input() totalRecords: number = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  isButtonLoading: { [key: number]: boolean } = {};
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
    private prospectService: ProspectService,
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
    return this.tableService.getTable<ITableProspect>(this.id);
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

  onView(url: string) {
    window.open(url, '_blank');
  }

  edit(id: number) {
    this.dialogRef = this.dialogService.open(ProspectCreationModalComponent, {
      header: 'Editar prospecto',
      width: '50%',
      data: {
        userId: this.userInfo.id,
        beneficiaryId: id
      }
    });

    this.dialogRef.onClose.subscribe((data) => {
      if (data === true) {
        const ref = this.dialogService.open(ModalSuccessComponent, {
          header: '',
          data: {
            text: 'El prospecto se guardo correctamente.',
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
            message: 'El prospecto no se pudo editar.',
            title: '¡Error!',
            icon: 'check_circle_outline'
          }
        });
      }
    });
  }

  deleteProspect(data: any) {
    this.isButtonLoading[data.id] = true;
    this.prospectService.deleteProspect(data.id, data.fileName)
      .pipe(
        finalize(() => {
          this.isButtonLoading[data.id] = false;
        })
      )
      .subscribe({
        next: () => {
          const ref = this.dialogService.open(ModalSuccessComponent, {
            header: '',
            data: {
              text: 'El prospecto se elimino correctamente.',
              title: '¡Éxito!',
              icon: 'assets/icons/Inclub.png'
            }
          });
          ref.onClose.subscribe(() => {
            this.onRefresh({ rows: this.rows });
          });
        },
        error: () => {
          this.dialogService.open(ModalAlertComponent, {
            header: '',
            data: {
              message: 'El prospecto no se pudo eliminar.',
              title: '¡Error!',
              icon: 'check_circle_outline'
            }
          });
        },
      });
  }

}
