import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  baseUrl = environment.URL_ADMIN;
  constructor(private http: HttpClient) { }

  getRangeBetween(): Observable<any> {
    
    const limaTimezoneOffset = -5 * 60; 
    const now = new Date();
    const limaDate = new Date(now.getTime() + (limaTimezoneOffset - now.getTimezoneOffset()) * 60000);
    const formattedDate = limaDate.toISOString().split('T')[0]; 

    return this.http.get(`${this.baseUrl}/period/rangeBetween/${formattedDate}`);
  }
}
