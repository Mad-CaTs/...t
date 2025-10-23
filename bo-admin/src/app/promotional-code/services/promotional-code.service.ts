import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StatementValidateRequest } from '@app/conciliations/models/conciliation-validation';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PromotionalCodeService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private http: HttpClient) { }

 getPromotionalGuests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}account/promotionalGuests`);
  }

  confirmAssist(id: number, status: number): Observable<any> {
    const url = `${this.apiUrl}account/promotionalGuests/${id}/confirm/${status}`;
    return this.http.get<any>(url); 
  }
}
