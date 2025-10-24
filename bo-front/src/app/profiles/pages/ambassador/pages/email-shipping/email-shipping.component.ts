import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EmailShippingTableComponent } from './pages/email-shipping-table/email-shipping-table.component';

@Component({
  selector: 'app-email-shipping',
  standalone: true,
  imports: [CommonModule,EmailShippingTableComponent],
  templateUrl: './email-shipping.component.html',
  styleUrl: './email-shipping.component.scss'
})
export default class EmailShippingComponent {

}
