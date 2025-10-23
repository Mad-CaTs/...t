import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlacementService {
    private readonly API = environment.api;
    private apiUrl = `${this.API}/api/`;
    constructor(private http: HttpClient) { }

    getPlacementUpliner(body: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}user/getListUsersOfAdminWithUpliners/search`, body).pipe(
            catchError(error => {
                console.error('Error getting upliner list:', error);
                return throwError(() => new Error('Error getting upliner list'));
            })
        );
    }

}