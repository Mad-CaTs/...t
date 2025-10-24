import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {
  private url = environment.URL_ADMIN;

  /**
   * Obtiene los tipos de operación (subtipos de pago) para los métodos de pago
   */
  getOperationTypes(): Observable<any[]> {
    return this.http.get<any>(`${this.url}/paymenttype/`).pipe(
      map((response) => response.data),
      map((types) => types.map((type) => {
        type.paymentSubTypeList.forEach((sub) => {
          sub.content = sub.description;
          sub.value = sub.idPaymentSubType;
        });
        return type;
      }))
    );
  }

  constructor(private http: HttpClient) {}
}
