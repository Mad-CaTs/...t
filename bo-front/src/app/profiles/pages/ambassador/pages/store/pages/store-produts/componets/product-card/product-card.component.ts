import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export default class ProductCardComponent {
  @Input() product: any;

  increment() {
    this.product.quantity++;
  }

  decrement() {
    if (this.product.quantity > 0) {
      this.product.quantity--;
    }
  }

}
