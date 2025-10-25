import { Component, EventEmitter, HostListener, Input, OnInit, Output, NgZone, ChangeDetectorRef, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationTypeService } from '../../../services/operation-type.service';

@Component({
  selector: 'app-transferencia-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [OperationTypeService],
  templateUrl: './transferencia-modal.component.html',
  styleUrls: ['./transferencia-modal.component.scss']
})
export class TransferenciaModalComponent implements OnInit, OnDestroy {
  /** Devuelve el total a pagar en tiempo real según moneda y comisión */
  getTotalToPay(): string {
    // Base por moneda
    const isSoles = this.bcpFormData.selectedCurrency === 'Soles';
    const base = isSoles ? Number(this.totalSoles || 0) : Number(this.totalUSD || 0);

    // Subtipo seleccionado
    const selectedSubType = this.getCurrentSubTypes().find(st => String(st.idPaymentSubType) === String(this.bcpFormData.selectedOperationType));

    // Comisión fija
    let fixed = 0;
    if (selectedSubType) {
      if (isSoles && selectedSubType.commissionSoles !== undefined && selectedSubType.commissionSoles !== null) {
        fixed = Number(selectedSubType.commissionSoles) || 0;
      } else if (!isSoles && selectedSubType.commissionDollars !== undefined && selectedSubType.commissionDollars !== null) {
        fixed = Number(selectedSubType.commissionDollars) || 0;
      }
    }

    const pct = selectedSubType ? (Number(selectedSubType.ratePercentage) || 0) : 0;
    const pctFactor = pct > 0 ? (pct / 100) : 0;

    // Use integer-cent style rounding to avoid floating point off-by-one-cent issues
    const percentAmount = this.roundToTwo(base * pctFactor);

    const total = this.roundToTwo(base + fixed + percentAmount);
    return total.toFixed(2);
  }

  @Input() isOpen = false;
  @Input() bankMethod: 'bcp' | 'interbank' | 'otrosMedios' = 'bcp';
  @Input() dismissOnEsc = true;
  @Input() totalSoles: number = 0;
  @Input() totalUSD: number = 0;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<any>();

  bcpFormData = {
    currencies: ['Selecciona uno', 'Soles', 'Dólares'],
    selectedCurrency: 'Soles',
    selectedOperationType: 'Selecciona uno',
    operationCode: '',
    amount: '',
    note: '',
    noteMaxLength: 250
  };

  private readonly allTouchedFields = ['currency', 'operationType', 'operationCode', 'amount', 'note', 'evidence'] as const;
  touched: Record<(typeof this.allTouchedFields)[number], boolean> = {
    currency: false,
    operationType: false,
    operationCode: false,
    amount: false,
    note: false,
    evidence: false
  };
  submitted = false;

  /** Evidencia bancaria (una imagen requerida) */
  evidenceFile: File | null = null;
  evidencePreview: string | null = null;
  evidenceError: string | null = null;
  private evidenceErrorTimer: any | null = null;
  private readonly MAX_EVIDENCE_MB = 1.2;
  private readonly ALLOWED_EVIDENCE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];


  bankTransferConfig = {
    bcp: {
      title: 'Pago en transferencia con BCP',
      companyName: 'INCLUB WORLD S.A.C.',
      accounts: [
        { label: 'Cuenta Corriente en soles:', number: '1937128166075' },
        { label: 'Cuenta interbancaria CCI soles:', number: '00219300712816607514' },
        { label: 'Cuenta Corriente en dólares:', number: '1937134346109' },
        { label: 'Cuenta interbancaria CCI dólares:', number: '00219300713434610912' }
      ],
      hasAdditionalFields: false
    },
    interbank: {
      title: 'Pago en transferencia con Interbank',
      companyName: 'INCLUB WORLD S.A.C.',
      accounts: [
        { label: 'Cuenta Corriente en soles:', number: '2003007045326' },
        { label: 'Cuenta interbancaria CCI soles:', number: '00320000300704532638' },
        { label: 'Cuenta Corriente en dólares:', number: '2003007045333' },
        { label: 'Cuenta interbancaria CCI dólares:', number: '00320000300704533334' }
      ],
      hasAdditionalFields: false
    },
    otrosMedios: {
      title: 'Pago en transferencia con Otros medios',
      companyName: 'INCLUB WORLD S.A.C.',
      accounts: [
        { label: 'Cuenta Corriente en soles:', number: '1937128166075' },
        { label: 'Cuenta interbancaria CCI soles:', number: '00219300712816607514' },
        { label: 'Cuenta Corriente en dólares:', number: '1937134346109' },
        { label: 'Cuenta interbancaria CCI dólares:', number: '00219300713434610912' }
      ],
      hasAdditionalFields: true
    }
  } as const;

  bcpSubTypes: any[] = [];
  interbankSubTypes: any[] = [];
  otrosSubTypes: any[] = [];

  private appendedToBody = false;
  constructor(
    private operationTypeService: OperationTypeService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    const host = this.el.nativeElement;
    if (host && host.parentElement !== document.body) {
      this.renderer.appendChild(document.body, host);
      this.appendedToBody = true;
    }
    this.operationTypeService.getOperationTypes().subscribe(types => {
      const bcp = types.find(type => type.idPaymentType === 1);
      this.bcpSubTypes = bcp ? [...bcp.paymentSubTypeList] : [];
      const interbank = types.find(type => type.idPaymentType === 2);
      this.interbankSubTypes = interbank ? [...interbank.paymentSubTypeList] : [];
      const otros = types.find(type => type.idPaymentType === 5);
      this.otrosSubTypes = otros ? [...otros.paymentSubTypeList] : [];
      this.setAmountToTotal();
    });
  }

  ngOnDestroy(): void {
    if (this.appendedToBody) {
      const host = this.el.nativeElement;
      if (host && document.body.contains(host)) {
        this.renderer.removeChild(document.body, host);
      }
    }
  }

  formatDecimal(event: FocusEvent) {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    if (raw === '' || raw === null || raw === undefined) return;

    const parsed = this.parseMoney(raw);
    if (parsed === null) {
      this.bcpFormData.amount = '';
      input.value = '';
      return;
    }

    const formatted = this.roundMoneyCustom(parsed);
    this.bcpFormData.amount = formatted;
    input.value = formatted;
  }

  private parseMoney(raw: any): number | null {
    if (raw === null || raw === undefined) return null;
    const cleaned = String(raw).replace(/,/g, '').trim();
    if (cleaned === '') return null;
    const num = Number(cleaned);
    return isNaN(num) ? null : num;
  }

  private roundMoneyCustom(value: number): string {
    // Previous custom rounding rounded to the nearest 0.10 in a non-standard way
    // Use standard rounding to 2 decimals (nearest cent)
    return this.roundToTwo(value).toFixed(2);
  }

  /** Round to two decimals reliably (nearest cent) */
  private roundToTwo(value: number): number {
    if (!isFinite(value) || isNaN(value)) return 0;
    // Add a small epsilon then round to avoid floating point edge cases
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  isFormValid(): boolean {
    const monto = this.getTotalToPay();
    const baseValidation = this.bcpFormData.selectedCurrency !== '' &&
      this.bcpFormData.selectedCurrency !== 'Selecciona uno' &&
      this.bcpFormData.selectedOperationType !== 'Selecciona uno' &&
      this.bcpFormData.operationCode.trim() !== '' &&
      monto !== '' &&
      parseFloat(monto) > 0 &&
      !!this.evidenceFile && !this.evidenceError;
    return baseValidation;
  }

  isAmountValid(): boolean {
    const amount = this.bcpFormData.amount.trim();
    if (amount === '') return false;
    if (!/^[0-9]+$/.test(amount)) return false;
    const num = parseInt(amount, 10);
    return num > 0;
  }

  onAmountTyping(event: Event) {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D+/g, '');
    input.value = digitsOnly;
    this.bcpFormData.amount = digitsOnly;
  }



  normalizeInteger(ev: FocusEvent) {
    const input = ev.target as HTMLInputElement;
    let val = input.value.replace(/\D+/g, '');
    if (val.startsWith('0')) {
      val = String(parseInt(val || '0', 10));
    }
    input.value = val;
    this.bcpFormData.amount = val;
  }

  blockInvalidMoneyKeys(ev: KeyboardEvent) {
    if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(ev.key)) return;
    if (!/^[0-9]$/.test(ev.key)) ev.preventDefault();
  }

  validateMoneyPaste(ev: ClipboardEvent) {
    const text = ev.clipboardData?.getData('text') ?? '';
    if (!/^\d+$/.test(text)) ev.preventDefault();
  }

  addPaymentRecord() {
    this.submitted = true;
    if (!this.isFormValid()) {
      return;
    }

    const payload = {
      method: 'VOUCHER',
      paymentSubTypeId: this.bcpFormData.selectedOperationType, // Ya es number
      currencyType: this.bcpFormData.selectedCurrency === 'Soles' ? 'PEN' : 'USD',
      operationNumber: this.bcpFormData.operationCode,
      totalAmount: this.getTotalToPay(), // Ya está calculado
      note: this.bcpFormData.note,
      image: this.evidenceFile // El File object
    };

    console.log('🟢 Emitiendo payload:', payload);
    this.paymentSuccess.emit(payload);
    this.resetForm();
  }
  

  resetForm(): void {
  this.bcpFormData.selectedCurrency = 'Soles';
  this.bcpFormData.selectedOperationType = 'Selecciona uno';
  this.bcpFormData.operationCode = '';
  this.setAmountToTotal();
  this.bcpFormData.note = '';
  this.submitted = false;
  for (const f of this.allTouchedFields) this.touched[f] = false;
  this.clearEvidence();
  }

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  // Cerrar con tecla ESC (misma funcionalidad que wallet)
  @HostListener('document:keydown.escape')
  handleEsc() {
    if (this.isOpen && this.dismissOnEsc) {
      this.onClose();
    }
  }

  // Get current bank configuration
  getCurrentBankConfig() {
    return this.bankTransferConfig[this.bankMethod];
  }

  getCurrentSubTypes() {
    if (this.bankMethod === 'bcp') return this.bcpSubTypes;
    if (this.bankMethod === 'interbank') return this.interbankSubTypes;
    if (this.bankMethod === 'otrosMedios') return this.otrosSubTypes;
    return [];
  }

  getPaymentInfo() {
    const soles = `S/ ${this.totalSoles.toFixed(2)}`;
    const usd = `$ ${this.totalUSD.toFixed(2)}`;
    // Obtener comisión fija y porcentaje según el subtipo
    const isSoles = this.bcpFormData.selectedCurrency === 'Soles';
    let comision = 0;
    let ratePct = 0;
    const selectedSubType = this.getCurrentSubTypes().find(st => String(st.idPaymentSubType) === String(this.bcpFormData.selectedOperationType));
    if (selectedSubType) {
      if (isSoles && selectedSubType.commissionSoles !== undefined && selectedSubType.commissionSoles !== null) {
        comision = Number(selectedSubType.commissionSoles) || 0;
      } else if (!isSoles && selectedSubType.commissionDollars !== undefined && selectedSubType.commissionDollars !== null) {
        comision = Number(selectedSubType.commissionDollars) || 0;
      }
      ratePct = Number(selectedSubType.ratePercentage) || 0;
    }

    let symbol = 'S/';
    if (this.bcpFormData.selectedCurrency === 'Dólares') {
      symbol = '$';
    }
    const pctLabel = ratePct > 0 ? [{ label: 'Porcentaje (%):', value: `${ratePct}%` }] : [];

    if (this.bankMethod === 'bcp') {
      return [
        { label: 'Comisión fija:', value: `${symbol} ${comision}` },
        ...pctLabel,
        { label: 'Monto BCP en soles:', value: soles },
        { label: 'Monto BCP en dólares:', value: usd }
      ];
    }
    if (this.bankMethod === 'interbank') {
      return [
        { label: 'Comisión fija:', value: `${symbol} ${comision}` },
        ...pctLabel,
        { label: 'Monto Interbank en dólares:', value: usd },
        { label: 'Monto Interbank en soles:', value: soles }
      ];
    }
    // otrosMedios
    return [
      { label: 'Monto en dólares:', value: usd },
      { label: 'Monto en soles:', value: soles },
      { label: 'Comisión fija:', value: `${symbol} ${comision}` },
      ...pctLabel,
    ];
  }
  // Forzar actualización de la comisión al cambiar tipo de operación o moneda
  onOperationTypeChange() {
    this.getPaymentInfo();
  }
  onCurrencyChange() {
    this.getPaymentInfo();
    this.setAmountToTotal();
  }

  /** Actualiza el monto con el total a pagar según la moneda seleccionada */
  setAmountToTotal() {
    if (this.bcpFormData.selectedCurrency === 'Soles') {
      this.bcpFormData.amount = this.totalSoles ? this.totalSoles.toFixed(2) : '';
    } else if (this.bcpFormData.selectedCurrency === 'Dólares') {
      this.bcpFormData.amount = this.totalUSD ? this.totalUSD.toFixed(2) : '';
    } else {
      this.bcpFormData.amount = '';
    }
  }

  getPaymentSummary() {
    const currency = this.bcpFormData.selectedCurrency;
    let symbol = 'S/';
    if (currency === 'Dólares') symbol = '$';
    const soles = `S/ ${this.totalSoles.toFixed(2)}`;
    const usd = `$ ${this.totalUSD.toFixed(2)}`;
    let amountValue = parseFloat(this.bcpFormData.amount) || 0;
    let comision = 0;
    let ratePct = 0;
    const selectedSubType = this.getCurrentSubTypes().find(st => String(st.idPaymentSubType) === String(this.bcpFormData.selectedOperationType));
    if (selectedSubType) {
      if (currency === 'Soles' && selectedSubType.commissionSoles !== undefined && selectedSubType.commissionSoles !== null) {
        comision = Number(selectedSubType.commissionSoles) || 0;
      } else if (currency === 'Dólares' && selectedSubType.commissionDollars !== undefined && selectedSubType.commissionDollars !== null) {
        comision = Number(selectedSubType.commissionDollars) || 0;
      }
      ratePct = Number(selectedSubType.ratePercentage) || 0;
    }
  const percentAmount = this.roundToTwo(amountValue * (ratePct > 0 ? ratePct / 100 : 0));
  let totalValue = this.roundToTwo(amountValue + comision + percentAmount);
  let totalValueStr = `${symbol} ${totalValue.toFixed(2)}`;

    let montoOriginal = symbol === 'S/' ? `S/ ${this.totalSoles.toFixed(2)}` : `$ ${this.totalUSD.toFixed(2)}`;
    let montoUsuario = symbol === 'S/' ? this.totalSoles : this.totalUSD;
  let totalPagar = this.roundToTwo(montoUsuario + comision + (montoUsuario * (ratePct > 0 ? ratePct / 100 : 0)));
  let totalPagarStr = `${symbol} ${totalPagar.toFixed(2)}`;
    if (this.bankMethod === 'bcp') {
      return [
        { label: 'Monto a pagar:', value: montoOriginal },
        { label: 'Comisión fija:', value: `${symbol} ${comision}` },
        ...(ratePct > 0 ? [{ label: 'Porcentaje (%):', value: `${ratePct}%` }] : []),
        { label: 'Total a pagar:', value: totalPagarStr, isTotal: true }
      ];
    }
    if (this.bankMethod === 'interbank') {
      return [
        { label: 'Comisión fija:', value: `${symbol} ${comision}` },
        ...(ratePct > 0 ? [{ label: 'Porcentaje (%):', value: `${ratePct}%` }] : []),
        { label: 'Total a pagar:', value: totalPagarStr, isTotal: true }
      ];
    }
    // otrosMedios
    return [
      { label: 'Total a pagar:', value: totalPagarStr, isTotal: true }
    ];
  }

  markTouched(field: (typeof this.allTouchedFields)[number]) { this.touched[field] = true; }

  getError(field: string): string {
    switch (field) {
      case 'currency':
        if (this.bcpFormData.selectedCurrency === 'Selecciona uno') return 'Selecciona una moneda';
        return '';
      case 'operationType':
        if (!this.bcpFormData.selectedOperationType || this.bcpFormData.selectedOperationType === 'Selecciona uno') return 'Selecciona un tipo de operación';
        return '';
      case 'operationCode':
        if (!this.bcpFormData.operationCode.trim()) return 'Código de operación requerido';
        return '';
      case 'amount':
        if (!this.bcpFormData.amount.trim()) return 'Monto requerido';
        if (!/^[0-9]+$/.test(this.bcpFormData.amount.trim())) return 'Solo dígitos';
        if (parseInt(this.bcpFormData.amount.trim(), 10) === 0) return 'Monto debe ser mayor a 0';
        return '';
      case 'note':
        if (!this.bcpFormData.note.trim()) return 'Nota requerida';
        return '';
      case 'evidence':
        if (this.evidenceError) return this.evidenceError;
        if (!this.evidenceFile) return 'Imagen requerida';
        return '';
    }
    return '';
  }

  /** Evidencia: métodos */
  onEvidenceSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    this.handleEvidenceFile(input.files[0]);
    this.touched.evidence = true;
    input.value = '';
  }

  onEvidenceDrop(ev: DragEvent) {
    ev.preventDefault();
    if (!ev.dataTransfer?.files?.length) return;
    this.handleEvidenceFile(ev.dataTransfer.files[0]);
    this.touched.evidence = true;
  }

  allowEvidenceDrag(ev: DragEvent) { ev.preventDefault(); }

  private handleEvidenceFile(file: File) {
    this.setEvidenceError(null);
    const err = this.validateEvidence(file);
    if (err) { this.setEvidenceError(err); return; }
    this.evidenceFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.ngZone.run(() => {
        this.evidencePreview = reader.result as string;
        
        try { this.cdr.detectChanges(); } catch (e) {  }
      });
    };
    reader.readAsDataURL(file);
  }

  removeEvidence() {
    this.evidenceFile = null;
    this.evidencePreview = null;
    this.setEvidenceError(null);
  }

  private clearEvidence() {
    this.evidenceFile = null;
    this.evidencePreview = null;
    this.setEvidenceError(null);
  }

  private validateEvidence(file: File): string | null {
    if (!this.ALLOWED_EVIDENCE_TYPES.includes(file.type)) return 'Formato no permitido';
    const maxBytes = this.MAX_EVIDENCE_MB * 1024 * 1024;
    if (file.size > maxBytes) return `Máximo ${this.MAX_EVIDENCE_MB} MB (actual ${(file.size / 1024 / 1024).toFixed(2)} MB)`;
    return null;
  }

  private setEvidenceError(msg: string | null) {
    this.evidenceError = msg;
    if (this.evidenceErrorTimer) {
      clearTimeout(this.evidenceErrorTimer);
      this.evidenceErrorTimer = null;
    }
    if (msg) {
      this.evidenceErrorTimer = setTimeout(() => {
        if (this.evidenceError === msg) this.evidenceError = null;
      }, 3000);
    }
  }
}
