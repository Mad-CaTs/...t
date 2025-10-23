import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IMembershipVersion } from "@interfaces/packageAdministrator";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class MembershipVersionAdministratorService {
    
    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/`;
  
    constructor(private http: HttpClient) {}

    getLastMembershipVersionByFamilyPackage(idFamilyPackage: string): Observable<any> {
        const url = `${this.apiUrl}membershipversion/last/familypackage/`+idFamilyPackage;
        return this.http.get<any>(url).pipe(
          map(response => response.data),
          catchError((error: any) => {
            return throwError(error);
          })
        );
    }

    getActiveMembershipVersionByFamilyPackage(idFamilyPackage: string): Observable<any> {
        const url = `${this.apiUrl}membershipversion/version/active/familypackage/`+idFamilyPackage;
        return this.http.get<any>(url).pipe(
          map(response => response.data),
          catchError((error: any) => {
            return throwError(error);
          })
        );
    }

    getAllMembershipVersionByFamilyPackage(idFamilyPackage: string): Observable<IMembershipVersion[]> {
      const url = `${this.apiUrl}membershipversion/` + idFamilyPackage + '/family/package';
      return this.http.get<{ data: IMembershipVersion[] }>(url).pipe(
        map(response => response.data),
        catchError((error: any) => {
          return throwError(error);
        })
      );
    }

    activeVersionByFamilyPackage(idFamilyPackage: string, idVersion: string): Observable<any>{
      const url = `${this.apiUrl}membershipversion/familypackage/`+idFamilyPackage+"/version/"+idVersion+"/activate";
      return this.http.put<any>(url, {}).pipe(
        map(response => {
          if (response.body.result) {
            return response.body;
          } 
          else {
            console.error('Error al activar:', response.body.data);
            throw new Error(response.body.data);
          }
        }),
        catchError(error => {
          console.error('Error en la petición:', error);
          return throwError(() => new Error('Error en la activación de la versión.'));
        })
    );
    }

    createNewVersionByFamilyPackage(idFamilyPackage: string): Observable<any>{
      const url = `${this.apiUrl}membershipversion/new/membership/version/`+idFamilyPackage;
      return this.http.post<any>(url, {}).pipe(
        map(response => {
          if (response.result) {
            return response.data;
          } 
          else {
            console.error('Error al crear nueva versión:', response.result);
            throw new Error(response.data);
          }
        }),
        catchError(error => {
          console.error('Error en la petición:', error);
          return throwError(() => new Error('Error en la creación de la versión.'));
        })
    );
    }
    
}  