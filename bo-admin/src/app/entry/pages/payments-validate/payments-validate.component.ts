import { PaymentsValidate } from './../../models/payments-validate.model';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';
import { EntryType } from '@app/event/models/entry-type.model';

import { ListToolbarComponent } from '@app/event/components/shared/list-toolbar/list-toolbar.component';
import { EntryStateComponent } from '../../components/shared/entry-state/entry-state.component';
import { FormsModule } from '@angular/forms';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { ModalAcceptComponent } from '@app/entry/components/modals/modal-accept/modal-accept.component';
import { ModalDenyComponent } from "@app/entry/components/modals/modal-deny/modal-deny.component";
import { PaymentsValidateService } from '@app/entry/services/payments-validate.service';
import { handleHttpError } from '@app/event/utils/handle-http-error.util';
import { NavigationEnd, Router } from '@angular/router';
import { filter, finalize } from 'rxjs/operators';
import { ModalNotifyComponent } from '@app/entry/components/modals/modal-notify/modal-notify.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payments-validate',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListToolbarComponent,
    TablePaginatorComponent,
    TableGenericComponent,
    ModalAcceptComponent,
    EntryStateComponent,
    ModalNotifyComponent,
    ModalDenyComponent
  ],
  templateUrl: './payments-validate.component.html',
  styleUrls: ['./payments-validate.component.scss']
})
export class PaymentsValidateComponent implements OnInit, OnDestroy {

  @ViewChild(ListToolbarComponent) toolbar!: ListToolbarComponent;
  private loadingModalRef: NgbModalRef | null = null;

  loading = true;
  showModal = false;
  showNotify = false;
  showDeleteModal = false;
  showModalDeny = false;

  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  notifyLoading = false;

  private resetTimeoutId: any;
  private resetIntervalId: any;
  private routerPaymentSub?: Subscription;

  allEntryTypes: EntryType[] = [];
  entryTypes: EntryType[] = [];

  allPaymentValidate: PaymentsValidate[] = [];
  paymentsValidate: PaymentsValidate[] = [];

  pageSize = 8;
  pageIndex = 1;

  totalPages = 0;
  currentPage = 0;

  selectedToDelete: EntryType | null = null;
  selectedToEdit: EntryType | null = null;
  editMode = false;

  clearCountdownText: string = '';
  isCountdownActive: boolean = false;

  selectedRow: PaymentsValidate | null = null;
  @Input() data: any;
  @Input() paymentId!: number;

  constructor(
    private cdr: ChangeDetectorRef,
    private paymentValidateService: PaymentsValidateService,
    private router: Router
  ){}

  ngOnInit() {
    this.loadPayments(0);
    this.routerPaymentSub = this.router.events.pipe(
      filter((entry): entry is NavigationEnd => entry instanceof NavigationEnd)
    ).subscribe(ent => {
      if(ent.urlAfterRedirects.includes('/payments-validate')){
        this.loadPayments(0);
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
    this.routerPaymentSub?.unsubscribe();
  }

  get pagedData(): PaymentsValidate[]{
    const start = (this.pageIndex -1) * this.pageSize;
    return this.paymentsValidate.slice(start, start + this.pageSize);
  }

  private normalizeUserName(name: unknown): string {
    const s = String(name ?? '').trim().toLowerCase();
    if (!s || s === 'null' || s === 'null null') return 'Socio';
    return String(name);
  }

  private parsePaymentDate(value: any): number {
    if (!value) return 0;
    const s = String(value).trim();

    // dd/MM/yyyy (opcionalmente con hora al final)
    const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+\d{2}:\d{2}(:\d{2})?)?$/);
    if (m) {
      const dd = parseInt(m[1], 10);
      const mm = parseInt(m[2], 10) - 1;
      const yyyy = parseInt(m[3], 10);
      return new Date(yyyy, mm, dd).getTime();
    }

    // ISO u otros formatos que Date pueda parsear
    const t = new Date(s).getTime();
    return isNaN(t) ? 0 : t;
  }

  loadPayments(page: number) {
    this.loading = true;
    this.paymentValidateService.validatePayments(page).subscribe({
      next: (res) => {
        if (res.result) {
          this.paymentsValidate = res.data.payments
            .map((p: any) => ({
              ...p,
              userName: this.normalizeUserName(p?.userName),
              detalles: {
                id: p.id,
                paymentDate: p.paymentDate || 'N/A',
                eventName: p.eventName || 'N/A',
                zone: p.zone || 'N/A',
                ticketQuantity: p.ticketQuantity || 'N/A',
                userType: p.userType || 'N/A',
                userName: this.normalizeUserName(p?.userName),
                ticketTypeName: p.ticketTypeName || 'N/A',
                sponsorName: p.sponsorName || 'N/A',
                promotionalCode: p.promotionalCode || '-',
                voucherOperationNumber: p.voucherOperationNumber || '-',
                paymentStatus: p.paymentStatus || 'Pendiente',
                totalAmount: p.totalAmount || 0,
                paymentMethod: p.paymentMethod || 'N/A'
              }
            }))
            .sort((a: any, b: any) => {
              const da = this.parsePaymentDate(a.paymentDate ?? a.detalles?.paymentDate);
              const db = this.parsePaymentDate(b.paymentDate ?? b.detalles?.paymentDate);
              return db - da;
            });

          this.allPaymentValidate = [...this.paymentsValidate];

          this.totalPages = res.data.totalPages;
          this.currentPage = res.data.currentPage;
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error cargando pagos', err);
      }
    });
  }

  validateSelectedPayment(data: { id: number; name?: string }) {
    const request$ = this.paymentValidateService.acceptPayments(data.id);

    this.loading = true;
    request$
      .pipe(finalize(() => { this.loading = false; this.hideLoadingModal(); }))
      .subscribe({
        next: () => {
          this.onCloseModal();

          this.notifyType = 'success';
          this.notifyTitle = 'Registro exitoso';
          this.notifyMessage = 'El pago de las entradas ha sido validado.';

          this.loadPayments(0);

          setTimeout(() => {
            this.showNotify = true;
            this.cdr.detectChanges();
          }, 0);
        },
        error: (err) => {
          const handled = handleHttpError(err);
          this.onCloseModal();

          setTimeout(() => {
            this.notifyType = handled.notifyType;
            this.notifyTitle = handled.notifyTitle;
            this.notifyMessage = handled.notifyMessage;
            this.showNotify = true;
            this.cdr.detectChanges();
          }, 0);
        }
      });
  }

  onPageChange(newPage: number){
    this.pageIndex = newPage;
  }

  onPageSizeChange(newSize: number){
    this.pageSize = newSize;
    this.pageIndex = 1;
  }

  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }

  onAccept(row: PaymentsValidate) {
    this.selectedRow = row;
    this.showModal = true;
  }

  onDeny(row: PaymentsValidate) {
    this.selectedRow = row;
    this.showModalDeny = true;
  }

  onCloseModal() {
    this.showModal = false;
    this.selectedRow = null;
  }

  onCloseModalDeny(){
    this.showModalDeny = false;
    this.selectedRow = null;
  }

  onAcceptCompleted(evt: { type: 'success'|'error'|'info'; title: string; message: string }) {
    this.notifyType = evt.type;
    this.notifyTitle = evt.title;
    this.notifyMessage = evt.message;

    setTimeout(() => {
      this.showNotify = true;
      this.cdr.detectChanges();
    }, 0);
  }

  onNotifyClosed() {
    this.showNotify = false;
    const page = this.currentPage ?? 0;
    setTimeout(() => {
      this.loadPayments(0);
      this.cdr.detectChanges();
    }, 0);
  }

  onDenyCompleted(evt: { type: 'success'|'error'|'info'; title: string; message: string }) {
    this.notifyType = evt.type;
    this.notifyTitle = evt.title;
    this.notifyMessage = evt.message;

    setTimeout(() => {
      this.showNotify = true;
      this.cdr.detectChanges();
    }, 0);
  }

  onCloseDenyModal() {
    this.showModalDeny = false;
    this.selectedRow = null;
  }

  onDenyClosed() {
    this.showModalDeny = false;
    this.selectedRow = null;
  }

  onSearch(value: string) {
    if (this.isCountdownActive) return;

    // Normaliza: quita acentos/diacríticos y pasa a minúsculas
    const normalize = (v: unknown) =>
      String(v ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();

    const query = normalize(value);

    // Limpia timers previos
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);

    // Si la query está vacía, restauramos
    if (!query) {
      this.paymentsValidate = [...this.allPaymentValidate];
      this.pageIndex = 1;
      this.clearCountdownText = '';
      this.cdr.detectChanges();
      return;
    }

    // Filtrado: busca en varios campos del pago y de "detalles"
    this.paymentsValidate = this.allPaymentValidate.filter((p: any) => {
      const d = p?.detalles ?? {};
      const fields = [
        p.paymentDate ?? d.paymentDate,
        d.eventName,
        d.zone,
        d.userType,
        d.userName,
        d.ticketTypeName,
        d.sponsorName,
        d.promotionalCode,
        d.paymentStatus,
        d.paymentMethod,
        p.id ?? d.id,
        p.totalAmount ?? d.totalAmount,
        p.ticketQuantity ?? d.ticketQuantity
      ];

      const haystack = fields.map(normalize).join(' ');
      return haystack.includes(query);
    });

    // Reinicia paginación
    this.pageIndex = 1;

    // Si no hay resultados, activa cuenta regresiva y limpia
    if (this.paymentsValidate.length === 0) {
      this.isCountdownActive = true;
      let secondsLeft = 3;
      this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;

      this.resetIntervalId = setInterval(() => {
        secondsLeft--;
        this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
        this.cdr.detectChanges();
      }, 1000);

      this.resetTimeoutId = setTimeout(() => {
        clearInterval(this.resetIntervalId);
        this.clearCountdownText = '';
        this.isCountdownActive = false;

        // Limpia el input del toolbar (si expone clear())
        this.toolbar?.clear?.();

        // Restaura la lista completa
        this.paymentsValidate = [...this.allPaymentValidate];
        this.pageIndex = 1;

        this.cdr.detectChanges();
      }, 3000);
    } else {
      this.clearCountdownText = '';
      this.cdr.detectChanges();
    }
  }

  onFilterByPaymentDate(dateISO: string) {
    // dateISO viene como 'YYYY-MM-DD' (o '' si limpian)
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);

    // si no hay fecha => restaurar listado completo
    if (!dateISO) {
      this.paymentsValidate = [...this.allPaymentValidate];
      this.pageIndex = 1;
      this.clearCountdownText = '';
      this.cdr.detectChanges();
      return;
    }

    // calculamos el rango [start, end) del día seleccionado en hora local
    const selected = new Date(dateISO);
    const start = new Date(
      selected.getFullYear(),
      selected.getMonth(),
      selected.getDate()
    ).getTime();
    const end = start + 24 * 60 * 60 * 1000;

    // filtramos por fecha de pago (top-level o en detalles)
    this.paymentsValidate = this.allPaymentValidate.filter((p: any) => {
      const raw = p?.paymentDate ?? p?.detalles?.paymentDate;
      const ts = this.parsePaymentDate(raw);
      return ts >= start && ts < end;
    });

    this.pageIndex = 1;

    // misma UX de cuenta regresiva si no hay resultados
    if (this.paymentsValidate.length === 0) {
      this.isCountdownActive = true;
      let secondsLeft = 3;
      this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;

      this.resetIntervalId = setInterval(() => {
        secondsLeft--;
        this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
        this.cdr.detectChanges();
      }, 1000);

      this.resetTimeoutId = setTimeout(() => {
        clearInterval(this.resetIntervalId);
        this.clearCountdownText = '';
        this.isCountdownActive = false;

        // si tu toolbar tiene método para limpiar la fecha, llámalo
        this.toolbar?.clearDate?.();

        // restaurar
        this.paymentsValidate = [...this.allPaymentValidate];
        this.pageIndex = 1;
        this.cdr.detectChanges();
      }, 3000);
    } else {
      this.clearCountdownText = '';
      this.cdr.detectChanges();
    }
  }
}
