import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { BonusHistoryService } from '@app/manage-prize/services/bonus-type/bonus-car/bonus-history.service';
import { IBonusHistorySearchParams } from '@app/manage-prize/interface/bonus-history-search-params';
import { ICarBonusItem, ICarBonusResponse } from '@app/manage-prize/interface/bonus-history';
import { LogoSpinnerComponent } from '@shared/components/logo-spinner/logo-spinner.component';

@Component({
  selector: 'app-bonus-history',
  standalone: true,
  imports: [
    CommonModule,
    FilterGenericComponent,
    TableGenericComponent,
    TablePaginatorComponent,
    EmptyStateComponent,
    LogoSpinnerComponent],
  templateUrl: './bonus-history.component.html',
  styleUrls: ['./bonus-history.component.scss']
})
export class BonusHistoryComponent implements OnInit {
  private allRows: ICarBonusItem[] = [];
  private filteredRows: ICarBonusItem[] = [];
  public loading: boolean = true;
  genericFilters: FilterGenericConfig[] = [
    { type: 'date', key: 'issueDate', label: 'Fecha de emisión', order: 1 },
    { type: 'date', key: 'dueDate', label: 'Fecha de vencimiento', order: 2 },
    {
      type: 'select', key: 'range', label: 'Rango', order: 3, options: []
    }
  ];
  filterValues: Record<string, any> = { issueDate: '', dueDate: '', range: '' };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  constructor(
    private _bonusHistoryService: BonusHistoryService,
    private cdr: ChangeDetectorRef) { }


  onFiltersChange(values: Record<string, any>) {
    this.filterValues = {
      issueDate: values.issueDate ?? '',
      dueDate: values.dueDate ?? '',
      range: values.range ?? ''
    };
    this.applyFilters();
    this.getBonusHistory();

  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      this.downloadBonusHistory()
    }
  }

  genericColumns: string[] = [
    'N°', 'Rango', 'Bono mensual', 'Bono inicial', 'Precio del bono', 'Fecha de emisión', 'Fecha de vencimiento'
  ];
  genericKeys: string[] = [
    'item', 'rank.name', 'monthlyBonus', 'initialBonus', 'bonusPrice', 'issueDate', 'expirationDate'
  ];
  genericWidths: string[] = [
    '5%', '15%', '12%', '12%', '16%', '14%', '14%'
  ];

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

  onPageChange(index: number) { this.pageIndex = index; }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; }

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
    this.getBonusHistory();
    const rangeFilter = this.genericFilters.find(f => f.key === 'range' && f.type === 'select') as any;
    if (rangeFilter) {
      const uniqueRanges = Array.from(new Set(this.allRows.map(r => r.rank)));
      rangeFilter.options = uniqueRanges.sort().map(v => ({ label: v, value: v }));
    }

    this.applyFilters();
    this.getRanges();
  }

  getBonusHistory() {
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
    dataRequest.onlyActive = false;
    dataRequest.page = this.pageIndex - 1;
    dataRequest.size = this.pageSize;
    return dataRequest;
  }

  downloadBonusHistory() {
    this._bonusHistoryService.exportBonusHistory().subscribe({
      next: (blob) => {
        // Crear un objeto URL temporal para el archivo
        const url = window.URL.createObjectURL(blob);

        // Crear un enlace invisible para descargar
        const a = document.createElement('a');
        a.href = url;
        a.download = 'car-assignments.xlsx';
        a.click();

        // Liberar el objeto URL
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar los datos:', err);
      },
    });
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
