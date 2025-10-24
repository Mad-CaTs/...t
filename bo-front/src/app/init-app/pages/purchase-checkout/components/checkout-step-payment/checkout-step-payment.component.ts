import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PaymentMethodId = 'yape' | 'card' | 'bcp' | 'interbank' | 'other' | 'wallet' | 'paypal';

export interface PaymentMethod {
  id: PaymentMethodId;
  title: string;
  description?: string;
  icons?: string[];
}

@Component({
  selector: 'app-checkout-step-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-step-payment.component.html',
  styleUrl: './checkout-step-payment.component.scss',
})
export class CheckoutStepPaymentComponent {

  @Input() stepLabel = 'Paso 3 de 3';
  @Input({ required: true }) methods: PaymentMethod[] = [];
  @Input() selectedId: PaymentMethodId | null = null;

  @Output() valueChange = new EventEmitter<PaymentMethodId>();

  get count(): number { return this.methods?.length ?? 0; }

  iconSize(m: PaymentMethod): number {
    const n = m?.icons?.length ?? 0;
  if (n <= 1) return 28;
  if (n === 2) return 24;
  if (n <= 4) return 20;
  if (n <= 7) return 16;
  return 14;
  }
  iconGap(m: PaymentMethod): number {
    const n = m?.icons?.length ?? 0;
  if (n <= 2) return 12;
  if (n <= 4) return 10;
  if (n <= 7) return 8;
  return 6;
  }

  onSelect(id: PaymentMethodId, ev?: Event) {
    ev?.stopPropagation();
    if (this.selectedId !== id) {
      this.selectedId = id;
      this.valueChange.emit(id);
    }
  }

  trackByMethod = (_: number, m: PaymentMethod) => m.id;
  trackByIcon = (_: number, url: string) => url;
}
