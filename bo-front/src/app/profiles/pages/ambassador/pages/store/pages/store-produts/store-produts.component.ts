import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import ProductCardComponent from './componets/product-card/product-card.component';
import { ProductMockService } from './commons/moks/mock';

@Component({
  selector: 'app-store-produts',
  standalone: true,
  imports: [InputComponent, CommonModule, ProductCardComponent],
  templateUrl: './store-produts.component.html',
  styleUrl: './store-produts.component.scss'
})
export default class StoreProdutsComponent {
  public form: FormGroup;
  products: any[] = [];
  numSections = 3;
  constructor(private productMockService: ProductMockService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      searchBy: new FormControl(),

    });

    this.loadProducts();
  }


  increaseQuantity(product: any) {
    product.quantity++;
  }

  decreaseQuantity(product: any) {
    if (product.quantity > 0) {
      product.quantity--;
    }
  }



  loadProducts(): void {
    this.productMockService.getProducts().subscribe(data => {
      // Duplicar los productos para cumplir con el número de secciones
      this.products = Array(this.numSections).fill(data).flat();
    });
  }
}