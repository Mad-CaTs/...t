import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { PROFORMAS_LIST_MOCK } from './mock';
import { Router } from '@angular/router';

@Component({
  selector: 'app-proformas-list',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent],
  templateUrl: './proformas-list.component.html',
  styleUrls: ['./proformas-list.component.scss']
})
export class ProformasListComponent implements OnInit {
  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'search', label: 'Buscador', order: 1, debounceMs: 400, preventLeadingSpace: true },
    { type: 'select', key: 'range', label: 'Rango', order: 2, options: [], showAllOption: true },
    { type: 'select', key: 'memberType', label: 'Tipo de Socio', order: 3, options: [], showAllOption: true },
    { type: 'select', key: 'status', label: 'Estado', order: 4, options: [], showAllOption: true },
  ];

  filterValues: Record<string, any> = {
    search: '',
    range: '',
    memberType: '',
    status: ''
  };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  genericColumns: string[] = [
    'N°', 'Usuario', 'Nombre y Apellido', 'País', 'Rango', 'Fecha de Registro', 'Tipo de Socio', 'Estado'
  ];
  genericKeys: string[] = [
    'item', 'usuario', 'nombreApellido', 'pais', 'rango', 'fechaRegistro', 'tipoSocio', 'estado'
  ];
  genericWidths: string[] = [
    '5%', '8%', '20%', '10%', '12%', '10%', '12%', '10%'
  ];

  // Datos base y filtrados
  private allRows = PROFORMAS_LIST_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  // Paginación
  pageSize = 8;
  pageIndex = 1;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.applyFilters(); // inicializa opciones y dataset paginado
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
    const id = row?.id ?? '';
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/proformas/view', id]);
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
    const memberType = (this.filterValues.memberType || '').toString().trim();
    const status = (this.filterValues.status || '').toString().trim();

    this.filteredRows = this.allRows.filter(row => {
      const matchText = !text || (
        row.usuario.toLowerCase().includes(text) ||
        row.nombreApellido.toLowerCase().includes(text)
      );
      const matchRange = !range || row.rango === range;
      const matchMemberType = !memberType || row.tipoSocio === memberType;
      const matchStatus = !status || row.estado === status;
      return matchText && matchRange && matchMemberType && matchStatus;
    });

    this.pageIndex = 1;

    const ensureOptions = (key: 'range' | 'memberType' | 'status', values: string[]) => {
      const f = this.filters.find(x => x.key === key && x.type === 'select');
      if (f && (!Array.isArray((f as any).options) || (f as any).options.length === 0)) {
        (f as any).options = Array.from(new Set(values)).sort().map(v => ({ label: v, value: v }));
      }
    };

    ensureOptions('range', this.allRows.map(r => r.rango));
    ensureOptions('memberType', this.allRows.map(r => r.tipoSocio));
    ensureOptions('status', this.allRows.map(r => r.estado));
  }
}
