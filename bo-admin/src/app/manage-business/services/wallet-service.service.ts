import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@app/auth';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;
  token: string = '';

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    if (this.authService.getAuthTokenFromCookie() != null) {
      this.token = 'Bearer ' + this.authService.getAuthTokenFromCookie();
    }
  }

  getPercentOverdueTypes(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}business-manager/admin-transaction`, data).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

}
