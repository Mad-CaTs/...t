import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { BonusModalComponent, BonusFormMode, BonusInitialData, BonusPayload } from '@app/manage-prize/components/modals/bonus-type/bonus-card/bonus-modal/bonus-modal.component';
import { BonusHistoryService } from '@app/manage-prize/services/bonus-type/bonus-car/bonus-history.service';
import { ICarBonusItem, ICarBonusResponse } from '@app/manage-prize/interface/bonus-history';
import { IBonusHistorySearchParams } from '@app/manage-prize/interface/bonus-history-search-params';
import { IRankBonus } from '@app/manage-prize/interface/rank-bonus';
import { LogoSpinnerComponent } from '@shared/components/logo-spinner/logo-spinner.component';

@Component({
  selector: 'app-bonus-active',
  standalone: true,
  imports: [
    CommonModule,
    FilterGenericComponent,
    TableGenericComponent,
    TablePaginatorComponent,
    EmptyStateComponent,
    ModalConfirmDeleteComponent,
    ModalNotifyComponent,
    BonusModalComponent,
    LogoSpinnerComponent
  ],
  templateUrl: './bonus-active.component.html',
  styleUrls: ['./bonus-active.component.scss']
})
export class BonusActiveComponent implements OnInit {
  public loading: boolean = true;
  private allRows: ICarBonusItem[] = [];

  genericFilters: FilterGenericConfig[] = [
    { type: 'date', key: 'issueDate', label: 'Fecha de emisión', order: 1 },
    { type: 'date', key: 'dueDate', label: 'Fecha de vencimiento', order: 2 },
    {
      type: 'select', key: 'range', label: 'Rango', order: 3, options: [
        { label: 'Bronce', value: 'bronze' },
        { label: 'Plata', value: 'silver' },
        { label: 'Oro', value: 'gold' },
        { label: 'Platino', value: 'platinum' },
      ]
    }
  ];
  filterValues: Record<string, any> = { issueDate: '', dueDate: '', range: '' };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  constructor(
    private _bonusHistoryService: BonusHistoryService,
    private cdr: ChangeDetectorRef
  ) { }

  onFiltersChange(values: Record<string, any>) {
    this.filterValues = {
      issueDate: values.issueDate ?? '',
      dueDate: values.dueDate ?? '',
      range: values.range ?? ''
    };
    this.applyFilters();
    this.getBonusActive();
  }

  onActionAdd() {
    this.bonusModalMode = 'create';
    this.bonusModalInitialData = null;
    this.showBonusModal = true;
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      alert('Exportar (mock)');
    }
  }
  // Tabla
  genericColumns: string[] = [
    'N°', 'Rango', 'Bono mensual', 'Bono inicial', 'Precio del bono', 'Fecha de emisión', 'Fecha de vencimiento'
  ];
  genericKeys: string[] = [
    'item', 'rank.name', 'monthlyBonus', 'initialBonus', 'bonusPrice', 'issueDate', 'expirationDate'
  ];
  genericWidths: string[] = [
    '5%', '15%', '12%', '12%', '12%', '13%', '10%'
  ];

  // Datos base / filtrados
  // private allRows = BONUS_ACTIVE_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  // Paginación
  pageSize = 8;
  pageIndex = 1;

  get totalFiltered(): number { return this.filteredRows.length; }

  get pagedData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize).map((row, idx) => ({
      ...row,
      item: start + idx + 1
    }));
  }

  // Acciones de la tabla
  onViewRow(row: ICarBonusItem) {
    this.bonusModalMode = 'view';
    this.bonusModalInitialData = this.mapRowToInitial(row);
    this.showBonusModal = true;
  }
  onEditRow(row: any) {
    this.bonusModalMode = 'edit';
    this.bonusModalInitialData = this.mapRowToInitial(row);
    this.showBonusModal = true;
  }
  onDeleteRow(row: any) {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }

  // Eventos de paginador
  onPageChange(index: number) { this.pageIndex = index; }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; }

  // Aplicar filtros de fecha y rango
  private applyFilters() {
    const issue = (this.filterValues.issueDate || '').toString().trim();
    const due = (this.filterValues.dueDate || '').toString().trim();
    const range = (this.filterValues.range || '').toString().trim();

    this.filteredRows = this.allRows.filter(row => {
      const okIssue = !issue || row.issueDate === issue;
      const okDue = !due || row.expirationDate === due;
      const okRange = !range || row.rank.name === range;
      return okIssue && okDue && okRange;
    });
    this.pageIndex = 1;
  }

  ngOnInit(): void {
    this.getBonusActive();
    this.getRanges();
    // Inicializar opciones de Rango desde el mock
    const rangeFilter = this.genericFilters.find(f => f.key === 'range' && f.type === 'select') as any;
    if (rangeFilter) {
      const uniqueRanges = Array.from(new Set(this.allRows.map(r => r.rank)));
      rangeFilter.options = uniqueRanges.sort().map(v => ({ label: v, value: v }));
    }
    this.applyFilters();
  }

  showDeleteModal = false;
  showNotify = false;
  selectedToDelete: any = null;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' | 'warning' = 'success';

  onConfirmDelete() {
    const id = this.selectedToDelete?.id;
    if (id == null) return;
    const idx = this.allRows.findIndex(r => r.id === id);
    if (idx >= 0) this.allRows.splice(idx, 1);
    this.applyFilters();
    this.onCancelDelete();

    this._bonusHistoryService.delete(id).subscribe({
      next: (data) => {
        this.notifyType = 'success';
        this.notifyTitle = 'Eliminado';
        this.notifyMessage = 'El registro ha sido eliminado.';
        this.showNotify = true;
        this.getBonusActive();
        this.cdr.detectChanges();
      }, error: (error) => {
        this.notifyType = 'error';
        this.notifyTitle = 'Error';
        this.notifyMessage = 'Error al eliminar el registro.';
        this.showNotify = true;
        this.cdr.detectChanges();
      }
    });

  }

  onCancelDelete() {
    this.selectedToDelete = null;
    this.showDeleteModal = false;
  }

  onNotifyClose() { this.showNotify = false; }

  showBonusModal = false;
  bonusModalMode: BonusFormMode = 'create';
  bonusModalInitialData: BonusInitialData | null = null;

  mapRowToInitial(row: ICarBonusItem): BonusInitialData {
    return {
      id: row?.id,
      rankId: row?.rank?.id ?? null,
      monthlyAssignedUsd: row?.monthlyBonus ?? 0,
      bonusPriceUsd: row?.bonusPrice ?? 0,
      initialAssignedUsd: row?.initialBonus ?? 0,
      issueDate: row?.issueDate ?? '',
      dueDate: row?.expirationDate ?? ''
    };
  }

  onBonusSave(payload: BonusPayload) {
    if (this.bonusModalMode === 'create') {
      const nextId = (this.allRows.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) || 0) + 1;

      this._bonusHistoryService.save(this.convertRankBonus(payload)).subscribe({
        next: (data) => {
          this.showBonusModal = false;
          this.notifyType = 'success';
          this.notifyTitle = this.bonusModalMode === 'create' ? 'Creado' : 'Actualizado';
          this.notifyMessage = this.bonusModalMode === 'create' ? 'El bono ha sido creado.' : 'El bono ha sido actualizado.';
          this.showNotify = true;
          this.getBonusActive();
          this.cdr.detectChanges();
        }, error: (error) => {
          this.showBonusModal = false;
          this.notifyType = 'error';
          this.notifyTitle = 'Error';
          this.notifyMessage = 'Error al guardar bono.';
          this.showNotify = true;
          this.cdr.detectChanges();
        }
      });

    } else if (this.bonusModalMode === 'edit' && payload.id != null) {
      const idx = this.allRows.findIndex(r => r.id === payload.id);
      if (idx >= 0) {
        this._bonusHistoryService.update(payload.id, this.convertRankBonus(payload)).subscribe({
          next: (data) => {
            this.showBonusModal = false;
            this.notifyType = 'success';
            this.notifyTitle = this.bonusModalMode === 'create' ? 'Creado' : 'Actualizado';
            this.notifyMessage = this.bonusModalMode === 'create' ? 'El bono ha sido creado.' : 'El bono ha sido actualizado.';
            this.showNotify = true;
            this.getBonusActive();
            this.cdr.detectChanges();
          }, error: (error) => {
            this.showBonusModal = false;
            this.notifyType = 'error';
            this.notifyTitle = 'Error';
            this.notifyMessage = 'Error al actualizar bono.';
            this.showNotify = true;
            this.cdr.detectChanges();
          }
        });
      }
    }
  }

  onBonusClose() { this.showBonusModal = false; }

  private updateRangeOptionsFromRows() {
    const rangeFilter = this.genericFilters.find(f => f.key === 'range' && f.type === 'select') as any;
    if (rangeFilter) {
      const uniqueRanges = Array.from(new Set(this.allRows.map(r => r.rank.name)));
      rangeFilter.options = uniqueRanges.sort().map((v: string) => ({ label: v, value: v }));
    }
  }

  getBonusActive() {
    this.loading = true;
    this.allRows = [];
    this._bonusHistoryService.searchBonusHistory(this.convertDataRequest()).subscribe({
      next: (data: ICarBonusResponse) => {
        this.allRows = data.data.content;
        this.allRows = this.allRows.map((item, index) => ({
          ...item,
          item: index + 1,
          'rank.name': item.rank?.name ?? '-'
        }));
        this.filteredRows = this.allRows.slice();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.loading = false;
        this.cdr.detectChanges();
      }

    });
  }

  convertDataRequest(): IBonusHistorySearchParams {
    const dataRequest: IBonusHistorySearchParams = {} as IBonusHistorySearchParams;

    dataRequest.startDate = (this.filterValues.issueDate || '').toString().trim();
    dataRequest.endDate = (this.filterValues.dueDate || '').toString().trim();
    dataRequest.rankId = (this.filterValues.range || '').toString().trim();
    dataRequest.onlyActive = true;
    dataRequest.page = this.pageIndex - 1;
    dataRequest.size = this.pageSize;
    return dataRequest;
  }

  convertRankBonus(row: BonusPayload): IRankBonus {
    const rank: IRankBonus = {} as IRankBonus;
    rank.rankId = row.rankId;
    rank.bonusPrice = row.bonusPriceUsd;
    rank.expirationDate = row.dueDate;
    rank.initialBonus = row.initialAssignedUsd;
    rank.issueDate = row.issueDate;
    rank.monthlyBonus = row.monthlyAssignedUsd;
    return rank;
  }
  getRanges() {
    this._bonusHistoryService.getRanges().subscribe({
      next: (res) => {
        const modelFilter = this.genericFilters.find(f => f.key === 'range');
        if (modelFilter && modelFilter.type === 'select') {
          modelFilter.options = res.data.map((item: any) => ({
            label: item.name,
            value: item.idRange
          }));
        }
      },
      error: (error) => {
      }
    });
  }
}
