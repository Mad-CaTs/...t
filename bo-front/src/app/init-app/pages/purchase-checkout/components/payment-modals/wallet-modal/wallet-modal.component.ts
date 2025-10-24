import { Component, EventEmitter, HostListener, Input, Output, ElementRef, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-wallet-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet-modal.component.html',
  styleUrls: ['./wallet-modal.component.scss']
})
export class WalletModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  // balances provistos por el padre (componente presentacional)
  @Input() availableBalance: number = 0;
  @Input() accountingBalance: number = 0;
  @Input() loading: boolean = false;
  // Total de la compra en USD (se muestra como monto y total a pagar)
  @Input() amountUSD: number = 0;
  // Configuración de reutilización
  @Input() amountLabel = 'Monto en dólares';
  @Input() totalLabel = 'Total a pagar';
  @Input() balanceLabel = 'Saldo disponible';
  @Input() accountingLabel = 'Saldo contable';
  @Input() showAccounting = true; // mostrar/ocultar saldo contable
  @Input() confirmLabel = 'Usar Cartera';
  @Input() cancelLabel = 'Cancelar';
  @Input() requireReason = true; // permitir omitir campo motivo si se desactiva
  @Input() dismissOnEsc = true;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<{ totalAmount: number; note: string }>();
  // Sólo se mantiene el campo "reason" (motivo) según requerimiento.
  walletData = { reason: '' };
  isProcessing = false;
  touched: Record<string, boolean> = { reason: false };
  submitted = false;

  // Métodos para obtener datos
  getAvailableBalance(): string { return `$ ${this.availableBalance.toFixed(2)}`; }
  getAccountingBalance(): string { return `$ ${this.accountingBalance.toFixed(2)}`; }

  // Total a pagar (mismo valor amountUSD formateado)
  getAmountInDollars(): string { return `$ ${this.amountUSD.toFixed(2)}`; }
  getTotalToPay(): string { return `$ ${this.amountUSD.toFixed(2)}`; }

  get insufficientBalance(): boolean { return !this.loading && this.amountUSD > this.availableBalance; }
  get infoBarMessage(): string {
    if (this.loading) return 'Validando saldos...';
    if (this.insufficientBalance) {
      return `Saldo insuficiente. Necesitas $ ${this.amountUSD.toFixed(2)} y sólo tienes $ ${this.availableBalance.toFixed(2)} disponibles.`;
    }
    return 'El monto se descontará de tu saldo disponible al confirmar.';
  }

  isFormValid(): boolean {
    if (this.requireReason && this.getError('reason') !== '') return false;
    return !this.insufficientBalance;
  }
  getError(field: string): string { switch (field) { case 'reason': if (!this.walletData.reason.trim()) return 'Motivo requerido'; return ''; default: return ''; } }
  markTouched(field: keyof typeof this.touched) { this.touched[field] = true; }

  // Procesar pago
  processPayment(): void {
    this.submitted = true;
    Object.keys(this.touched).forEach(k => this.touched[k] = true);
    if (!this.isFormValid()) return;
    this.paymentSuccess.emit({
      totalAmount: this.amountUSD,
      note: this.walletData.reason
    });
  }

  onClose(): void {
    this.closeModal.emit();
    this.resetForm();
  }

  @HostListener('document:keydown.escape')
  handleEsc() {
    if (this.isOpen && this.dismissOnEsc) {
      this.onClose();
    }
  }

  private resetForm(): void {
    this.walletData.reason = '';
    this.isProcessing = false;
    this.submitted = false; Object.keys(this.touched).forEach(k => this.touched[k] = false);
  }

  private appendedToBody = false;
  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) { }

  ngOnInit(): void {
    const host = this.el.nativeElement;
    if (host && host.parentElement !== document.body) {
      this.renderer.appendChild(document.body, host);
      this.appendedToBody = true;
    }
  }

  ngOnDestroy(): void {
    if (this.appendedToBody) {
      const host = this.el.nativeElement;
      if (host && document.body.contains(host)) {
        this.renderer.removeChild(document.body, host);
      }
    }
  }
}
