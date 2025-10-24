import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class PetResourceServerService {
	constructor(private httpClient: HttpClient) {}

	public breeds(): Observable<any> {
		return this.httpClient.get<any>('/api/v1/breeds');
	}

  public testApi(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/account/test');
  }

/*   public testApi1(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/three');
  }

  public testApi2(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/placement');
  }
  public testApi3(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/membership/webclientTest');
  }
  public testApi4(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/pay/test');
  }
  public testApi5(): Observable<any> {
    return this.httpClient.get<any>('/api/v1/store');
  } */


}
