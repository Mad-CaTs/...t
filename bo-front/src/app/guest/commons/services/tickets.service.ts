import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TicketsResponse } from '../interfaces/guest-components.interface';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  private url = environment.URL_API_TicketApi;
  private _http: HttpClient = inject(HttpClient);

  public getTickets(id: number, status: 'ACTIVE' | 'INACTIVE', page = 0, size = 10): Observable<TicketsResponse> {
    const body = {
      page,
      size,
      sortBy: 'created_at',
      asc: false
    };

    return this._http.post<TicketsResponse>(`${this.url}/api/v1/user/tickets/${id}/${status}`, body)
      .pipe(
        catchError((err: any) => {
          // Si el servidor responde 404 (no hay pagos/tickets), devolvemos una página vacía
          if (err?.status === 404) {
            const empty: TicketsResponse = {
              result: true,
              data: {
                content: [],
                totalElements: 0,
                totalPages: 0,
                size: 0,
                number: 0
              },
              status: 200
            };
            // adjuntar mensaje del servidor en una propiedad meta para que la UI lo muestre si lo desea
            (empty as any).meta = { serverMessage: err?.error?.message };
            return of(empty);
          }
          throw err;
        })
      );
  }

  /**
   * Obtiene el detalle de tickets asociados a un paymentId (incluye ticketUuid, status y pdfUrl)
   */
  public getTicketsDetails(paymentId: number, page = 0, size = 10) {
    const body = {
      page,
      size,
      sortBy: 'created_at',
      asc: false
    };

    return this._http.post<any>(`${this.url}/api/v1/user/tickets/details/${paymentId}`, body);
  }
}
