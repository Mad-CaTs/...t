import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IPaypalTransaction } from '../shared/interfaces/wallet-interface';

@Injectable({
    providedIn: 'root'
})

export class WalletService {

    private urlPaymentTest = environment.URL_API_PAYMENT;
    private urlbase = environment.URL_ADMIN;
    private urlWallet = environment.URL_WALLET;
    private urlpath = '/api/v1';

    constructor(private http: HttpClient) { }

    getWalletTransactions(userId: number): Observable<IPaypalTransaction[]> {
        return this.http.get<IPaypalTransaction[]>(`${this.urlpath}/wallettransaction/user/${userId}`)
            .pipe(
                map((response: any) => response.data)
            );
    }


    getAllPaymentTypes(params: string): Observable<any> {

        const url = `${this.urlbase}${params}`;

        return this.http.get(url).pipe(
            map((response: any) => {
                return response;
            })
        );

    }

    postTransactionChargePaypal(paramBody: any, params) {
        const url = `${this.urlWallet}${params}`;

        return this.http.post(url, paramBody).pipe(
            map((response: any) => {
                return response;
            })
        );

    }

    getWalletById(id: number): Observable<any> {
        return this.http.get<any>(`${this.urlWallet}/wallet/user/${id}`).pipe(
            map((response: any) => {
                return response.data;
            })
        );
    }
}