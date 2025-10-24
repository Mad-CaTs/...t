import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, catchError, throwError } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
    providedIn: 'root'
})

export class TemporalTokenService {

    private urlgateway = environment.URL_GATEWEY;
    private urlaccount = environment.URL_ACCOUNT;
    private urlpath = '/temporary';

    constructor(private http: HttpClient) { }

    getTemporalTokenByToken(token: string): Observable<any> {

        const url = `${this.urlaccount}${token}`;
        return this.http.get<any>(url).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error) => {
                // Aquí puedes manejar diferentes tipos de errores
                if (error.status === 404) {
                    return throwError(() => new Error('El recurso solicitado no existe'));
                } else if (error.status === 401) {
                    return throwError(() => new Error('No tienes permisos para acceder a este recurso'));
                } else {
                    return throwError(() => new Error('Ocurrió un error inesperado'));
                }
            })
        );
    }

    postTemporalToken(paramBody: any, temporary: string) {
        const url = `${this.urlaccount}${temporary}`;
        return this.http.post(url, paramBody).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error) => {
                // Aquí puedes manejar diferentes tipos de errores
                if (error.status === 404) {
                    return throwError(() => new Error('El recurso solicitado no existe'));
                } else if (error.status === 401) {
                    return throwError(() => new Error('No tienes permisos para acceder a este recurso'));
                } else {
                    return throwError(() => new Error('Ocurrió un error inesperado'));
                }
            })
        );
    }


    deleteTemporalToken(temporary: string): Observable<any> {
        const url = `${this.urlaccount}${temporary}`;
        return this.http.delete<any>(url).pipe(
            map((response: any) => {
                return response;
            }),
            catchError((error) => {
                // Aquí puedes manejar diferentes tipos de errores
                if (error.status === 404) {
                    return throwError(() => new Error('El recurso solicitado no existe'));
                } else if (error.status === 401) {
                    return throwError(() => new Error('No tienes permisos para acceder a este recurso'));
                } else {
                    return throwError(() => new Error('Ocurrió un error inesperado'));
                }
            })
        );
    }




}