import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import MyProductsComponent from '../../../../my-products/pages/product/my-products.component';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [CommonModule,MyProductsComponent],
  templateUrl: './my-products.component.html',
  styleUrl: './my-products.component.scss'
})
export default class MyProductsLegalizationComponent {

}
