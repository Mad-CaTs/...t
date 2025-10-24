import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PackageDetailServiceService {
  private baseUrl = 'https://adminpanelapi-dev.inclub.world/api/packagedetail';

  constructor(private http: HttpClient) { }
  
  getPackageDetail(idPackageDetail: number, idPackage: number): Observable<any> {
    const url = `${this.baseUrl}/${idPackageDetail}/package/${idPackage}`;
    return this.http.get(url);
  }
}
