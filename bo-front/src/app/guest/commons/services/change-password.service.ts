import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChangePassword } from '../interfaces/guest-components.interface';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {
  private url = environment.URL_API_TicketApi;
  private _http: HttpClient = inject(HttpClient);

  changePassword(data: ChangePassword, id: number): Observable<ChangePassword> {
    return this._http.put<ChangePassword>(`${this.url}/users/${id}/password`, data);
  }
}
