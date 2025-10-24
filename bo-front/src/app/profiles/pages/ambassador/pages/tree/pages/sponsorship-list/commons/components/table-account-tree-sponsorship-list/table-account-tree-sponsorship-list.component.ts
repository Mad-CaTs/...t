import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PaginationNgPrimeComponent } from "@shared/components/pagination-ng-prime/pagination-ng-prime.component";
import { TableComponent } from "@shared/components/table/table.component";
import { SponsorsListResponseDTO } from '../../../../../commons/interfaces/sponsorsList';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalDetailSponsorshipListComponent } from '../../modals/modal-detail-sponsorship-list/modal-detail-sponsorship-list.component';

@Component({
  selector: 'app-table-account-tree-sponsorship-list',
  standalone: true,
  imports: [PaginationNgPrimeComponent, TableComponent, CommonModule, MatIconModule, FormsModule],
  templateUrl: './table-account-tree-sponsorship-list.component.html',
  styleUrl: './table-account-tree-sponsorship-list.component.scss'
})
export class TableAccountTreeSponsorshipListComponent implements OnDestroy, OnChanges {
  @ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
  @Input() dataBody = [];
  //@Input() totalRecords: number = 0;
  @Input() totalRecords = 0;
  @Input() isLoading: boolean = true;
  @Output() pageChange = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<any>();
  @Output() detailModal = new EventEmitter<SponsorsListResponseDTO>();
  @Output() sortChange = new EventEmitter<{ field: 'directPartnersCount' | 'directSponsorshipScore', dir: 'asc' | 'desc' }>();

  sortField: 'directPartnersCount' | 'directSponsorshipScore' = 'directPartnersCount';
  sortState: Record<'directPartnersCount' | 'directSponsorshipScore', 'asc' | 'desc'> = {
    directPartnersCount: 'desc',        
    directSponsorshipScore: 'desc'
  };

  activeField: 'directPartnersCount' | 'directSponsorshipScore' | null = null;
  dirPartners: 'none' | 'asc' | 'desc' = 'none';
  dirScore: 'none' | 'asc' | 'desc' = 'none';

  align: string = 'right';
  public rows: number = 10;
  public first: number = 0;
  public id: string = '';
  public selected: FormControl = new FormControl(1);
  selectedRecord: any;
  dialogRef: DynamicDialogRef;
  dialogService: DialogService;

  displayData: SponsorsListResponseDTO[] = [];


  constructor(public tableService: TablePaginationService, private dashboardService: DashboardService) {
    this.id = tableService.addTable(this.dataBody, this.rows);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataBody']) {
      this.resort();
      this.tableService.updateTable(this.displayData, this.id, this.rows);
    }
  }

  get sortDir(): 'asc' | 'desc' {
    return this.sortState[this.sortField];
  }

  onHeaderClick(field: 'directPartnersCount' | 'directSponsorshipScore') {
  this.activeField = field;

  if (field === 'directPartnersCount') {
    this.dirPartners = this.dirPartners === 'asc' ? 'desc' : 'asc';
    this.dirScore = 'none'; 
    this.applySort('directPartnersCount', this.dirPartners);
  } else {
    this.dirScore = this.dirScore === 'asc' ? 'desc' : 'asc';
    this.dirPartners = 'none'; 
    this.applySort('directSponsorshipScore', this.dirScore);
  }
}

private applySort(field: 'directPartnersCount' | 'directSponsorshipScore', dir: 'asc' | 'desc' | 'none') {
  if (dir === 'none') return; 

  const mul = dir === 'asc' ? 1 : -1;
  const num = (v: any) => Number.isFinite(+v) ? +v : 0;

  this.displayData = [...(this.dataBody ?? [])].sort((a: any, b: any) => {
    const A = num(a?.[field]), B = num(b?.[field]);
    if (A === B) return 0;
    return (A < B ? -1 : 1) * mul;
  });

  this.sortChange.emit({ field, dir });
}

  private resort(): void {
    const f = this.sortField;
    const dir = this.sortState[f] === 'asc' ? 1 : -1;
    const num = (v: any) => {
      const n = +v;
      return Number.isFinite(n) ? n : 0;
    };

    this.displayData = [...(this.dataBody ?? [])].sort((a: any, b: any) => {
      const A = num(a?.[f]), B = num(b?.[f]);
      if (A === B) {
        return String(a?.userName ?? '').localeCompare(String(b?.userName ?? ''));
      }
      return (A < B ? -1 : 1) * dir; 
    });

    this.tableService.updateTable(this.displayData, this.id, this.rows);
  }

  ngOnDestroy(): void {
    this.tableService.deleteTable(this.id);
  }

  onClickDetaol() {
    const id = this.selected.value;
    this.detailModal.emit(id);
  }

  get table() {
    return this.tableService.getTable<SponsorsListResponseDTO>(this.id);
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    this.pageChange.emit({ page: event.page, rows: event.rows });
  }


  resetPagination(): void {
    if (this.paginator) {
      this.paginator.resetPaginator();
    }
  }


  onRefresh(event: any) {
    this.rows = event.rows;
    this.refresh.emit({ rows: this.rows });
  }

  get headers() {
    const result = [
      'N°',
      'Rango',
      'Usuario',
      'Nombres y Apellidos',
      'Nivel de patrocinio',
      'Patrocinador',
      'N° Socios Directos',
      'Puntaje patrocinio directo',
      'Acciones'
    ];
    return result;
  }

  get minWidthHeaders() {
    const result = [5, 10, 50, 20, 100, 30, 40, 20, 20];
    return result;
  }

  onOpenModalDetail(): void {
    this.sendDataToKafka(this.selectedRecord.isUser, 'R');
    this.dialogRef = this.dialogService.open(ModalDetailSponsorshipListComponent, {
      header: "Detalle prueba",
      data: { record: this.selectedRecord }
    });
    this.dialogRef.onClose.subscribe(() => { });
  }

  sendDataToKafka(id: number, tipo: string) {
    const pointKafkaBody = { id, tipo };
    this.dashboardService.postPointsKafka(pointKafkaBody).subscribe(
      (response: any) => { },
      (error) => {
        console.error('Error al enviar datos a Kafka:', error);
      }
    );
  }

}
