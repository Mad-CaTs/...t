import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PendingPartnerService {
  private url = '/api/v1';

  constructor(private httpClient: HttpClient) { }

  deletePendingPartner(body: any) {
    return this.httpClient.delete<any>(`${this.url}/job-status-delete/delete`, {
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    }).pipe(
      map((response: any) => {
        return response;
      })
    );
  }


}
