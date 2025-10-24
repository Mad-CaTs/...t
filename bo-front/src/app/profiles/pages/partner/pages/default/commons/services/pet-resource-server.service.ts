import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PetResourceServerService {
  
private readonly BASE_URL = '/api/v1';


	constructor(private httpClient: HttpClient, ) {}

	public breeds(): Observable<any> {
		return this.httpClient.get<any>('/api/v1/breeds');
	}

  public testApi(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/account/test');
  }

  getInvestorPoints(userId: number): Observable<any> {
    const url = `${this.BASE_URL}/three/getInvestorPoints/${userId}`;
    return this.httpClient.get<any>(url);
  }

  getExpirationDays(userId: number): Observable<any> {
		return this.httpClient.get<any>(`${this.BASE_URL}/membership/suscriptions/expirationDays/${userId}`);
	}


}
