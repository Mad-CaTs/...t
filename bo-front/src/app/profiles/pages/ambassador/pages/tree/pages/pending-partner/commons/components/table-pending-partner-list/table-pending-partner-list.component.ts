import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { PartnerListResponseDTO } from '../../../../../commons/interfaces/partnerList';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TableComponent } from '@shared/components/table/table.component';
import { PendingPartnerService } from '../../service/pending-partner.service';
import { finalize } from 'rxjs';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-table-pending-partner-list',
  standalone: true,
  imports: [CommonModule, TableComponent, PaginationNgPrimeComponent, MatIconModule,
    ProgressSpinnerModule],
  templateUrl: './table-pending-partner-list.component.html',
  styleUrl: './table-pending-partner-list.component.scss'
})
export class TablePendingPartnerListComponent {
  @ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
  @Input() dataBody: PartnerListResponseDTO[] = [];
  @Output() detailModal = new EventEmitter<number>();
  @Input() totalRecords: number = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() isLoading: boolean = true;
  isButtonLoading: { [key: number]: boolean } = {};
  align: string = 'right';
  public rows: number = 10;
  public first: number = 0;
  public id: string = '';
  public selected: FormControl = new FormControl(1);

  constructor(public tableService: TablePaginationService, private pendingPartnerService: PendingPartnerService,
    private dialogService: DialogService
  ) {
    this.id = tableService.addTable(this.dataBody, this.rows);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['dataBody']) return;
    this.tableService.updateTable(this.dataBody, this.id, this.rows);
  }

  deletePendingPartner(data: any) {
    this.isButtonLoading[data.id] = true;
    const body = {
      idUser: data.idUser,
      userAdmin: 'Sponsor'
    };
    this.pendingPartnerService.deletePendingPartner(body)
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
              text: 'El socio pendiente se elimino correctamente.',
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
              message: 'El socio pendiente no se pudo eliminar.',
              title: '¡Error!',
              icon: 'pi pi-times-circle'
            }
          });
        },
      });
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
  }

  get table() {
    return this.tableService.getTable<PartnerListResponseDTO>(this.id);
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

  private hexToRgba(hex: string, opacity: number, factor: number): string {
    const bigint = parseInt(hex.replace('#', ''), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    r = Math.floor(r * factor);
    g = Math.floor(g * factor);
    b = Math.floor(b * factor);

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  getTransparentColor(color: string): string {
    return this.hexToRgba(color, 0.4, 1);
  }

  getSolidColor(color: string): string {
    return this.hexToRgba(color, 1, 0.8);
  }

  resetPagination(): void {
    if (this.paginator) {
      this.paginator.resetPaginator();
    }
  }

  get headers() {
    const result = [
      'Usuario',
      'Nombre y Apellido',
      'Estado',
      'Nivel Patrocinio',
      'Patrocinador',
      'Acciones'
    ];
    return result;
  }

  get minWidthHeaders() {
    const result = [100, 100, 80, 120, 120, 120];
    return result;
  }
}
