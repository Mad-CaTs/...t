import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { DOCUMENTS_MOCK } from './mock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'search', label: 'Buscador', order: 1, debounceMs: 400, preventLeadingSpace: true },
    { type: 'select', key: 'range', label: 'Rango', order: 2, options: [], showAllOption: true },
    { type: 'select', key: 'documentsCount', label: 'Número de documentos', order: 3, options: [], showAllOption: true },
  ];

  filterValues: Record<string, any> = {
    search: '',
    range: '',
    documentsCount: ''
  };

  extraButtons: FilterExtraButton[] = [];

  genericColumns: string[] = [
    'N°', 'Usuario', 'Nombre y Apellido', 'Auto', 'Rango', 'Última modificación', 'N° documentos'
  ];
  genericKeys: string[] = [
    'item', 'usuario', 'nombresApellidos', 'auto', 'rango', 'ultimaModificacion', 'numeroDocumentos'
  ];
  genericWidths: string[] = [
    '5%', '10%', '20%', '22%', '12%', '12%', '7%'
  ];

  private allRows = DOCUMENTS_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  pageSize = 8;
  pageIndex = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  get totalFiltered(): number { return this.filteredRows.length; }

  get pagedData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize).map((row, idx) => ({
      ...row,
      item: start + idx + 1,
    }));
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

  onViewRow(row: any) {
    const id = row?.id ?? '';
    if (!id) {
      alert('No se encontró el ID del registro');
      return;
    }
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/documents/partner', id]);
  }

  onPageChange(index: number) { this.pageIndex = index; }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; }

  private applyFilters() {
    const text = (this.filterValues.search || '').toString().trim().toLowerCase();
    const range = (this.filterValues.range || '').toString().trim();
    const documentsCount = (this.filterValues.documentsCount || '').toString().trim();

    this.filteredRows = this.allRows.filter(row => {
      const matchText = !text || (
        (row.usuario || '').toString().toLowerCase().includes(text) ||
        (row.nombresApellidos || '').toString().toLowerCase().includes(text) ||
        (row.auto || '').toString().toLowerCase().includes(text)
      );
      const matchRange = !range || row.rango === range;
      const matchDocs = !documentsCount || (row.numeroDocumentos?.toString() === documentsCount);
      return matchText && matchRange && matchDocs;
    });

    this.pageIndex = 1;

    const ensureOptions = (key: 'range' | 'documentsCount', values: Array<string | number>) => {
      const f = this.filters.find(x => x.key === key && x.type === 'select');
      if (f && (!Array.isArray((f as any).options) || (f as any).options.length === 0)) {
        (f as any).options = Array.from(new Set(values))
          .map(v => v?.toString())
          .filter(v => v && v.length > 0)
          .sort((a, b) => a.localeCompare(b))
          .map(v => ({ label: v, value: v }));
      }
    };

    ensureOptions('range', this.allRows.map(r => r.rango));
    ensureOptions('documentsCount', this.allRows.map(r => r.numeroDocumentos));
  }
}
