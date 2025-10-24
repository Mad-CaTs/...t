import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { INITIAL_PAYMENTS_MOCK } from './mock';
import { ModalDetailPreviewComponent, DetailItem } from '@app/manage-prize/components/modals/payments/modal-detail-preview/modal-detail-preview.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalRejectComponent } from '@app/manage-prize/components/modals/payments/modal-reject/modal-reject.component';
import { 
  PaymentListView, 
  PaymentSearchParams, 
  BonusType 
} from '@app/manage-prize/models/payments/payment.model';
import { Subject } from 'rxjs';
import { PaymentService } from '@app/manage-prize/services/payments/payment.service';
import { finalize, takeUntil } from 'rxjs/operators';
import * as saveAs from 'file-saver';

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
export class InitialPaymentsComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  loadingExport = false;
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
  private selectedPayment: PaymentListView | null = null;

  rejectionReasons: { id: number; label: string }[] = [
  { id: 1, label: 'EL CÓDIGO DE OPERACIÓN ES INCORRECTO O NO EXISTE' },
  { id: 2, label: 'PAGO POR BANCA MOVIL - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 3, label: 'PAGO POR BANCA POR INTERNET - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 4, label: 'PAGÓ POR AGENTE BCP LIMA - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 5, label: 'PAGÓ POR AGENTE BCP PROVINCIA - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 6, label: 'PAGÓ POR VENTANILLA BCP LIMA - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 7, label: 'PAGÓ POR VENTANILLA BCP PROVINCIA - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 8, label: 'PAGÓ POR CAJERO BCP - FALTA COMISIÓN POR OPERACIÓN' },
  { id: 9, label: 'HIZO TRANSFERENCIA INTERBANCARIA' },
  { id: 10, label: 'PAGÓ DESDE AGENTE INTERBANK' },
  { id: 11, label: 'PAGÓ DESDE VENTANILLA INTERBANK LIMA' },
  { id: 12, label: 'PAGÓ DESDE VENTANILLA INTERBANK PROVINCIA' },
  { id: 13, label: 'PAGÓ DESDE CAJERO INTERBANK' },
  { id: 14, label: 'LA CUENTA YAPE NO ESTA VINCULADA A UNA CUENTA DEL BCP' },
  { id: 15, label: 'EL MONTO PAGADO NO COINCIDE CON LO QUE DEBIÓ PAGAR SEGÚN EL TIPO DE CAMBIO DEL DÍA' },
  { id: 16, label: 'VOUCHER DUPLICADO' },
  { id: 17, label: 'SU PAGO NO HA INGRESADO A LA CUENTA DE LA EMPRESA' },
  { id: 18, label: 'OTROS' }
];

  filters: FilterGenericConfig[] = [
    { 
      type: 'search', 
      key: 'solicitante', 
      label: 'Solicitante', 
      order: 1, 
      debounceMs: 400, 
      preventLeadingSpace: true 
    },
    { 
      type: 'select', 
      key: 'bonoAsignado', 
      label: 'Tipo de bono', 
      order: 2, 
      options: [
        { label: 'Auto', value: BonusType.CAR.toString() },
        { label: 'Viajes', value: BonusType.TRAVEL.toString() },
        { label: 'Inmuebles', value: BonusType.PROPERTY.toString() }
      ], 
      showAllOption: true 
    },
    { 
      type: 'date', 
      key: 'fechaSolicitud', 
      label: 'Fecha de solicitud', 
      order: 3 
    },
  ];

  filterValues: Record<string, any> = { 
    solicitante: '', 
    bonoAsignado: '', 
    fechaSolicitud: '' 
  };

  extraButtons: FilterExtraButton[] = [
    { 
      key: 'export', 
      label: 'Exportar', 
      variant: 'secondary', 
      iconClass: 'bi bi-download' 
    }
  ];

  columns: string[] = [
    'N°', 'Usuario socio', 'Solicitante', 'DNI', 
    'Fecha de solicitud', 'Código de operación', 
    'Bono asignado', 'N° Cuota', 'Imagen'
  ];
  
  keys: string[] = [
    'item', 'username', 'memberFullName', 'nrodocument', 
    'paymentDate', 'operationNumber', 'bonusTypeName', 
    'installmentNum', 'voucherImageUrl'
  ];
  
  widths: string[] = [
    '5%', '12%', '15%', '10%', '12%', '12%', '10%', '10%', '6%'
  ];
  
  imageKeys: string[] = ['voucherImageUrl'];
  payments: PaymentListView[] = [];
  pageSize = 8;
  pageIndex = 0;
  totalElements = 0;
  
  get totalFiltered() { 
    return this.totalElements; 
  }
  
  get pagedData() {
    return this.payments.map((payment, idx) => ({
      ...payment,
      item: (this.pageIndex * this.pageSize) + idx + 1,
      paymentDate: this.formatDate(payment.paymentDate),
      installmentNum: `Cuota ${payment.installmentNum || 1}`
    }));
  }

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onValuesChange(values: Record<string, any>) {
    this.filterValues = {
      solicitante: values.solicitante ?? '',
      bonoAsignado: values.bonoAsignado ?? '',
      fechaSolicitud: values.fechaSolicitud ?? '',
    };
    this.pageIndex = 0;
    this.loadPayments();
  }

  onExtraAction(btn: FilterExtraButton) {
    if (btn.key === 'export') {
      this.exportData();
    }
  }

  onPageChange(index: number) { 
    this.pageIndex = index - 1; 
    this.loadPayments();
  }
  
  onPageSizeChange(size: number) { 
    this.pageSize = size; 
    this.pageIndex = 0;
    this.loadPayments();
  }

  onDeny(payment: PaymentListView) {
    this.selectedPayment = payment;
    this.showReject = true;
  }

  onAccept(payment: PaymentListView) {
    this.selectedPayment = payment;
    this.openDetailModal(payment);
  }

  private loadPayments() {
    this.loading = true;
    
    const params: PaymentSearchParams = {
      page: this.pageIndex,
      size: this.pageSize,
      sortBy: 'payment_date',
      asc: false
    };

    if (this.filterValues.solicitante) {
      params.member = this.filterValues.solicitante;
    }
    if (this.filterValues.bonoAsignado) {
      params.bonusType = parseInt(this.filterValues.bonoAsignado) as BonusType;
    }
    if (this.filterValues.fechaSolicitud) {
      params.paymentDate = this.filterValues.fechaSolicitud;
    }

    this.paymentService.getPendingPayments(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.result && response.data) {
            this.payments = response.data.content;
            this.totalElements = response.data.totalElements;
          }
        },
        error: (error) => {
          console.error('Error loading payments:', error);
          this.notifyTitle = 'Error';
          this.notifyMessage = 'No se pudieron cargar los pagos';
          this.notifyIconType = 'error';
          this.showNotify = true;
        }
      });
  }

  private exportData() {
    this.loadingExport = true;
    
    const params: PaymentSearchParams = {};
    
    if (this.filterValues.solicitante) {
      params.member = this.filterValues.solicitante;
    }
    if (this.filterValues.bonoAsignado) {
      params.bonusType = parseInt(this.filterValues.bonoAsignado) as BonusType;
    }
    if (this.filterValues.fechaSolicitud) {
      params.paymentDate = this.filterValues.fechaSolicitud;
    }

    this.paymentService.exportPendingPayments(params)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loadingExport = false)
      )
      .subscribe({
        next: (blob) => {
          const fileName = `pagos_pendientes_${new Date().toISOString().slice(0, 10)}.xlsx`;
          saveAs(blob, fileName);
        },
        error: (error) => {
          console.error('Error exporting payments:', error);
          this.notifyTitle = 'Error';
          this.notifyMessage = 'No se pudo exportar el archivo';
          this.notifyIconType = 'error';
          this.showNotify = true;
        }
      });
  }

  private openDetailModal(payment: PaymentListView) {
    this.modalSubtitle = payment.operationNumber 
      ? `Código de operación: ${payment.operationNumber}` 
      : '';

    this.detailPreviewSrc = payment.voucherImageUrl;

    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    };

    this.detailItems = [
      { 
        label: 'Cód. de operación', 
        value: payment.operationNumber, 
        copy: true 
      },
      { 
        label: 'Fecha de Pago', 
        value: this.formatDate(payment.paymentDate) 
      },
      { 
        label: 'N° de cuota', 
        value: `Cuota ${payment.installmentNum}` 
      },
      { 
        label: 'Subtotal', 
        value: formatCurrency(payment.subTotalAmount) 
      },
      { 
        label: 'Comisión', 
        value: formatCurrency(payment.commissionAmount) 
      },
      { 
        label: 'Tasa', 
        value: formatCurrency(payment.rateAmount) 
      },
      { 
        label: 'Total', 
        value: formatCurrency(payment.totalAmount) 
      },
      { 
        label: 'Fecha de vencimiento', 
        value: payment.dueDate ? this.formatDate(payment.dueDate) : '-' 
      },
      { 
        label: 'Estado', 
        value: payment.paymentStatusName || 'Pago por Validar', 
        badge: 'info' 
      }
    ];
    
    this.showDetailModal = true;
  }

  onModalPrimary() {
    if (!this.selectedPayment) return;
    
    this.loading = true;
    this.paymentService.approvePayment(this.selectedPayment.paymentId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.result) {
            this.showDetailModal = false;
            this.notifyTitle = 'Pago aprobado';
            this.notifyMessage = 'El pago ha sido aprobado exitosamente';
            this.notifyIconType = 'success';
            this.showNotify = true;
            this.loadPayments();
          }
        },
        error: (error) => {
          console.error('Error approving payment:', error);
          this.notifyTitle = 'Error';
          this.notifyMessage = 'No se pudo aprobar el pago';
          this.notifyIconType = 'error';
          this.showNotify = true;
        }
      });
  }

  onModalSecondary() {
    this.showDetailModal = false;
    this.showReject = true;
  }

  onModalClose() {
    this.showDetailModal = false;
    this.selectedPayment = null;
  }

  onReject(evt: { reasonId: number | string; detail: string }) {
    if (!this.selectedPayment) return;
    
    const request = {
      reasonId: typeof evt.reasonId === 'string' ? parseInt(evt.reasonId) : evt.reasonId,
      detail: evt.detail
    };

    this.loading = true;
    this.paymentService.rejectPayment(this.selectedPayment.paymentId, request)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          if (response.result) {
            this.showReject = false;
            this.notifyTitle = 'Pago rechazado';
            this.notifyMessage = 'Se ha notificado al usuario sobre el rechazo del pago';
            this.notifyIconType = 'success';
            this.showNotify = true;
            this.loadPayments(); 
          }
        },
        error: (error) => {
          console.error('Error rejecting payment:', error);
          this.notifyTitle = 'Error';
          this.notifyMessage = 'No se pudo rechazar el pago';
          this.notifyIconType = 'error';
          this.showNotify = true;
        }
      });
  }

  onRejectClose() {
    this.showReject = false;
    this.selectedPayment = null;
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }

  }
}
