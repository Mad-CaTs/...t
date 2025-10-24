import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private userBaseUrl = environment.URL_ADMIN;

  constructor(private http: HttpClient) { }

  getListUsersBySponsor(idSponsor: number, username: string): Observable<any> {
    const url = `${this.userBaseUrl}/user/getListUsersBySponsor/search/${idSponsor}`;

    const payload = {
      username: username,
      state: -1,
      familyPackage: -1,
      packageDetail: -1,
      typeUser: 1
    };

    return this.http.post<any>(url, payload);
  }

  sendEmailNotification(payload: Record<string, any>): Observable<any> {
    const url = `${this.userBaseUrl}/email/admin/sendemail`;
    return this.http.post<any>(url, payload);
  }
}
