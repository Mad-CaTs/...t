import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { PurchasesResponse } from '../interfaces/guest-components.interface';
// TODO: aquí creas también la interfaz TicketResponse
// import { TicketResponse } from '../interfaces/tickets.interface';

@Injectable({
  providedIn: 'root'
})
export class PurchasesService {
  private url = environment.URL_API_TicketApi;
  private _http: HttpClient = inject(HttpClient);

  public getPurchases(page: number, size: number = 10, userId: number): Observable<PurchasesResponse> {
    const body = {
      userId,
      pagination: {
        page,
        size
      }
    };

    return this._http.post<PurchasesResponse>(
      `${this.url}/api/v1/user/purchases/`,
      body
    );
  }

  public getUserTickets(paymentId: number): Observable<any> {
    return this._http.get<any>(`${this.url}/api/v1/user-tickets/${paymentId}`);
  }
}
