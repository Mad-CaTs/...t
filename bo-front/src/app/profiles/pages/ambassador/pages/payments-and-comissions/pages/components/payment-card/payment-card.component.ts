import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payment-card',
  standalone: true,
  imports: [MatIconModule,CommonModule,RouterModule],
  templateUrl: './payment-card.component.html',
  styleUrl: './payment-card.component.scss'
})
export default class PaymentCardComponent {
@Input() payment!: any;
@Input() showDetailButton: boolean = true;

}
