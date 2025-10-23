import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface DateRangeRequest {
    startDate?: string;
    endDate?: string;
}

export interface ResidualClosureDto {
    // Datos del periodo (PostgreSQL)
    periodId: number;
    periodInitialDate: string;
    periodEndDate: string;
    periodPayDate: string;
    periodCreationUser: string;
    periodCreationDate: string;
    periodModificationUser: string;
    periodModificationDate: string;
    
    // Datos del usuario (PostgreSQL - obtenidos por id_user de MongoDB)
    userId: string;
    userName: string;
    userLastName: string;
    userEmail: string;
    userNroDocument: string;
    userDistrictAddress: string;
    userUsername: string;
    userNroPhone: string;
    userCreateDate: string;
    
    // Estado del usuario (PostgreSQL)
    userStateId: number;
    userStateName: string;
    
    // Estado del residual (PostgreSQL - obtenido por id_state de MongoDB)
    residualStateId: number;
    residualStateName: string;
    
    // Datos MongoDB del período residual
    points1: number;
    points2: number;
    points3: number;
    pointsDirect1: number;
    pointsDirect2: number;
    pointsDirect3: number;
    rangeId: number;
    range: string;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class ResidualClosureApiService {
    
    private readonly baseUrl = environment.apireports;

    constructor(private http: HttpClient) {}

    /**
     * Obtiene todos los cierres residuales
     * GET /api/v1/reports/residual-closures
     */
    getAllResidualClosures(): Observable<any> {
        const url = `${this.baseUrl}/reports/residual-closures`;
        return this.http.get(url);
    }

    /**
     * Obtiene cierres residuales filtrados por rango de fechas de período
     * POST /api/v1/reports/residual-closures/by-period-date-range
     * 
     * @param dateRange Rango de fechas para filtrar por period.creation_date
     */
    getResidualClosuresByPeriodDateRange(dateRange: DateRangeRequest): Observable<any> {
        const url = `${this.baseUrl}/reports/residual-closures/by-period-date-range`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        
        return this.http.post(url, dateRange, { headers });
    }

    /**
     * Descarga Excel de todos los cierres residuales
     * POST /api/v1/reports/residual-closures/download (sin body)
     */
    downloadAllResidualClosures(): Observable<Blob> {
        const url = `${this.baseUrl}/reports/residual-closures/download`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        
        return this.http.post(url, null, { 
            headers,
            responseType: 'blob'
        });
    }

    /**
     * Descarga Excel de cierres residuales filtrados por rango de fechas
     * POST /api/v1/reports/residual-closures/download (con body de fechas)
     * 
     * @param dateRange Rango de fechas para filtrar por period.creation_date
     */
    downloadResidualClosuresByDateRange(dateRange: DateRangeRequest): Observable<Blob> {
        const url = `${this.baseUrl}/reports/residual-closures/download`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        
        return this.http.post(url, dateRange, { 
            headers,
            responseType: 'blob'
        });
    }
}