import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
	private url = environment.URL_ADMIN;

  constructor(private http: HttpClient) {}

  getCompanyData(): Observable<any> {
    return this.http.get<any>(`${this.url}/master/company`);
  }

}
