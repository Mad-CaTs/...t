import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataSharingService {
  private selectedProduct: any;
  private selectedCuota: any;

  constructor() { }

  setSelectedProduct(product: any): void {
    this.selectedProduct = product;
    localStorage.setItem('selectedProduct', JSON.stringify(product));

  }

  getSelectedProduct(): any {
    return this.selectedProduct;
  }

  setSelectedCuota(cuota: any): void {
    this.selectedCuota = cuota;
  }

  getSelectedCuota(): any {
    return this.selectedCuota;
  }
}
