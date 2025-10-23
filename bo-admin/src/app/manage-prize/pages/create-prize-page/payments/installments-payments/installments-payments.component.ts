import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { INSTALLMENTS_PAYMENTS_MOCK } from './mock';

@Component({
  selector: 'app-installments-payments',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent],
  templateUrl: './installments-payments.component.html',
  styleUrls: ['./installments-payments.component.scss']
})
export class InstallmentsPaymentsComponent implements OnInit {

  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'solicitante', label: 'Solicitante', order: 1, debounceMs: 400, preventLeadingSpace: true },
    { type: 'select', key: 'bonoAsignado', label: 'Tipo de bono', order: 2, options: [], showAllOption: true },
    { type: 'date', key: 'fechaDescuento', label: 'Fecha de descuento', order: 3 },
    { type: 'select', key: 'montoRecargaUSD', label: 'Monto de recarga (USD)', order: 4, options: [], showAllOption: true },
  ];
  values: Record<string, any> = { solicitante: '', bonoAsignado: '', fechaDescuento: '', montoRecargaUSD: '' };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  onValuesChange(v: Record<string, any>) {

    const prev = this.values?.montoRecargaUSD ?? '';
    const nextMonto = v.montoRecargaUSD ?? '';

    this.values = {
      solicitante: v.solicitante ?? '',
      bonoAsignado: v.bonoAsignado ?? '',
      fechaDescuento: v.fechaDescuento ?? '',
      montoRecargaUSD: nextMonto,
    };

    if (String(nextMonto) !== '' && String(nextMonto) !== String(prev)) {
      alert(`Filtro Monto de recarga: ${nextMonto}`);
    }

    this.applyFilters();
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      alert('Exportar (mock)');
    }
  }

  columns: string[] = [
    'N°', 'Usuario socio', 'Solicitante', 'Fecha de descuento', 'Monto recarga (USD)', 'Monto descuento (USD)', 'Tipo de bono', 'Concepto', 'Medio de pago', 'Estado'
  ];
  keys: string[] = [
    'item', 'userSocio', 'solicitante', 'fechaDescuento', 'montoRecargaUSD', 'montoDescuentoUSD', 'bonoAsignado', 'conceptoDescuento', 'medioPago', 'estado'
  ];
  widths: string[] = [
    '5%', '12%', '16%', '12%', '10%', '12%', '10%', '18%', '10%', '10%'
  ];

  private allRows = INSTALLMENTS_PAYMENTS_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  pageSize = 8;
  pageIndex = 1;
  get totalFiltered() { return this.filteredRows.length; }
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
    const q = (this.values.solicitante || '').toString().trim().toLowerCase();
    const tipo = (this.values.bonoAsignado || '').toString().trim().toLowerCase();
    const fecha = (this.values.fechaDescuento || '').toString().trim();
    const monto = (this.values.montoRecargaUSD || '').toString().trim(); // string o ''

    this.filteredRows = this.allRows.filter(r => {
      const okSolicitante = !q || (r.solicitante || '').toString().toLowerCase().includes(q);
      const okTipo = !tipo || (r.bonoAsignado || '').toString().toLowerCase() === tipo;
      const okFecha = !fecha || (r.fechaDescuento || '') === fecha;
      const okMonto = !monto || String(r.montoRecargaUSD) === monto;
      return okSolicitante && okTipo && okFecha && okMonto;
    });
    this.pageIndex = 1;
  }

  ngOnInit(): void {
    const bonoFilter = this.filters.find(f => f.key === 'bonoAsignado' && f.type === 'select') as any;
    if (bonoFilter) {
      const tipos = Array.from(new Set(this.allRows.map(r => r.bonoAsignado))).filter(Boolean) as string[];
      bonoFilter.options = tipos.sort().map(v => ({ label: v, value: v }));
    }

    const montoFilter = this.filters.find(f => f.key === 'montoRecargaUSD' && f.type === 'select') as any;
    if (montoFilter) {
      const montos = Array.from(new Set(this.allRows.map(r => r.montoRecargaUSD))).filter(v => v != null) as number[];
      montoFilter.options = montos.sort((a, b) => a - b).map(v => ({ label: `$${v}`, value: String(v) }));
    }

    this.applyFilters();
  }
}
