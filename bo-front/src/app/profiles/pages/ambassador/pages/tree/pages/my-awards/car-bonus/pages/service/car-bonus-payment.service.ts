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
export class CarBonusPaymentService {
    private endpointCreate = 'car-bonus/payments';

    constructor(private http: HttpClient) { }

    makePayment(request: FormData): Observable<any> {
        return this.http.post(`${BASE_URL}/${this.endpointCreate}`, request);
    }
}