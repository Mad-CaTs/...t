import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailsTickets } from '../interfaces/guest-components.interface';

@Injectable({
  providedIn: 'root'
})
export class DetailsOfTicketsService {
  private _http: HttpClient = inject(HttpClient);

  public getTicketDetails(): Observable<DetailsTickets[]> {
    return this._http.get<DetailsTickets[]>('/assets/mocks/ticket-details-mock.json');
  }
}
