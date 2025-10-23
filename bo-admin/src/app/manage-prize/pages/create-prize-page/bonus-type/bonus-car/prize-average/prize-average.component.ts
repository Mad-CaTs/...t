import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { CICLOS_PREMIOS_MOCK } from './mock';

// filter-generic
import {
  FilterGenericComponent,
  type FilterGenericConfig
} from '@shared/components/filters/filter-generic/filter-generic.component';

@Component({
  selector: 'app-prize-average',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableGenericComponent,
    TablePaginatorComponent,
    FilterGenericComponent
  ],
  templateUrl: './prize-average.component.html',
  styleUrls: ['./prize-average.component.scss']
})
export class PrizeAverageComponent {
  // Fuente de datos (mock)
  data = CICLOS_PREMIOS_MOCK;

  // Paginación
  pageSize = 8;
  pageIndex = 1;

  // Config de filtros (tres en una fila en desktop; el layout lo controlas en el HTML con [columnsDesktop])
  filters: FilterGenericConfig[] = [
    { type: 'date',   key: 'startDate', label: 'Fecha de Inicio', order: 1 },
    { type: 'date',   key: 'endDate',   label: 'Fecha de Límite', order: 2 },
    { type: 'select', key: 'rango',     label: 'Rango',           order: 3, options: ['Plata', 'Oro', 'Bronce'] }
  ];

  // Valores actuales de filtros
  filterValues: Record<string, any> = {
    startDate: '',
    endDate: '',
    rango: ''
  };

  // Resultado filtrado
  get filteredData() {
    const from  = this.parseDate(this.filterValues.startDate);
    const to    = this.parseDate(this.filterValues.endDate);
    const rango = (this.filterValues.rango || '').toString().trim().toLowerCase();

    return this.data.filter(row => {
      const fi = this.parseDate(row.fechaInicio);
      const ff = this.parseDate(row.fechaFin);

      const okFrom  = from ? (fi ? fi >= from : false) : true;
      const okTo    = to   ? (ff ? ff <= to   : false) : true;
      const okRango = rango ? (row.rango || '').toString().toLowerCase() === rango : true;

      return okFrom && okTo && okRango;
    });
  }

  // Página actual sobre el resultado filtrado
  get pagedData() {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.filteredData.slice(start, start + this.pageSize);
  }

  /* ==== Eventos de filtros y acciones ==== */

  onFiltersChange(values: Record<string, any>) {
    // Merge con defaults y reseteo de página
    this.filterValues = { startDate: '', endDate: '', rango: '', ...values };
    this.pageIndex = 1;
  }

  onAdd() {
    // Tu lógica de agregar
    alert('Acción: Agregar');
  }

  /* ==== Eventos de la tabla ==== */

  onView(item: any)  { alert(`Viewing item with id: ${item.id}`); }
  onEdit(item: any)  { alert(`Editing item with id: ${item.id}`); }
  onDelete(item: any){ alert(`Deleting item with id: ${item.id}`); }

  /* ==== Eventos del paginador ==== */

  onPageChange(pageIndex: number) { this.pageIndex = pageIndex; }
  onPageSizeChange(pageSize: number) {
    this.pageSize = pageSize;
    this.pageIndex = 1;
  }

  /* ==== Util: parser robusto de fechas ==== */
  private parseDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date && !isNaN(value.getTime())) return value;

    if (typeof value === 'string') {
      const v = value.trim();

      // dd/MM/yyyy
      const m1 = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
      if (m1) {
        const [, dd, mm, yyyy] = m1;
        const d = new Date(+yyyy, +mm - 1, +dd);
        return isNaN(d.getTime()) ? null : d;
      }

      // yyyy-MM-dd (del <input type="date">)
      const m2 = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
      if (m2) {
        const [, yyyy, mm, dd] = m2;
        const d = new Date(+yyyy, +mm - 1, +dd);
        return isNaN(d.getTime()) ? null : d;
      }

      // Fallback
      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  }
}
