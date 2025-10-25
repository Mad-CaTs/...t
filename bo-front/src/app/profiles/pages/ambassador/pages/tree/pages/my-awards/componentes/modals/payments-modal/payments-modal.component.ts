import { Component, EventEmitter, Input, Output, ElementRef, Renderer2, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

type PaymentKey =
  | 'bcp'
  | 'interbank'
  | 'paypal'
  | 'keolapay'
  | 'davivienda'
  | 'wallet'
  | 'otros';

interface PaymentMethod {
  key: PaymentKey;
  label: string;
  logo?: string;
  visible?: boolean;
}

@Component({
  selector: 'app-payments-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payments-modal.component.html',
  styleUrls: ['./payments-modal.component.scss'],
})
export class PaymentsModalComponent implements OnInit, OnDestroy {
  @Input() open = true;
  @Input() selectedIds: number[] = [];
  @Input() paymentDetails?: any;
  @Output() closed = new EventEmitter<void>();
  @Output() methodSelected = new EventEmitter<PaymentKey>();

  private appendedToBody = false;

  constructor(private el: ElementRef<HTMLElement>, private renderer: Renderer2) {}

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

  title = 'Medio de pago';

  methods: PaymentMethod[] = [
    { key: 'bcp', label: 'BCP', logo: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/iconos/047b90bc-73fa-4819-ace3-660e0392d64c-bcp.svg' },
    { key: 'interbank', label: 'Interbank', logo: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/iconos/047b90bc-73fa-4819-ace3-660e0392d64c-interbank.svg' },
    { key: 'paypal', label: 'PayPal', logo: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/iconos/047b90bc-73fa-4819-ace3-660e0392d64c-paypal.svg' },
    { key: 'keolapay', label: 'KeolaPay', visible: false },
    { key: 'davivienda', label: 'Davivienda', visible: false },
    { key: 'wallet', label: 'Mi Wallet', logo: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/iconos/047b90bc-73fa-4819-ace3-660e0392d64c-mi%26wallet.svg' },
    { key: 'otros', label: 'Otros', logo: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/iconos/047b90bc-73fa-4819-ace3-660e0392d64c-otros.svg' },
  ];

  get visibleMethods() {
    return this.methods.filter(m => m.visible !== false);
  }

  selected: PaymentKey = 'bcp';

  select(m: PaymentMethod) {
    this.selected = m.key;
    this.methodSelected.emit(m.key);
  }

  onClose() {
    this.closed.emit();
  }

  get displayExchangeRate(): string {
    return this.paymentDetails?.exchangeRate?.toFixed(3) || '0.000';
  }

  get displayAmountUSD(): string {
    return this.paymentDetails?.amountUSD?.toFixed(2) || '0.00';
  }

  get displayAmountPEN(): string {
    return this.paymentDetails?.amountPEN?.toFixed(2) || '0.00';
  }

  get displayMethodName(): string {
    const method = this.methods.find(m => m.key === this.selected);
    return method?.label || 'BCP';
  }
}