import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReleasePointsService {
  private apiUrl = '/api/v1/membership/release-points';
  private apiUrlMovements = '/api/v1/membership/movements/user';



  constructor(private http: HttpClient) { }

  releasePoints(idUser: number,idSus: number): Observable<any> {
    const url = `${this.apiUrl}/${idUser}/${idSus}`;
    return this.http.get(url);
  }

  sendReleasePoints(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }


  getUserMovements(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrlMovements}/${userId}`);
  }

}
