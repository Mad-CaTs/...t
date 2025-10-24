import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ComisionesService {
  private url = environment.URL_API_COMMISSION;


	constructor(private http: HttpClient) {}

  getInfoWithPagination(userId: number, page: number, size: number): Observable<any> {
    return this.http.get(`${this.url}/commissions/period/${userId}`, {
      params: {
        page: page.toString(),
        size: size.toString(),
      },
    });
  }
  

  

	getInfo(idSocio: number): Observable<any> {
    return this.http.get(`${this.url}/commissions/period/${idSocio}`);	} 

    getBonusInfo(idSocio: number, idPeriodo: number): Observable<any> {
      return this.http.get(`${this.url}/commissions/bonus/user/${idSocio}/period/${idPeriodo}`);
    }

 
	
}
