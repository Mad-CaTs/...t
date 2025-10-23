import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SubscriptionData } from '../models/subscription-data.interface';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private mockData: { [key: number]: SubscriptionData } = {
    20425: {
      nombreCompleto: "LUZ MARINA HUANACUNI MAMANI",
      nacionalidad: "PERUANA",
      tipoDocumento: "DNI-DOCUMENTO NACIONAL DE IDENTIDAD",
      nrodocument: "43876082",
      distrito: "ILAVE",
      pais: "PERU",
      nombrePaquete: "Experience La Joya",
      nombreFamilypackage: "INRESORTS LA JOYA",
      acciones: 0,
      idsuscription: 20425,
      escalaPago: null
    },
    30449: {
      nombreCompleto: "JUAN PEREZ RODRIGUEZ",
      nacionalidad: "PERUANA",
      tipoDocumento: "DNI-DOCUMENTO NACIONAL DE IDENTIDAD",
      nrodocument: "45123678",
      distrito: "LIMA",
      pais: "PERU",
      nombrePaquete: "Premium La Joya",
      nombreFamilypackage: "INRESORTS LA JOYA",
      acciones: 2,
      idsuscription: 30449,
      escalaPago: "Primera escala"
    }
  };

  getSubscriptionData(subscriptionId: number): Observable<SubscriptionData> {
    const data = this.mockData[subscriptionId];
    if (data) {
      return of(data);
    }
    
    return of({
      nombreCompleto: "",
      nacionalidad: "",
      tipoDocumento: "",
      nrodocument: "",
      distrito: "",
      pais: "",
      nombrePaquete: "",
      nombreFamilypackage: "",
      acciones: 0,
      idsuscription: subscriptionId,
      escalaPago: null
    });
  }
}