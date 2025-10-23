import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { PROFORMAS_SELECTED_MOCK } from './mock';

@Component({
  selector: 'app-proformas-selected',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent],
  templateUrl: './proformas-selected.component.html',
  styleUrls: ['./proformas-selected.component.scss']
})
export class ProformasSelectedComponent implements OnInit {
  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'search', label: 'Buscador', order: 1, debounceMs: 400, preventLeadingSpace: true },
    { type: 'select', key: 'range', label: 'Rango', order: 2, options: [], showAllOption: true },
  ];

  filterValues: Record<string, any> = {
    search: '',
    range: '',
  };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  genericColumns: string[] = [
    'N°', 'Usuario', 'Nombre y Apellido', 'País', 'Rango', 'Fecha de Registro'
  ];
  genericKeys: string[] = [
    'item', 'usuario', 'nombresApellidos', 'pais', 'rango', 'fechaRegistro'
  ];
  genericWidths: string[] = [
    '5%', '10%', '25%', '15%', '15%', '15%'
  ];

  private allRows = PROFORMAS_SELECTED_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  pageSize = 8;
  pageIndex = 1;

  ngOnInit(): void {
    this.applyFilters();
  }

  get totalFiltered(): number { return this.filteredRows.length; }

  get pagedData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    const page = this.filteredRows.slice(start, start + this.pageSize).map((row, idx) => ({
      ...row,
      item: start + idx + 1
    }));
    return page as any[];
  }

  onValuesChange(values: Record<string, any>) {
    const next: Record<string, any> = { ...this.filterValues, ...values };
    if (!Object.prototype.hasOwnProperty.call(values, 'search')) {
      next.search = '';
    }
    this.filterValues = next;
    this.applyFilters();
  }

  onSearch(query: string) {
    this.filterValues.search = query;
    this.applyFilters();
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      alert('Exportar (placeholder)');
    }
  }

  onViewRow(row: any) {
    alert(`sin función aún`);
  }

  onPageChange(index: number) {
    this.pageIndex = index;
  }

  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.pageIndex = 1;
  }

  private applyFilters() {
    const text = (this.filterValues.search || '').toString().trim().toLowerCase();
    const range = (this.filterValues.range || '').toString().trim();

    this.filteredRows = this.allRows.filter(row => {
      const matchText = !text || (
        row.usuario.toLowerCase().includes(text) ||
        row.nombresApellidos.toLowerCase().includes(text)
      );
      const matchRange = !range || row.rango === range;
      return matchText && matchRange;
    });

    this.pageIndex = 1;

    const f = this.filters.find(x => x.key === 'range' && x.type === 'select');
    if (f && (!Array.isArray((f as any).options) || (f as any).options.length === 0)) {
      (f as any).options = Array.from(new Set(this.allRows.map(r => r.rango)))
        .sort()
        .map(v => ({ label: v, value: v }));
    }
  }
}
