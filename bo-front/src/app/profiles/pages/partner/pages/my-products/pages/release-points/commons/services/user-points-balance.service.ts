import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPointsBalanceService {

  private apiUrl = '/api/v1/user-points-released';
  private apiUrlPointsRedeptiom = '/points-redemption-history/user';

  constructor(private http: HttpClient) { }

  getPointsRedemptionHistoryByUser(idUser: number): Observable<any> {

    const url = `${this.apiUrl}/${this.apiUrlPointsRedeptiom}/${idUser}`;
    console.log('URL user-points-released:', url);
    return this.http.get(url);
  }

}
