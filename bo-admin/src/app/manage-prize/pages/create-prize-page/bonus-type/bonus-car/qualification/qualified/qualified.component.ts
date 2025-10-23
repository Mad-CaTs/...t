import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { QUALIFIED_MOCK } from './mock';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';

@Component({
  selector: 'app-qualified',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent, TablePaginatorComponent, EmptyStateComponent, ModalNotifyComponent],
  templateUrl: './qualified.component.html',
  styleUrls: ['./qualified.component.scss']
})
export class QualifiedComponent implements OnInit {
  constructor(private router: Router) {}
  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'search', label: 'Buscador', order: 1, debounceMs: 400, preventLeadingSpace: true },
    { type: 'select', key: 'range', label: 'Rango', order: 2, options: [], showAllOption: true },
    { type: 'select', key: 'estado', label: 'Estado', order: 3, options: [], showAllOption: true }
  ];

  filterValues: Record<string, any> = { search: '', range: '', estado: '' };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' },
    { key: 'notify', label: 'Notificar', variant: 'secondary', iconClass: 'bi bi-bell' }
  ];

  genericColumns: string[] = [
    'N°', 'Usuario', 'Nombre y Apellido', 'País de recidencia', 'Rango', 'Puntos Alcanzados', 'Puntos Meta', 'Fecha de cierre', 'N° Ciclos Recalificados', 'Estado'
  ];
  genericKeys: string[] = [ 'item', 'usuario', 'nombresApellidos', 'paisResidencia', 'rango', 'puntosAlcanzados', 'puntosMeta', 'fechaCierre', 'ciclosRecalificados', 'estado' ];
  genericWidths: string[] = [ '5%', '8%', '15%', '10%', '10%', '10%', '10%', '12%', '12%', '10%' ];

  private allRows = QUALIFIED_MOCK.map(x => ({ ...x }));
  private filteredRows = this.allRows.slice();

  pageSize = 8;
  pageIndex = 1;
  pagedData: any[] = [];

  modalOpen = false;
  modalConfig: { type?: string, title?: string, message?: string, iconType?: 'success'|'error'|'info'|'warning', oneButton?: boolean, primaryText?: string, secondaryText?: string, closeOnConfirm?: boolean } | null = null;

  ngOnInit(): void {
    this.applyFilters();
  }

  get totalFiltered(): number { return this.filteredRows.length; }

  private updatePagedData(): void {
    const start = (this.pageIndex - 1) * this.pageSize;
    this.pagedData = this.filteredRows.slice(start, start + this.pageSize);
  }

  private getSelectedIds(): number[] {
    return this.allRows.filter(r => !!(r as any).selected).map(r => r.id);
  }

  onValuesChange(values: Record<string, any>) {
    const next: Record<string, any> = { ...this.filterValues, ...values };
    if (!Object.prototype.hasOwnProperty.call(values, 'search')) next.search = '';
    this.filterValues = next;
    this.applyFilters();
  }

  onSearch(query: string) { this.filterValues.search = query; this.applyFilters(); }

  openModal(type: string, cfg: any) { this.modalConfig = { type, ...cfg }; this.modalOpen = true; }
  closeModal() { this.modalOpen = false; this.modalConfig = null; }

  onModalConfirm() {
    const t = this.modalConfig?.type;
    this.closeModal();
    if (t === 'notify-confirm') {
      this.openModal('notify-success', { title: 'Notificación enviada', message: 'Se notificó correctamente.', iconType: 'success', oneButton: true, primaryText: 'Entendido' });
    }
  }

  onModalCancel() { this.closeModal(); }
  onModalClose() { this.closeModal(); }

  getModalIcon(): 'success'|'error'|'info'|'warning' { return (this.modalConfig && this.modalConfig.iconType) ? this.modalConfig.iconType : 'info'; }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') { alert('Exportar (placeholder)'); return; }
    if (btn.key === 'notify') {
      const ids = this.getSelectedIds();
      if (ids.length === 0) {
        this.openModal('require-selection', { title: 'Atención', message: 'Debes seleccionar al menos uno para usar Notificar.', iconType: 'info', oneButton: true, primaryText: 'Entendido' });
      } else {
        const idsText = ids.join(', ');
        this.openModal('notify-confirm', { title: 'Recuerda', message: `Al aceptar notificar, les llegará la notificación a los ids: ${idsText}. Si estás seguro, puedes continuar; de lo contrario, se recomienda cancelar.`, iconType: 'warning', oneButton: false, primaryText: 'Notificar', secondaryText: 'Cancelar', closeOnConfirm: false });
      }
      return;
    }
  }

  onViewRow(row: any) {
    const id = row?.id;
    if (id != null) {
      this.router.navigateByUrl(`/dashboard/manage-prize/bonus-type/car/qualification/detail-partner-rating/${id}?from=qualified`);
      return;
    }
    alert(`Ver fila: ${row?.usuario || row?.id}`);
  }

  onEditRow(row: any) {
    const id = row?.id;
    if (id != null) {
      this.router.navigateByUrl(`/dashboard/manage-prize/bonus-type/car/qualification/detail-partner-rating/${id}?from=qualified`);
      return;
    }
    alert(`Editar fila: ${row?.usuario || row?.id}`);
  }
  onDeleteRow(row: any) { alert(`Eliminar fila: ${row?.usuario || row?.id}`); }

  onViewRowNavigate(row: any) {
    const id = row?.id;
    if (id != null) {
      (window as any).location.href = `/dashboard/manage-prize/bonus-type/car/qualification/detail-partner-rating/${id}?from=qualified`;
      return;
    }
    alert(`Ver fila: ${row?.usuario || row?.id}`);
  }

  onPageChange(index: number) { this.pageIndex = index; this.updatePagedData(); }
  onPageSizeChange(size: number) { this.pageSize = size; this.pageIndex = 1; this.updatePagedData(); }

  private applyFilters() {
    const text = (this.filterValues.search || '').toString().trim().toLowerCase();
    const range = (this.filterValues.range || '').toString().trim();
    const estado = (this.filterValues.estado || '').toString().trim();

    this.filteredRows = this.allRows.filter(row => {
      const matchText = !text || (
        (row.usuario || '').toString().toLowerCase().includes(text) ||
        (row.nombresApellidos || '').toString().toLowerCase().includes(text)
      );
      const matchRange = !range || row.rango === range;
      const matchEstado = !estado || (row.estado || '').toString() === estado;
      return matchText && matchRange && matchEstado;
    });

    this.pageIndex = 1;
    this.updatePagedData();

    const fRange = this.filters.find(x => x.key === 'range' && x.type === 'select');
    if (fRange && (!Array.isArray((fRange as any).options) || (fRange as any).options.length === 0)) {
      (fRange as any).options = Array.from(new Set(this.allRows.map(r => r.rango))).sort().map(v => ({ label: v, value: v }));
    }

    const fEstado = this.filters.find(x => x.key === 'estado' && x.type === 'select');
    if (fEstado && (!Array.isArray((fEstado as any).options) || (fEstado as any).options.length === 0)) {
      (fEstado as any).options = Array.from(new Set(this.allRows.map(r => r.estado))).sort().map(v => ({ label: v, value: v }));
    }
  }
}
