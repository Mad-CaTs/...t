import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { ICarBonusScheduleResponse } from '../../interface/car-bonus-schedule';
import { ICarBonusScheduleExtraResponse } from '../../interface/car-bonus-schedule-extra';

const BASE_URL = environment.URL_BONUS_API;

@Injectable({
    providedIn: 'root'
})
export class CarBonusScheduleService {
    private endponitGene = 'car-bonus/schedules/search/';
    private endpoint = 'car-bonus/schedules/initials/';
    private endpointExtra = 'car-bonus/schedules/extra-info/';
    private endpointExport = 'car-bonus/schedules/export/';

    constructor(private http: HttpClient) { }

    getCarBonusSchedule(idUser: string, page: number, size: number): Observable<ICarBonusScheduleResponse> {
        return this.http.get<ICarBonusScheduleResponse>(`${BASE_URL}/${this.endpoint}${idUser}?page=${page}&size=${size}`);
    }

    getCarBonusScheduleGene(idUser: string, page: number, size: number): Observable<ICarBonusScheduleResponse> {
        return this.http.get<ICarBonusScheduleResponse>(`${BASE_URL}/${this.endponitGene}${idUser}?page=${page}&size=${size}`);
    }

    getScheduleExtra(carAssignmentId: string): Observable<ICarBonusScheduleExtraResponse> {
        const url = `${BASE_URL}/${this.endpointExtra}${carAssignmentId}`;
        return this.http.get<ICarBonusScheduleExtraResponse>(url);
    }

    exportSchedule(carAssignmentId: string): Observable<Blob> {
        const url = `${BASE_URL}/${this.endpointExport}${carAssignmentId}`;
        return this.http.get(url, { responseType: 'blob' });
    }
}