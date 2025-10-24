import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProspectService {
  private url = '/api/v1';
  private urlaccount = environment.URL_ACCOUNT;

  constructor(private httpClient: HttpClient) { }

  getProspectsByUserId(userId: number, page: number, size: number): Observable<any> {
    return this.httpClient.get<any>(`${this.url}/prospect/user/${userId}?page=${page}&size=${size}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  findProspectDocumentNumber(document: number) {
    return this.httpClient.get<any>(`${this.urlaccount}/prospect/documentNumber/${document}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  findProspectById(id: number) {
    return this.httpClient.get<any>(`${this.url}/prospect/${id}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  saveProspect(data: any): Observable<any> {
    return this.httpClient.post<any>(`${this.url}/prospect`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  updateProspect(data: any, id: number): Observable<any> {
    return this.httpClient.put<any>(`${this.url}/prospect/${id}`, data).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  deleteProspect(id: number, url: string) {
    const encodedUrl = encodeURIComponent(url);
    return this.httpClient.delete<any>(`${this.url}/prospect/${id}?url=${encodedUrl}`).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

}
