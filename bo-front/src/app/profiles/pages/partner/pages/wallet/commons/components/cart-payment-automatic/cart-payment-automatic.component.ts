import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart-payment-automatic',
  standalone: true,
  imports: [],
  templateUrl: './cart-payment-automatic.component.html',
  styleUrl: './cart-payment-automatic.component.scss'
})
export class CartPaymentAutomaticComponent {

  constructor (private router: Router){}

  navigateToAffiliateAutomaticPayment(): void {
    this.router.navigate([`/profiles/partner/wallet/automatic-payment`, {}]);
  }
}
