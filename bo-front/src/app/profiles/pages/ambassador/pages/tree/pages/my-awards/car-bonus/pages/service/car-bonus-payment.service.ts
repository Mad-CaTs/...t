import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

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
    correctPayment(paymentId: string, request: FormData): Observable<any> {
        return this.http.put(`${BASE_URL}/${this.endpointCreate}/${paymentId}/correct`, request);
    }
}