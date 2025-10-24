import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestorePuchasesService {
  private url = environment.URL_API_TicketApi;
  private _http: HttpClient = inject(HttpClient);

  updatePurchase(id: number, formData: FormData): Observable<any> {
    return this._http.put(`${this.url}/api/v1/ticket/payments/${id}/correct`, formData);
  }
}