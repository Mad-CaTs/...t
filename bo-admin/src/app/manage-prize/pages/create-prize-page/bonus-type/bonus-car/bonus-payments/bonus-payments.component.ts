import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { BONUS_PAYMENTS_MOCK } from './mock';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';

@Component({
  selector: 'app-bonus-payments',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent, ModalNotifyComponent],
  templateUrl: './bonus-payments.component.html',
  styleUrls: ['./bonus-payments.component.scss']
})
export class BonusPaymentsComponent {
  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'solicitante', label: 'Solicitante', order: 1, debounceMs: 300, preventLeadingSpace: true },
    { type: 'date', key: 'fechaDescuento', label: 'Fecha de descuento', order: 2 },
    { type: 'select', key: 'montoRecarga', label: 'Monto de recarga', order: 3, options: [], showAllOption: true }
  ];

  filterValues: Record<string, any> = { solicitante: '', fechaDescuento: '', montoRecarga: '' };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' },
    { key: 'pay', label: 'Pagar', variant: 'primary', iconClass: 'bi bi-cash' }
  ];
  genericColumns = ['N°', 'Usuario', 'Solicitante', 'Fecha de descuento', 'Monto Recarga (USD)', 'Monto Descuento (USD)', 'Concepto', 'Medio', 'Estado'];
  genericKeys = ['item', 'userSocio', 'usuario', 'fechaDescuento', 'montoRecargaUSD', 'montoDescuentoUSD', 'conceptoDescuento', 'medioPago', 'estado'];
  genericWidths = ['5%', '8%', '15%', '12%', '10%', '10%', '20%', '10%', '10%'];

  private allRows = BONUS_PAYMENTS_MOCK.map((x, i) => ({ ...x, item: i + 1 }));
  filteredRows = this.allRows.slice();

  pageSize = 8;
  pageIndex = 1;
  pagedData: any[] = [];

  ngOnInit(): void {
    this.applyFilters();
  }

  onValuesChange(values: Record<string, any>) {
    const next: Record<string, any> = { ...this.filterValues, ...values };
    if (!Object.prototype.hasOwnProperty.call(values, 'solicitante')) next.solicitante = '';
    if (!Object.prototype.hasOwnProperty.call(values, 'fechaDescuento')) next.fechaDescuento = '';
    if (!Object.prototype.hasOwnProperty.call(values, 'montoRecarga')) next.montoRecarga = '';
    this.filterValues = next;
    this.applyFilters();
  }

  onSearch(query: string) { this.filterValues.solicitante = query; this.applyFilters(); }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') { alert('Exportar (placeholder)'); return; }
    if (btn.key === 'pay') {
      const ids = this.allRows.filter(r => !!(r as any).selected).map(r => r.id);
      if (ids.length === 0) {
        this.openModal('require-selection', { title: 'Atención', message: 'Debes seleccionar al menos uno para pagar.', iconType: 'info', oneButton: true, primaryText: 'Entendido' });
        return;
      }
      const idsText = ids.join(', ');
      this.openModal('pay-confirm', { title: '¿Confirmar acción?', message: `Al pagar, se hará el aporte y descuento a todos los usuarios seleccionados (ids: ${idsText}). Si estás seguro, confirma la acción; de lo contrario, cancela.`, iconType: 'warning', oneButton: false, primaryText: 'Pagar', secondaryText: 'Cancelar', closeOnConfirm: false });
      return;
    }
  }

  modalOpen = false;
  modalConfig: { type?: string, title?: string, message?: string, iconType?: 'success'|'error'|'info'|'warning', oneButton?: boolean, primaryText?: string, secondaryText?: string, closeOnConfirm?: boolean } | null = null;

  openModal(type: string, cfg: any) {
    this.modalConfig = { type, ...cfg };
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
    this.modalConfig = null;
  }

  onModalConfirm() {
    const t = this.modalConfig?.type;
    this.closeModal();
    if (t === 'pay-confirm') {
      this.openModal('pay-success', { title: 'Pagos realizados Exitosamente', message: 'Los pagos y descuentos se realizaron exitosamente.', iconType: 'success', oneButton: true, primaryText: 'Entendido' });
    }
  }

  onModalCancel() { this.closeModal(); }
  onModalClose() { this.closeModal(); }

  getModalIcon(): 'success'|'error'|'info'|'warning' { return (this.modalConfig && this.modalConfig.iconType) ? this.modalConfig.iconType : 'info'; }

  onPageChange(index: number) { this.pageIndex = index; this.updatePagedData(); }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; this.updatePagedData(); }

  private updatePagedData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    this.pagedData = this.filteredRows.slice(start, start + this.pageSize);
  }

  private applyFilters(): void {
    const text = (this.filterValues.solicitante || '').toString().trim().toLowerCase();
    const fecha = (this.filterValues.fechaDescuento || '').toString().trim();
    const monto = (this.filterValues.montoRecarga || '').toString().trim();

    this.filteredRows = this.allRows.filter(row => {
      const matchText = !text || ((row.usuario || '') + ' ' + (row.userSocio || '')).toLowerCase().includes(text);
      const matchFecha = !fecha || (row.fechaDescuento || '') === fecha;
      const matchMonto = !monto || String(row.montoRecargaUSD) === monto;
      return matchText && matchFecha && matchMonto;
    });

    this.pageIndex = 1;
    this.updatePagedData();

    const fMonto = this.filters.find(x => x.key === 'montoRecarga' && x.type === 'select');
    if (fMonto && (!Array.isArray((fMonto as any).options) || (fMonto as any).options.length === 0)) {
      (fMonto as any).options = Array.from(new Set(this.allRows.map(r => r.montoRecargaUSD))).sort((a, b) => a - b).map(v => ({ label: v === 0 ? '0' : String(v), value: v }));
    }
  }
}
