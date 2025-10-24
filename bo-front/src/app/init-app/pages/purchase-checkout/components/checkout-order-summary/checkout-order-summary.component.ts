import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { PurchaseOption } from '../checkout-step-purchase/checkout-step-purchase.component';
import { Router } from '@angular/router';

type PurchaseLine = {
  zoneId: number;
  zoneName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  unitPriceUSD?: number;
  subtotalUSD?: number;
  packageId?: number;
  packageName?: string;
  entriesPerPackage?: number;
};

type PendingPurchasePayload = {
  eventId: string | number;
  eventName: string;
  eventType?: string;
  purchases: PurchaseLine[];
  totalSoles: number;
  totalUSD?: number;
  discount?: {
    code?: string;
    percentage?: number;
    amountSoles?: number;
    originalSubtotalSoles?: number;
  } | null;
};

@Component({
  selector: 'app-checkout-order-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-order-summary.component.html',
  styleUrl: './checkout-order-summary.component.scss'
})
export class CheckoutOrderSummaryComponent {
  @Input() payload: PendingPurchasePayload | null = null;
  @Input() eventDateLink = '07 Dic, 10:00 a.m';
  @Input() venueLabel = 'Ribera del Río club resort';
  @Input() purchaseOption: PurchaseOption | null = null;

  // deshabilitar/volver
  @Input() continueDisabled = false;
  @Input() canGoBack = false;

  // checkboxes
  @Input() requireTerms = true;
  @Input() showNewsOptIn = true;
  @Input() showFeeNotice = true;
  @Input() feeNoticeText?: string;

  acceptTerms = false;
  newsOptIn = false;

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  @Output() termsChange = new EventEmitter<boolean>();
  @Output() newsletterChange = new EventEmitter<boolean>();

  get badgeCount(): number {
    return (this.payload?.purchases || []).reduce((acc, l) => acc + (l.quantity || 0), 0);
  }
  get lines(): PurchaseLine[] { return this.payload?.purchases || []; }
  get totalBase(): number { return this.payload?.totalSoles ?? 0; }
  get totalUSD(): number { return (this.payload as any)?.totalUSD ?? 0; }
  get eventType(): string { return this.payload?.eventType || 'Presencial'; }
  get tickets(): number {
    return (this.payload?.purchases || []).reduce((acc, l) => acc + (l.quantity || 0), 0);
  }
  get extraFee(): number {
    if (!this.purchaseOption?.refundable) return 0;
    const fee = this.purchaseOption.feePerTicket || 0;
    return this.tickets * fee;
  }
  get total(): number { return this.totalBase + this.extraFee; }
  get showUSD(): boolean { return this.totalUSD > 0; }

  // Descuento
  get hasDiscount(): boolean {
    const p = (this.payload as any)?.discount;
    const percent = Number(p?.percentage || 0);
    const amount = Number(p?.amountSoles || 0);
    return (percent > 0) || (amount > 0);
  }
  get discountPercent(): number {
    const p = (this.payload as any)?.discount;
    return Number(p?.percentage || 0);
  }
  get originalSubtotal(): number {
    const d = (this.payload as any)?.discount;
    if (d && typeof d.originalSubtotalSoles === 'number') return d.originalSubtotalSoles;
    // fallback: sumar líneas
    return (this.payload?.purchases || []).reduce((acc, l) => acc + (l.subtotal || 0), 0);
  }
  get discountAmount(): number {
    const d = (this.payload as any)?.discount;
    const amt = Number(d?.amountSoles || 0);
    if (amt > 0) return amt;
    const pct = Number(d?.percentage || 0);
    if (pct > 0) return +(this.originalSubtotal * (pct / 100)).toFixed(2);
    return 0;
  }

  get isContinueDisabled(): boolean {
    return this.continueDisabled || (this.requireTerms && !this.acceptTerms);
  }

  // Ocultar ícono de mapa cuando el evento es virtual
  get isVirtual(): boolean {
    const et: any = (this.payload as any)?.eventType;
    const name = typeof et === 'string' ? et : (et?.eventTypeName ?? '');
    return String(name).toLowerCase() === 'virtual';
  }

  // Mensaje calculado para la nota
  get computedFeeNotice(): string {
    if (this.feeNoticeText && this.feeNoticeText.trim()) return this.feeNoticeText.trim();

    const parts: string[] = [];
    if (this.extraFee > 0) {
      parts.push(`Incluye S/ ${this.extraFee.toFixed(2)} por compra reembolsable.`);
    }
    parts.push('Puede aplicarse una comisión según el tipo de operación seleccionada.');
    return parts.join(' ');
  }

  onConfirm(): void { this.confirm.emit(); }
  onCancel(): void { this.cancel.emit(); }

  toggleTerms(ev: Event) {
    const v = (ev.target as HTMLInputElement).checked;
    this.acceptTerms = v;
    this.termsChange.emit(v);
  }
  toggleNews(ev: Event) {
    const v = (ev.target as HTMLInputElement).checked;
    this.newsOptIn = v;
    this.newsletterChange.emit(v);
  }
}
