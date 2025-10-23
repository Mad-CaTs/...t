import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentRejectionReason } from '../models/payment-rejection-reasons.model';

@Injectable({ providedIn: 'root' })
export class PaymentRejectionReasonsService {

    private readonly base = 'http://localhost:8080/api/v1/ticket/payments';

     constructor(private http: HttpClient) {}

    getAll(): Observable<PaymentRejectionReason[]> {
    return this.http.get<PaymentRejectionReason[]>(
      `${this.base}/payment-rejection-reasons`
    );
  }
}