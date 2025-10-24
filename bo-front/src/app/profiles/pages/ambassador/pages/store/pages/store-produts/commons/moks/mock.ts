import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductMockService {
  constructor() { }

  getProducts(): Observable<any[]> {
    const products = [
      {
        name: 'G- Colag 500 GR',
        description: 'Producto de Colágeno 100% natural',
        price: 'S/.120',
        image: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-g&colag.png', 

        quantity: 0
      },
      {
        name: 'Producto 2',
        description: 'Descripción del Producto 2',
        price: 'S/.150',
        image: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-g&colag.png', 
        quantity: 0
      },
      {
        name: 'Producto 3',
        description: 'Descripción del Producto 3',
        price: 'S/.80',
        image: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-g&colag.png', 
        quantity: 0
      },
      {
        name: 'Producto 4',
        description: 'Descripción del Producto 4',
        price: 'S/.200',
        image: 'https://s3.us-east-2.amazonaws.com/backoffice.documents/bo-imagenes/ef81cddc-6ef7-47ba-a21b-2c48e3a5bf86-g&colag.png', 
        quantity: 0
      }
    
    ];

    return of(products); 
  }
}
