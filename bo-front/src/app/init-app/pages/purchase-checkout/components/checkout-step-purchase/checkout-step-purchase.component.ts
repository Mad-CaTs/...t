import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PurchaseOption = {
  refundable: boolean;
  feePerTicket: number;
};

@Component({
  selector: 'app-checkout-step-purchase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkout-step-purchase.component.html',
  styleUrl: './checkout-step-purchase.component.scss'
})
export class CheckoutStepPurchaseComponent {

  @Input() feePerTicket = 5.9;

  /** Selección actual (inicia en NO reembolsable) */
  @Input() selection: PurchaseOption = { refundable: false, feePerTicket: this.feePerTicket };

  @Output() validChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<PurchaseOption>();

  ngOnInit(): void {
    
    this.validChange.emit(true);
    this.valueChange.emit(this.selection);
  }

  pick(refundable: boolean) {
    this.selection = { refundable, feePerTicket: this.feePerTicket };
    this.valueChange.emit(this.selection);
    this.validChange.emit(true);
  }
}
