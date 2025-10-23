import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { INITIAL_PAYMENTS_MOCK } from './mock';
import { ModalDetailPreviewComponent, DetailItem } from '@app/manage-prize/components/modals/payments/modal-detail-preview/modal-detail-preview.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalRejectComponent } from '@app/manage-prize/components/modals/payments/modal-reject/modal-reject.component';
@Component({
  selector: 'app-initial-payments',
  standalone: true,
  imports: [
    CommonModule,
    FilterGenericComponent,
    TableGenericComponent,
    TablePaginatorComponent,
    EmptyStateComponent,
    ModalDetailPreviewComponent,
    ModalNotifyComponent,
    ModalRejectComponent
  ],
  templateUrl: './initial-payments.component.html',
  styleUrls: ['./initial-payments.component.scss']
})
export class InitialPaymentsComponent implements OnInit {
  showDetailModal = false;
  showNotify = false;
  showReject = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyIconType: 'success' | 'info' | 'warning' | 'error' = 'success';
  modalTitle = 'Detalle de pago inicial';
  modalSubtitle = '';
  detailItems: DetailItem[] = [];
  detailPreviewSrc: string | null = null;
  private selectedRow: any | null = null;
  rejectionReasons: { id: number; label: string }[] = [
    { id: 1, label: 'Voucher inválido' },
    { id: 2, label: 'Monto incorrecto' },
    { id: 3, label: 'Datos inconsistentes' },
  ];

  filters: FilterGenericConfig[] = [
    { type: 'search', key: 'solicitante', label: 'Solicitante', order: 1, debounceMs: 400, preventLeadingSpace: true },
    { type: 'select', key: 'bonoAsignado', label: 'Tipo de bono', order: 2, options: [], showAllOption: true },
    { type: 'date', key: 'fechaSolicitud', label: 'Fecha de solicitud', order: 3 },
  ];
  filterValues: Record<string, any> = { solicitante: '', bonoAsignado: '', fechaSolicitud: '' };

  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'secondary', iconClass: 'bi bi-download' }
  ];

  onValuesChange(values: Record<string, any>) {
    this.filterValues = {
      solicitante: values.solicitante ?? '',
      bonoAsignado: values.bonoAsignado ?? '',
      fechaSolicitud: values.fechaSolicitud ?? '',
    };
    this.applyFilters();
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      alert('Exportar (mock)');
    }
  }

  columns: string[] = [
    'N°', 'Usuario socio', 'Solicitante', 'DNI', 'Fecha de solicitud', 'Código de operación', 'Bono asignado', 'Inicial fraccionada', 'Imagen'
  ];
  keys: string[] = [
    'item', 'userSocio', 'solicitante', 'dni', 'fechaSolicitud', 'codigoOperacion', 'bonoAsignado', 'inicialFraccionada', 'imagen'
  ];
  widths: string[] = [
    '5%', '12%', '15%', '10%', '12%', '12%', '10%', '12%', '6%'
  ];
  imageKeys: string[] = ['imagen'];

  private allRows = INITIAL_PAYMENTS_MOCK.map(x => ({ ...x }));
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

  onDeny(row: any) {
    this.selectedRow = row;
    this.showReject = true;
  }
  onAccept(row: any) {
    this.openDetailModal(row);
  }

  private openDetailModal(row: any) {

    this.modalSubtitle = row?.codigoOperacion ? `Aquí verás información detallada de la inicial registrada.` : '';

    this.detailPreviewSrc = row?.imagen ?? null;

    this.detailItems = [
      { label: 'Cód. de operación', value: row?.codigoOperacion, copy: true },
      { label: 'Fecha de Pago', value: row?.fechaSolicitud },
      { label: 'Inicial Fraccionada', value: row?.inicialFraccionada },
      { label: 'Servicio Gps', value: row?.gps ?? '0 USD' },
      { label: 'Total', value: row?.total ?? '0 USD' },
      { label: 'Fecha de vencimiento', value: row?.fechaVencimiento ?? '-' },
      { label: 'Estado', value: 'Pago por Validar', badge: 'info' },
      { label: 'Observación', value: 'Pago pendiente' }
    ];


    this.showDetailModal = true;
  }

  onModalPrimary() {
    this.showDetailModal = false;
    this.notifyTitle = 'Registro exitoso';
    this.notifyMessage = 'La solicitud de legalización ha sido aprobada';
    this.notifyIconType = 'success';
    this.showNotify = true;
  }

  onModalSecondary() {
    this.showDetailModal = false;
    this.showReject = true;
  }

  onModalClose() {
    this.showDetailModal = false;
  }
  onReject(evt: { reasonId: number | string; detail: string }) {
    this.showReject = false;
    this.notifyTitle = 'Pago rechazado';
    this.notifyMessage = 'Enviaremos el mensaje por correo al usuario.';
    this.notifyIconType = 'success';
    this.showNotify = true;
    this.selectedRow = null;
  }

  onRejectClose() {
    this.showReject = false;
    this.selectedRow = null;
  }

  private applyFilters() {
    const q = (this.filterValues.solicitante || '').toString().trim().toLowerCase();
    const tipo = (this.filterValues.bonoAsignado || '').toString().trim().toLowerCase();
    const fecha = (this.filterValues.fechaSolicitud || '').toString().trim();

    this.filteredRows = this.allRows.filter(r => {
      const okSolicitante = !q || (r.solicitante || '').toString().toLowerCase().includes(q);
      const okTipo = !tipo || (r.bonoAsignado || '').toString().toLowerCase() === tipo;
      const okFecha = !fecha || (r.fechaSolicitud || '') === fecha;
      return okSolicitante && okTipo && okFecha;
    });
    this.pageIndex = 1;
  }

  ngOnInit(): void {

    const filterTipo = this.filters.find(f => f.key === 'bonoAsignado' && f.type === 'select') as any;
    if (filterTipo) {
      const uniqueTipos = Array.from(new Set(this.allRows.map(r => r.bonoAsignado))).filter(Boolean) as string[];
      filterTipo.options = uniqueTipos.sort().map(v => ({ label: v, value: v }));
    }
    this.applyFilters();
  }
}
