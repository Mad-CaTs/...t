import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class PackageDetailAdministratorService {
    
    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/`;
  
    constructor(private http: HttpClient) {}

    getDetailPackagesByFamilyAndVersion(idFamilyPackage: string, idVersion: string): Observable<any[]> {
        const url = `${this.apiUrl}package/family/${idFamilyPackage}/version/${idVersion}`;
        return this.http.get<any>(url).pipe(
            map(response => {
                return response.data.flatMap((pkg: any) => 
                    pkg.packageDetail.map((detail: any) => ({
                        ...detail,
                        packageName: pkg.name,
                        codeMembership: pkg.codeMembership,
                        description: pkg.description,
                        idPackage: pkg.idPackage
                    }))
                );
            }),
            catchError((error: any) => {
                console.error('Error fetching package details:', error);
                return of([]);
            })
        );
    }

    updatePackageDetail(body: any): Observable<any[]> {
        const url = `${this.apiUrl}packagedetail/`;
        return this.http.put<any>(url, body).pipe(
        map(response => response),
            catchError((error: any) => {
                return throwError(error);
            })
        );
    }

    createPackageDetail(body: any): Observable<any> {
        const url = `${this.apiUrl}packagedetail/`;
        return this.http.post<any>(url, body);
    }


}