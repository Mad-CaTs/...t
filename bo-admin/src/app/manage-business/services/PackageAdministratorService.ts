import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class PackageAdministratorService {
  
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private http: HttpClient) {}

  getPackagesByIdFamilyPackage(idFamilyPackage: string): Observable<any[]> {
    const url = `${this.apiUrl}package/`+idFamilyPackage+"/family";
    return this.http.get<any>(url).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  updatePackage(body: any): Observable<any[]> {
    const url = `${this.apiUrl}package/`;
    return this.http.put<any>(url, body).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  createPackage(body: any): Observable<any[]> {
    const url = `${this.apiUrl}package/create`;
    return this.http.post<any>(url, body).pipe(
      map(response => response),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

}