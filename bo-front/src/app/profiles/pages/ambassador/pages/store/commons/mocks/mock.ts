import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockService {
  private services = [
    {
      id: 1,
      name: 'Fulldays',
      serviceList: [
        {
          idService: 101,
          name: 'Servicio A',
          description: 'Descripción del Servicio A',
          price: 50,
          numberInstallments: 12,
          initialPrice: 10
        },
        {
          idService: 102,
          name: 'Servicio B',
          description: 'Descripción del Servicio B',
          price: 75,
          numberInstallments: 6,
          initialPrice: 20
        }
      ]
    },
    {
      id: 2,
      name: 'Noches de alojamiento',
      serviceList: [
        {
          idService: 201,
          name: 'Servicio C',
          description: 'Descripción del Servicio C',
          price: 100,
          numberInstallments: 3,
          initialPrice: 50
        },
        {
          idService: 202,
          name: 'Servicio D',
          description: 'Descripción del Servicio D',
          price: 125,
          numberInstallments: 5,
          initialPrice: 25
        }
      ]
    },
    {
      id: 3,
      name: 'Alquiler de Espacios',
      serviceList: [
        {
          idService: 101,
          name: 'Servicio A',
          description: 'Descripción del Servicio A',
          price: 50,
          numberInstallments: 12,
          initialPrice: 10
        },
        {
          idService: 102,
          name: 'Servicio B',
          description: 'Descripción del Servicio B',
          price: 75,
          numberInstallments: 6,
          initialPrice: 20
        }
      ]
    },
    {
      id: 4,
      name: 'Salones',
      serviceList: [
        {
          idService: 101,
          name: 'Servicio A',
          description: 'Descripción del Servicio A',
          price: 50,
          numberInstallments: 12,
          initialPrice: 10
        },
        {
          idService: 102,
          name: 'Servicio B',
          description: 'Descripción del Servicio B',
          price: 75,
          numberInstallments: 6,
          initialPrice: 20
        }
      ]
    },
  ];



  constructor() { }

  getServices(): Observable<any[]> {
    return of(this.services);
  }
}
