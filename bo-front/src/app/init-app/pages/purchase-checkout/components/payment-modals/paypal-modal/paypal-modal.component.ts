import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paypal-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paypal-modal.component.html',
  styleUrls: ['./paypal-modal.component.scss']
})
export class PaypalModalComponent {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();
  @Output() paymentSuccess = new EventEmitter<void>();

  isRedirecting = false;

  redirectToPayPal(): void {
    this.isRedirecting = true;
    
    // Simular redirección a PayPal
    setTimeout(() => {
      this.isRedirecting = false;
      this.paymentSuccess.emit();
    }, 3000);
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
