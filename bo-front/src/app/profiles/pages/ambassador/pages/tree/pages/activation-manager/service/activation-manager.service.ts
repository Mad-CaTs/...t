import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IPayment } from '@shared/interfaces/payment/payment';
import { INumberAndCountry } from '@shared/interfaces/number-and-country';
@Injectable({
  providedIn: 'root'
})
export class ActivationManagerService {
 private url = environment.URL_ADMIN;
  constructor(private httpClient: HttpClient) { }

  getListSubscription(idSubscription: number): Observable<IPayment[]> {
    return this.httpClient.get<IPayment[]>(`${this.url}/payment/schedule/${idSubscription}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

  getNumberAndCountryCode(idUser: number): Observable<INumberAndCountry> {
  
  return this.httpClient.get<INumberAndCountry>(`${this.url}/user/getNumberAndCountryCode/${idUser}`).pipe(
    map((response: any) => {
      return response;
    })
  );
  }

  nextExpirationDate(nextExpirationArray: number[]): Date {
  if (!nextExpirationArray || nextExpirationArray.length < 3) {
    throw new Error('El array de fecha no es válido');
  }

  return new Date(
    nextExpirationArray[0],       // Año
    nextExpirationArray[1] - 1,   // Mes (ajustado)
    nextExpirationArray[2],       // Día
  );
}

}
