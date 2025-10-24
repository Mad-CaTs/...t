import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiquidatedService {
  private url = environment.URL_JOBSTATUSAPI;


  constructor(private httpClient: HttpClient) { }

 

  findBeneficiaryById(id: number) {

    return this.httpClient.get<any>(`${this.url}/liquidation/filter/sponsor/${id}`).pipe(
     map((response: any) => {
        return response;
      })
    );
  }

 



 

}
