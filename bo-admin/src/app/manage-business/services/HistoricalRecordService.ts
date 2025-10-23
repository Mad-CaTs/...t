import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})

export class HistoricalRecordService {

    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/`;

    constructor(private http: HttpClient) { }

    getPackageHistoryByFamilyAndVersion(idFamilyPackage: string, idVersion: string): Observable<any[]> {

        const url = `${this.apiUrl}package/history/family/${idFamilyPackage}/version/${idVersion}`;
        return this.http.get<any>(url).pipe(
            map(response => response.data),
            catchError((error: any) => {
                return throwError(error);
            })
        )
    }


}