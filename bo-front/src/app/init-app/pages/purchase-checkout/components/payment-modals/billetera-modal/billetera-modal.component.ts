import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-billetera-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './billetera-modal.component.html',
  styleUrls: ['./billetera-modal.component.scss']
})
export class BilleteraModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  selectedPaymentType: 'qr' | 'yape' = 'qr';
  showYapeForm = false;
  qrData: string = '';
  qrUrl: string = '';
  paymentAppLogos: Array<{ alt: string; src: string; fallback?: string; colors?: [string, string] }> = [];

  ngOnInit(): void {
    this.paymentAppLogos = [
      { alt: 'Yape', src: 'assets/icons/yape.svg', colors: ['#7c3aed', '#a78bfa'] },
      { alt: 'Plin', src: 'assets/icons/plin.svg', colors: ['#06b6d4', '#3b82f6'] },
      { alt: 'Ligo', src: 'assets/icons/ligo.svg', colors: ['#8b5cf6', '#7c3aed'] },
      { alt: 'Agora Pay', src: 'assets/icons/agora.svg', colors: ['#0ea5e9', '#2563eb'] }
    ];

    // Preconstruir fallbacks SVG para evitar parpadeos al error
    this.paymentAppLogos = this.paymentAppLogos.map((l) => ({
      ...l,
      fallback: this.buildBadgeSvg(l.alt, l.colors)
    }));

    this.refreshQr();
  }

  selectPaymentType(type: 'qr' | 'yape'): void {
    this.selectedPaymentType = type;
    if (type === 'qr') {
      this.refreshQr();
    }
  }

  processYapePayment(): void {
    this.showYapeForm = true;
  }

  submitYapePayment(): void {
    // Simular procesamiento de pago
    this.showYapeForm = false;
    this.paymentSuccess.emit();
  }

  onClose(): void {
    this.closeModal.emit();
    this.selectedPaymentType = 'qr';
    this.showYapeForm = false;
  }

  private generateRandomQrData(): string {
    const randomBytes = crypto.getRandomValues(new Uint8Array(12));
    const token = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    const payload = {
      order: '123456',
      ts: Date.now(),
      token
    };
    return JSON.stringify(payload);
  }

  private buildQrUrl(data: string, size: number = 200): string {
    const encoded = encodeURIComponent(data);
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encoded}&size=${size}x${size}&margin=10`;
  }

  refreshQr(): void {
    this.qrData = this.generateRandomQrData();
    this.qrUrl = this.buildQrUrl(this.qrData, 200);
  }

  setFallback(event: Event, logo: { fallback?: string; alt: string; colors?: [string, string] }): void {
    const img = event.target as HTMLImageElement;
    img.src = logo.fallback || this.buildBadgeSvg(logo.alt, logo.colors);
  }

  private buildBadgeSvg(text: string, colors: [string, string] = ['#6b7280', '#9ca3af']): string {
    const [c1, c2] = colors;
    const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns='http://www.w3.org/2000/svg' width='88' height='36' viewBox='0 0 88 36'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='${c1}'/>
          <stop offset='100%' stop-color='${c2}'/>
        </linearGradient>
      </defs>
      <rect x='1' y='1' rx='8' ry='8' width='86' height='34' fill='url(#g)'/>
      <text x='44' y='23' text-anchor='middle' font-family='Inter, Arial, sans-serif' font-size='14' fill='#fff'>${text}</text>
    </svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
}
