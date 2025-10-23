import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class FamilyPackageAdministratorService {
  
  private readonly API = environment.api;
  private apiUrl = `${this.API}/api/`;

  constructor(private http: HttpClient) {}

  getAllFamilyPackages(): Observable<any[]> {
    const url = `${this.apiUrl}familypackage/`;
    return this.http.get<any>(url).pipe(
      map(response => response.data),
      catchError((error: any) => {
        return throwError(error);
      })
    );
  }

  createNewFamilyPackage(name: String, description: String): Observable<any> {
    const url = `${this.apiUrl}familypackage/insert`;
    const body = {
      "name": name,
      "description": description,
      "idSerie": null
    };
    
    return this.http.post<any[]>(url, body).pipe(
      catchError((error: any) => {
          return throwError(error);
      })
    );
  }

  editFamilyPackage(id: String, name: String, description: String): Observable<any>{
    const url = `${this.apiUrl}familypackage/`;
    const body = {
      "idFamilyPackage": id,
      "name": name,
      "description": description
    };
    
    return this.http.put<any[]>(url, body).pipe(
      catchError((error: any) => {
          return throwError(error);
      })
    );
  }


}