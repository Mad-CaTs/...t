import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';
import { PublicEventService } from '../events/services/public-event.service';
import { EventDiscountService, ValidateDiscountRequest, CheckDiscountResponse } from '../events/services/event-discount.service';

import { CheckoutHeaderComponent } from './components/checkout-header/checkout-header.component';
import { CheckoutCountdownComponent } from './components/checkout-countdown/checkout-countdown.component';
import { CheckoutStepAttendeeComponent } from './components/checkout-step-attendee/checkout-step-attendee.component';
import { CheckoutOrderSummaryComponent } from './components/checkout-order-summary/checkout-order-summary.component';
import { CheckoutStepPaymentComponent, PaymentMethod, PaymentMethodId } from './components/checkout-step-payment/checkout-step-payment.component';
// Payment modals
import { BilleteraModalComponent } from './components/payment-modals/billetera-modal/billetera-modal.component';
import { TransferenciaModalComponent } from './components/payment-modals/transferencia-modal/transferencia-modal.component';
import { WalletModalComponent } from './components/payment-modals/wallet-modal/wallet-modal.component';
import { PaypalModalComponent } from './components/payment-modals/paypal-modal/paypal-modal.component';
import { TarjetaModalComponent } from './components/payment-modals/tarjeta-modal/tarjeta-modal.component';
import { SuccessModalComponent } from './components/payment-modals/success-modal/success-modal.component';

import type { PurchaseOption } from './components/checkout-step-purchase/checkout-step-purchase.component';
import { WalletService } from '../../../profiles/pages/ambassador/pages/wallet/commons/services/wallet.service';

// Service + tipos de pago
import { PaymentService, PaymentRequest } from './services/payment.service';
import { handleHttpError } from '@shared/utils/handle-http-error.util';

import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { finalize } from 'rxjs/operators';

import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { CookieService } from 'ngx-cookie-service';

import { DocumentUserService } from 'src/app/init-app/pages/public-access/auth/services/document-user.service';

type NotifyIcon = 'info' | 'success' | 'warning' | 'error';

type DocTypeKey = 'dni' | 'ce' | 'passport' | 'libAdol';

// ⬇️ Mapa dinámico (sin hardcode). Se llena en ngOnInit() desde el EP.
type DocTypeIdMap = Partial<Record<DocTypeKey, string>>;

@Component({
  selector: 'app-purchase-checkout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CheckoutHeaderComponent,
    CheckoutCountdownComponent,
    CheckoutStepAttendeeComponent,
    CheckoutOrderSummaryComponent,
    CheckoutStepPaymentComponent,
    // Modals
    BilleteraModalComponent,
    TransferenciaModalComponent,
    WalletModalComponent,
    PaypalModalComponent,
    TarjetaModalComponent,
    SuccessModalComponent,
    // Spinner
    LogoSpinnerComponent,
    // ✅ Modal notify
    ModalNotifyComponent
  ],
  templateUrl: './purchase-checkout.component.html',
  styleUrl: './purchase-checkout.component.scss'
})
export class PurchaseCheckoutComponent implements OnInit {
  data: any | null = null;
  private eventInfo: any | null = null;

  // flujo
  step: 1 | 2 | 3 = 1;

  // Paso 1: asistentes
  attendeeValid = false;
  attendeeData: Array<{
    entryType: string;
    docType: DocTypeKey;
    docNumber: string;
    firstName: string;
    lastName: string;
  }> = [];

  // Paso 2: opción de compra (por defecto NO reembolsable)
  purchaseOption: PurchaseOption = { refundable: false, feePerTicket: 5.9 };

  // Paso 3: métodos de pago
  paymentMethods: PaymentMethod[] = [
    // { id: 'yape', ... } // oculto temporalmente
    // { id: 'card', ... } // oculto temporalmente
    { id: 'bcp', title: 'Pago con transferencia BCP', icons: ['assets/icons/payments/BCP.svg'] },
    { id: 'interbank', title: 'Pago con transferencia Interbank', icons: ['assets/icons/payments/Interbank.svg'] },
    { id: 'other', title: 'Pago con otros medios', icons: ['assets/icons/payments/Otros-Bancos.svg'] },
    { id: 'wallet', title: 'Pago con Wallet', icons: ['assets/icons/payments/Wallet.svg'] },
    // { id: 'paypal', ... } // oculto temporalmente
  ];
  selectedPayment: PaymentMethodId | null = null;

  // Estado de modales
  showBilleteraModal = false;
  showTransferenciaModal = false;
  showWalletModal = false;
  showPaypalModal = false;
  showTarjetaModal = false;
  showSuccessModal = false;

  // Método bancario actual para transferencia
  currentBankMethod: 'bcp' | 'interbank' | 'otrosMedios' = 'bcp';

  // Config del modal de éxito
  successModalConfig = {
    title: '¡Pago Exitoso!',
    message: 'Tu pago ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.',
    icon: '✓',
    iconColor: '#10b981'
  };

  userName = 'Invitado';
  userDoc: string | null = null;

  // Saldos wallet (cargados al abrir modal)
  walletAvailable = 0;
  walletAccounting = 0;
  walletLoading = false;

  // Spinner global (pantalla completa)
  isSubmitting = false; // para envío de pago
  get showGlobalSpinner(): boolean {
    return this.walletLoading || this.isSubmitting;
  }

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyIcon: NotifyIcon = 'info';

  private successRedirectTimer: any = null;
  private readonly successAutoRedirectMs = 4200;

  private docTypeIdMap: DocTypeIdMap = {};

  constructor(
    private router: Router,
    private pending: PendingPurchaseService,
    private cdr: ChangeDetectorRef,
    private eventService: PublicEventService,
    private walletService: WalletService,
    private paymentService: PaymentService,
    private cookieService: CookieService,
    private documentUserService: DocumentUserService,
    private eventDiscountService: EventDiscountService
  ) { }

  forceHeaderReload(): void {
    const userType = this.data?.user?.type; 
    //console.log('[PurchaseCheckout] forceHeaderReload:', userType);
    if (userType === 'guest') {
      this.cookieService.delete('authData');
    } else if (userType === 'member') {
      localStorage.removeItem('guestToken');
      localStorage.removeItem('guestUserId');
    }
    this.router.navigate([this.router.url]);
  }

  ngOnInit(): void {
    this.data = this.pending.get();
    this.forceHeaderReload();

    // Cargar mapa de tipos de documento desde el EP (id por nombre)
    this.documentUserService.getDocumentTypes().subscribe({
      next: (types) => {
        const byName = new Map(
          (types || []).map(t => [String(t.name ?? '').trim().toLowerCase(), String(t.id)])
        );
        // Nombres tal como vienen del EP: 'DNI', 'CE', 'Pasaporte', 'Lib. Adol. Trab.'
        this.docTypeIdMap = {
          dni: byName.get('dni'),
          ce: byName.get('ce'),
          passport: byName.get('pasaporte'),
          libAdol: byName.get('lib. adol. trab.')
        };
      },
      error: () => {
        this.docTypeIdMap = {}; // el backend validará si llega vacío
      }
    });

    // Sanitizar método de pago si quedó uno deshabilitado (yape/paypal/card)
    const disabled = (id: any) => id === 'yape' || id === 'paypal' || id === 'card';
    if (this.data && disabled((this.data as any).paymentMethod)) {
      (this.data as any).paymentMethod = null;
      this.selectedPayment = null;
      this.pending.set({ ...this.data, paymentMethod: null });
    }
    if (this.data) {
      const id = Number(this.data.eventId);
      if (Number.isFinite(id)) {
        this.eventService.getById(id).subscribe({
          next: (info) => { this.eventInfo = info; },
          error: () => { /* silencioso */ }
        });
      }
      // Habilitar/Deshabilitar método Wallet según tipo de usuario (socio vs invitado)
      const isMember = this.data?.user?.type === 'member';
      if (!isMember) {
        this.paymentMethods = this.paymentMethods.filter(m => m.id !== 'wallet');
        if (this.selectedPayment === 'wallet') {
          this.selectedPayment = null;
          (this.data as any).paymentMethod = null;
          this.pending.set({ ...this.data, paymentMethod: null });
        }
      }
    } else {
    }
  }

  onLogout(): void {
  }

  onTimerExpired(): void {
    this.cancelar();
  }

  // Botón principal del resumen (derecha)
  onSummaryConfirm(): void {
    if (this.step === 1) {
      if (!this.attendeeValid) return;
      // Omitir Paso 2 (opción de compra) y pasar directo al pago
      queueMicrotask(() => { this.step = 3; });
      return;
    }
    if (this.step === 2) {
      queueMicrotask(() => { this.step = 3; });
      return;
    }
    if (this.step === 3) {
      const id = this.selectedPayment;
      if (!id) return; // botón deshabilitado evita este caso
      if (id === 'yape' || id === 'paypal' || id === 'card') {
        this.notify('Próximamente', 'Este método de pago estará disponible próximamente.', 'info');
        return;
      }

      // Si hay descuento aplicado, validar antes de continuar al pago
      const discount = (this.data as any)?.discount;
      const code: string | null = discount?.code ?? null;
      if (!code) { this.openPaymentModal(id); return; }

      // Construir body con datos desde localStorage/payload
      const userInfoRaw = localStorage.getItem('user_info');
      let userdniId: number | string | null = null;
      try {
        if (userInfoRaw) {
          const u = JSON.parse(userInfoRaw);
          userdniId = u?.documentNumber ?? null;
        }
      } catch { /* ignore parse */ }
      if (!userdniId) {
        const firstDoc = this.attendeeData?.[0]?.docNumber;
        if (firstDoc) userdniId = firstDoc;
      }

  const userId: number | string | null = (this.data as any)?.user?.id ?? null;
  const storedType = (localStorage.getItem('discountType') as any) || null;
  const type: 'PROMOTER' | 'GENERAL' | string = (storedType || (discount?.type as any) || '').toString() || 'GENERAL';

      const body: ValidateDiscountRequest = {
        userId,
        userdniId: userdniId as any,
        code,
        type
      };

      this.isSubmitting = true;
      this.eventDiscountService.validate(body).pipe(finalize(() => { this.isSubmitting = false; })).subscribe({
        next: (res: CheckDiscountResponse) => {
          const pct = Number(res?.discountPercentage ?? res?.data?.discountPercentage ?? res?.data?.percentage ?? 0);
          const ok = res?.status === 'exists' || pct > 0 || (res as any)?.valid === true;
          if (ok) {
            this.openPaymentModal(id);
          } else {
            const msg = res?.message || 'El código de descuento no es válido.';
            this.notify('Código inválido', msg, 'error');
          }
        },
        error: (err) => {
          const { notifyTitle, notifyMessage } = handleHttpError(err);
          this.notify(notifyTitle, notifyMessage, 'error');
        }
      });
      return;
    }
  }

  // Dispatcher por método de pago
  private openPaymentModal(id: PaymentMethodId) {
    const handlers: Record<PaymentMethodId, () => void> = {
      yape: () => this.openYapeModal(),
      card: () => this.openCardModal(),
      bcp: () => this.openBcpModal(),
      interbank: () => this.openInterbankModal(),
      other: () => this.openOtherModal(),
      wallet: () => this.openWalletModal(),
      paypal: () => this.openPaypalModal(),
    };
    const fn = handlers[id] || (() => this.openGenericModal(id));
    fn();
  }

  // Apertura real de modales
  private openYapeModal() { this.showBilleteraModal = true; }
  private openCardModal() { this.showTarjetaModal = true; }
  private openBcpModal() { this.currentBankMethod = 'bcp'; this.showTransferenciaModal = true; }
  private openInterbankModal() { this.currentBankMethod = 'interbank'; this.showTransferenciaModal = true; }
  private openOtherModal() { this.currentBankMethod = 'otrosMedios'; this.showTransferenciaModal = true; }

  private openWalletModal() {
    // cargar saldos antes/justo al abrir
    const id = this.data?.user?.id;
    if (this.data?.user?.type === 'member' && Number.isFinite(id)) {
      this.walletLoading = true;
      this.walletService.getWalletById(Number(id))
        .pipe(finalize(() => {
          this.walletLoading = false;
          this.cdr.markForCheck();
        }))
        .subscribe({
          next: (d) => {
            this.walletAvailable = Number(d?.availableBalance) || 0;
            this.walletAccounting = Number(d?.accountingBalance) || 0;
            this.showWalletModal = true;
          },
          error: () => {
            this.walletAvailable = 0;
            this.walletAccounting = 0;
            this.showWalletModal = true;
          }
        });
    } else {
      this.showWalletModal = true;
    }
  }
  private openPaypalModal() { this.showPaypalModal = true; }
  private openGenericModal(_id: PaymentMethodId) { /* no-op */ }

  onSummaryBack(): void {
    if (this.step === 2) { queueMicrotask(() => { this.step = 1; }); return; }
    // Omitiendo Paso 2: regresar del pago directo a asistentes
    if (this.step === 3) { queueMicrotask(() => { this.step = 1; }); return; }
  }

  confirmarMock(): void {
    if (!this.data) return;
    this.pending.clear();
    this.router.navigate(['/guest']);
  }

  cancelar(): void {
    const data = this.pending.get<any>();
    const isMember = data?.user?.type === 'member';
    if (this.pending.has()) this.pending.clear();
    if (isMember) {
      this.router.navigate(['/authentication/login']);
    } else {
      this.router.navigate(['/guest']);
    }
  }

  // Handlers de éxito y cierre de modales (con envío real)
  onBilleteraSuccess(): void {
    this.showBilleteraModal = false;
    this.successModalConfig = {
      title: '¡Pago con Billetera Exitoso!',
      message: 'Tu pago con billetera electrónica ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.',
      icon: '✓',
      iconColor: '#10b981'
    };
    this.showSuccessModal = true;
    this.scheduleSuccessRedirect();
  }

  onTransferenciaSuccess(payload?: {
    operationNumber: string;
    note: string;
    image?: File;
    totalAmount: number | string;
    method: string;
    paymentSubTypeId: string | number;
    currencyType: string; // 'USD' | 'PEN'
  }): void {
    if (payload) {
      if (!this.data) this.data = {};
      (this.data as any).paymentPayload = payload;
      this.pending.set({ ...this.data, paymentPayload: payload });

  const { attendees, attendeePackages } = this.buildApiAttendeesSplit();

      const isUSD = (payload.currencyType || '').toUpperCase() === 'USD';
      const req: PaymentRequest = {
        userId: Number(this.data?.user?.id || 0),
        eventId: Number(this.data?.eventId || 0),
        method: payload.method || 'TRANSFER',
        paymentSubTypeId: Number(payload.paymentSubTypeId || 0),
        currencyType: payload.currencyType || 'USD',
  attendees,
  attendeePackages: attendeePackages.length ? attendeePackages : undefined,
        voucher: {
          operationNumber: payload.operationNumber || '',
          note: payload.note || '',
          image: payload.image
        },
        totalAmount: Number(payload.totalAmount ?? 0),
        discountCode: (this.data as any)?.discount?.code ?? null,
        originalAmount: isUSD ? ((this.data as any)?.discount?.originalSubtotalUSD ?? (this.data as any)?.totalUSD ?? null)
                               : ((this.data as any)?.discount?.originalSubtotalSoles ?? (this.data as any)?.totalSoles ?? null),
        discountedAmount: isUSD ? ((this.data as any)?.totalUSD ?? null)
                                 : ((this.data as any)?.totalSoles ?? null),
        zones: this.buildZonesForApi(),
        packages: this.buildPackagesForApi()
      };

      this.showTransferenciaModal = false;


      this.withSpinner(this.paymentService.createPayment(req)).subscribe({
        next: () => {
          this.successModalConfig = {
            title: '¡Transferencia Exitosa!',
            message: 'Tu transferencia bancaria ha sido procesada correctamente. Recibirás una confirmación por correo electrónico.',
            icon: '✓',
            iconColor: '#10b981'
          };
          this.showSuccessModal = true;
          this.scheduleSuccessRedirect();
        },
        error: (err) => {
          const { notifyTitle, notifyMessage } = handleHttpError(err);
          this.notify(notifyTitle, notifyMessage, 'error');
          this.showTransferenciaModal = true;
        }
      });
      return;
    }
    this.showTransferenciaModal = false;
  }

  onWalletSuccess(data?: { totalAmount: number | string; note: string }): void {
    if (data) {
  const { attendees, attendeePackages } = this.buildApiAttendeesSplit();

      const isUSD = true;
      const req: PaymentRequest = {
        userId: Number(this.data?.user?.id || 0),
        eventId: Number(this.data?.eventId || 0),
        method: 'WALLET',
        paymentSubTypeId: 17,
        currencyType: 'USD',
  attendees,
  attendeePackages: attendeePackages.length ? attendeePackages : undefined,
        voucher: { operationNumber: 'wallet', note: data.note, image: undefined },
        totalAmount: Number(data.totalAmount ?? 0),
        discountCode: (this.data as any)?.discount?.code ?? null,
        originalAmount: isUSD ? ((this.data as any)?.discount?.originalSubtotalUSD ?? (this.data as any)?.totalUSD ?? null)
                               : ((this.data as any)?.discount?.originalSubtotalSoles ?? (this.data as any)?.totalSoles ?? null),
        discountedAmount: isUSD ? ((this.data as any)?.totalUSD ?? null)
                                 : ((this.data as any)?.totalSoles ?? null),
        zones: this.buildZonesForApi(),
        packages: this.buildPackagesForApi()
      };

      this.showWalletModal = false;

      this.withSpinner(this.paymentService.createPayment(req)).subscribe({
        next: () => {
          this.successModalConfig = {
            title: '¡Pago con Wallet Exitoso!',
            message: 'Tu pago con wallet ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.',
            icon: '✓',
            iconColor: '#10b981'
          };
          this.showSuccessModal = true;
          this.scheduleSuccessRedirect();
        },
        error: (err) => {
          const { notifyTitle, notifyMessage } = handleHttpError(err);
          this.notify(notifyTitle, notifyMessage, 'error');
          this.showWalletModal = true;
        }
      });
      return;
    }
    this.showWalletModal = false;
  }

  onPaypalSuccess(): void {
    this.showPaypalModal = false;

    const { attendees, attendeePackages } = this.buildApiAttendeesSplit();

    const isUSD = true;
    const req: PaymentRequest = {
      userId: Number(this.data?.user?.id || 0),
      eventId: Number(this.data?.eventId || 0),
      method: 'PAYPAL',
      paymentSubTypeId: 9,
      currencyType: 'USD',
      attendees,
      attendeePackages: attendeePackages.length ? attendeePackages : undefined,
      voucher: { operationNumber: 'paypal', note: 'PayPal payment', image: undefined },
      totalAmount: Number((this.data as any)?.totalUSD ?? 0),
      discountCode: (this.data as any)?.discount?.code ?? null,
      originalAmount: isUSD ? ((this.data as any)?.discount?.originalSubtotalUSD ?? (this.data as any)?.totalUSD ?? null)
                             : ((this.data as any)?.discount?.originalSubtotalSoles ?? (this.data as any)?.totalSoles ?? null),
      discountedAmount: isUSD ? ((this.data as any)?.totalUSD ?? null)
                               : ((this.data as any)?.totalSoles ?? null),
      zones: this.buildZonesForApi(),
      packages: this.buildPackagesForApi()
    };

    this.withSpinner(this.paymentService.createPayment(req)).subscribe({
      next: () => {
        this.successModalConfig = {
          title: '¡Pago con PayPal Exitoso!',
          message: 'Tu pago con PayPal ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.',
          icon: '✓',
          iconColor: '#10b981'
        };
        this.showSuccessModal = true;
        this.scheduleSuccessRedirect();
      },
      error: (err) => {
        const { notifyTitle, notifyMessage } = handleHttpError(err);
        this.notify(notifyTitle, notifyMessage, 'error');
      }
    });
  }

  onTarjetaSuccess(): void {
    this.showTarjetaModal = false;
    this.successModalConfig = {
      title: '¡Pago con Tarjeta Exitoso!',
      message: 'Tu pago con tarjeta de crédito/débito ha sido procesado correctamente. Recibirás una confirmación por correo electrónico.',
      icon: '✓',
      iconColor: '#10b981'
    };
    this.showSuccessModal = true;
    this.scheduleSuccessRedirect();
  }

  closeSuccessModal(): void {
    this.showSuccessModal = false;
    this.goToPostPaymentArea();
  }

  // Paso 1
  onAttendeeValid(v: boolean) {
    // Evita NG0100 cuando el hijo emite durante el mismo ciclo de detección
    queueMicrotask(() => { this.attendeeValid = v; this.cdr.markForCheck(); });
  }
  onAttendeeValue(v: any[]) {
    // Construye un array de zonas por ticket (igual que hace el paso de asistentes)
    const zones: string[] = this.computeZonesFromPurchases();
    // Enriquecer con tipo de entrada (zona)
    const enriched = (v || []).map((a, i) => ({
      entryType: zones[i] || 'Zona',
      docType: a?.docType as DocTypeKey,
      docNumber: a?.docNumber,
      firstName: a?.firstName,
      lastName: a?.lastName,
    }));
    this.attendeeData = enriched;

    // Actualiza en memoria sin cambiar la referencia del payload
    if (this.data) {
      (this.data as any).attendees = enriched;
      // Persiste una copia en storage
      this.pending.set({ ...this.data, attendees: enriched });
    }
  }

  private computeZonesFromPurchases(): string[] {
    const zones: string[] = [];
    const p = this.data;
    if (!p || !Array.isArray(p.purchases)) return zones;
    p.purchases.forEach((line: any) => {
      const qty = Number(line?.quantity) || 0;
      const entriesPer = Number(line?.entriesPerPackage) || 1;
      const total = qty * entriesPer;
      const packageName = line?.packageName ? String(line.packageName) : '';
      const baseZoneName = String(line?.zoneName || 'Zona');
      const display = packageName ? `${baseZoneName} - ${packageName}` : baseZoneName;
      for (let i = 0; i < total; i++) zones.push(display);
    });
    return zones;
  }

  /** Helper centralizado: mapea attendees del estado local -> payload API */
  private buildApiAttendees(): Array<{
    eventZoneId: string;
    documentTypeId: string;
    documentNumber: string;
    name: string;
    lastName: string;
  }> {
    const purchases = Array.isArray(this.data?.purchases) ? this.data!.purchases : [];
    // Construir mapa que considere también etiquetas de paquete 'Zona - Paquete'
    const zonesByName = new Map<string, string>();
    purchases.forEach((p: any) => {
      const base = String(p?.zoneName ?? '').toLowerCase().trim();
      const id = String(p?.zoneId ?? '');
      if (base) zonesByName.set(base, id);
      if (p?.packageName) {
        const pkgLabel = `${String(p.zoneName)} - ${String(p.packageName)}`.toLowerCase().trim();
        zonesByName.set(pkgLabel, id);
      }
    });

    const attendeesSrc = Array.isArray(this.data?.attendees) ? this.data!.attendees : [];

    return attendeesSrc.map((a: any) => {
      const key = String(a?.entryType ?? '').toLowerCase().trim();
      const eventZoneId = zonesByName.get(key) || '';
      const docKey = (a?.docType ?? '') as DocTypeKey;

      // ⬇️ SIN hardcode: usar el ID cargado del EP
      const documentTypeId = this.docTypeIdMap[docKey] ?? '';

      return {
        eventZoneId,
        documentTypeId,
        documentNumber: String(a?.docNumber ?? ''),
        name: String(a?.firstName ?? ''),
        lastName: String(a?.lastName ?? '')
      };
    });
  }

  // Versión extendida: separa asistentes de tickets individuales vs los provenientes de paquetes
  private buildApiAttendeesSplit(): {
    attendees: Array<{ eventZoneId: string; documentTypeId: string; documentNumber: string; name: string; lastName: string; }>;
    attendeePackages: Array<{ eventZoneId: string; documentTypeId: string; documentNumber: string; name: string; lastName: string; }>;
  } {
    const purchases = Array.isArray(this.data?.purchases) ? this.data!.purchases : [];

    // Map de zoneName -> id (igual que antes) y set de labels de paquete
    const zonesByName = new Map<string, string>();
    const packageLabels = new Set<string>();
    purchases.forEach((p: any) => {
      const baseZoneName = String(p?.zoneName ?? '').trim();
      const baseKey = baseZoneName.toLowerCase();
      const id = String(p?.zoneId ?? '');
      if (baseKey) zonesByName.set(baseKey, id);
      if (p?.packageName) {
        const pkgLabel = `${baseZoneName} - ${String(p.packageName)}`.trim();
        const pkgKey = pkgLabel.toLowerCase();
        packageLabels.add(pkgKey);
        zonesByName.set(pkgKey, id);
      }
    });

    const src = Array.isArray(this.data?.attendees) ? this.data!.attendees : [];

    const normal: any[] = [];
    const pkg: any[] = [];

    src.forEach((a: any) => {
      const label = String(a?.entryType ?? '').toLowerCase().trim();
      const eventZoneId = zonesByName.get(label) || '';
      const docKey = (a?.docType ?? '') as DocTypeKey;
      const documentTypeId = this.docTypeIdMap[docKey] ?? '';
      const dto = {
        eventZoneId,
        documentTypeId,
        documentNumber: String(a?.docNumber ?? ''),
        name: String(a?.firstName ?? ''),
        lastName: String(a?.lastName ?? '')
      };
      if (packageLabels.has(label)) {
        pkg.push(dto);
      } else {
        normal.push(dto);
      }
    });

    return { attendees: normal, attendeePackages: pkg };
  }

  // --- Helpers nuevos para zones y packages en el payload de pago ---
  private buildZonesForApi(): Array<{ eventZoneId: number; quantity: number }> {
    if (!Array.isArray(this.data?.purchases)) return [];
    const zoneMap = new Map<number, number>();
    this.data!.purchases.forEach((p: any) => {
      if (p?.zoneId && !p?.packageId) {
        const id = Number(p.zoneId);
        const qty = Number(p.quantity) || 0;
        zoneMap.set(id, (zoneMap.get(id) || 0) + qty);
      }
    });
    return Array.from(zoneMap.entries()).map(([eventZoneId, quantity]) => ({ eventZoneId, quantity }));
  }

  private buildPackagesForApi(): Array<{ packageId: number; quantity: number }> {
    if (!Array.isArray(this.data?.purchases)) return [];
    const pkgMap = new Map<number, number>();
    this.data!.purchases.forEach((p: any) => {
      if (p?.packageId) {
        const id = Number(p.packageId);
        const qty = Number(p.quantity) || 0;
        pkgMap.set(id, (pkgMap.get(id) || 0) + qty);
      }
    });
    return Array.from(pkgMap.entries()).map(([packageId, quantity]) => ({ packageId, quantity }));
  }

  // Paso 2
  onPurchaseValid(_: boolean) { /* siempre true por ahora */ }
  onPurchaseValue(opt: PurchaseOption) {
    this.purchaseOption = opt;
    // Persistir también la opción de compra en el payload, sin cambiar referencia
    if (this.data) {
      (this.data as any).purchaseOption = opt;
      this.pending.set({ ...this.data, purchaseOption: opt });
    }
  }

  // Paso 3
  onPaymentMethodChange(id: PaymentMethodId) {
    // Ignorar métodos temporalmente deshabilitados
    if (id === 'yape' || id === 'paypal' || id === 'card') return;
    // Si wallet no está en la lista (no socio), ignorar selección forzada
    if (id === 'wallet' && !this.paymentMethods.some(m => m.id === 'wallet')) return;

    this.selectedPayment = id;
    if (this.data) {
      (this.data as any).paymentMethod = id;
      this.pending.set({ ...this.data, paymentMethod: id });
    }
  }

  /** Envolver observables con spinner modal */
  private withSpinner<T>(obs: import('rxjs').Observable<T>) {
    this.isSubmitting = true;
    this.cdr.markForCheck();
    return obs.pipe(finalize(() => {
      this.isSubmitting = false;
      this.cdr.markForCheck();
    }));
  }

  // ------ UI: helpers para countdown y resumen ------
  get headerTitle(): string {
    return this.data?.eventName || 'Evento';
  }
  get headerImage(): string {
    return this.eventInfo?.flyerUrl;
  }
  // Parseadores en horario local (evita que 'YYYY-MM-DD' se interprete en UTC)
  private parseLocalDate(dateStr?: string): Date | null {
    if (!dateStr || typeof dateStr !== 'string') return null;
    const parts = dateStr.split('-').map(n => Number(n));
    if (parts.length !== 3) return null;
    const [y, m, d] = parts;
    const dt = new Date(y, (m || 1) - 1, d || 1);
    return isNaN(+dt) ? null : dt;
  }
  private parseLocalDateTime(dateStr?: string, timeStr?: string): Date | null {
    const base = this.parseLocalDate(dateStr);
    if (!base) return null;
    if (!timeStr || typeof timeStr !== 'string') return base;
    const t = timeStr.split(':').map(n => Number(n));
    const hh = t[0] ?? 0, mm = t[1] ?? 0, ss = t[2] ?? 0;
    const dt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh, mm, ss, 0);
    return isNaN(+dt) ? base : dt;
  }
  private get _dateObj(): Date | null {
    return this.parseLocalDate(this.eventInfo?.eventDate);
  }
  private get _dateTimeObj(): Date | null {
    return this.parseLocalDateTime(this.eventInfo?.eventDate, this.eventInfo?.startDate) || this._dateObj;
  }
  get headerDateLabel(): string {
    const date = this._dateObj;
    if (!date) return '';
    return new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  }
  get headerTimeLabel(): string {
    const dt = this._dateTimeObj;
    if (!dt) return '';
    return new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit', hour12: true }).format(dt);
  }
  get summaryVenueLabel(): string {
    return this.eventInfo?.venue?.nameVenue || '';
  }
  get summaryDateLink(): string {
    const date = this._dateObj;
    const time = this.headerTimeLabel;
    if (!date) return '';
    const d = new Intl.DateTimeFormat('es-PE', { day: '2-digit', month: 'short' }).format(date);
    return time ? `${d}, ${time}` : d;
  }

  // ✅ helpers del notify
  private notify(title: string, message: string, icon: NotifyIcon = 'info') {
    this.notifyTitle = title;
    this.notifyMessage = message;
    this.notifyIcon = icon;
    this.showNotify = true;
  }
  onCloseNotify(): void {
    this.showNotify = false;
  }

  // ✅ helpers de redirección post-éxito
  private scheduleSuccessRedirect(): void {
    clearTimeout(this.successRedirectTimer);
    this.successRedirectTimer = setTimeout(() => {
      this.goToPostPaymentArea();
    }, this.successAutoRedirectMs);
  }

  private goToPostPaymentArea(): void {
    clearTimeout(this.successRedirectTimer);
    const isMember = this.data?.user?.type === 'member';

    // 🔁 Ajusta estas rutas a tu gusto:
    // Por ahora uso el mismo criterio que en cancelar():
    if (isMember) {
      // Alternativo si quieres llevarlo al dashboard del socio:
      // this.router.navigate(['/ambassador/dashboard']);
      this.router.navigate(['/authentication/login']);
    } else {
      // Alternativo para invitados:
      // this.router.navigate(['/guest/tickets']);
      this.router.navigate(['/guest']);
    }

    // limpia estado temporal si quieres
    if (this.pending.has()) this.pending.clear();
  }
}
