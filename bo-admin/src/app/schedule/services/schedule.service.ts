import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IEmailingTableData } from '@interfaces/users.interface';
import { catchError, map } from 'rxjs/operators';
import { Register } from '@interfaces/partners.interface';
import { PaymentVoucher } from '../../interfaces/partners.interface';
import { formatDate } from '@utils/date';

@Injectable({
	providedIn: 'root'
})
export class ScheduleService {
	private readonly API = environment.api;
	private apiUrl = `${this.API}/api/payment/`;
	private apiPaymentVoucherUrl = `${this.API}/api/paymentvoucher/`;
	private userData: any = null;

	constructor(private http: HttpClient) {}

	setUserData(data: any) {
		this.userData = data;
	}
	getUserData() {
		return this.userData;
	}
	clear() {
		this.userData = null;
	}

	// Método para eliminar pagos
	deletePayments(paymentIds: number[]): Observable<any> {
		const url = `${this.apiUrl}delete/payment`;
		return this.http.delete(url, { body: paymentIds }).pipe(
			map((response) => {
				return response;
			}),
			catchError((error) => {
				console.error('Error al eliminar pagos:', error);
				return throwError(() => new Error('Error al eliminar pagos'));
			})
		);
	}

	// Método para eliminar vouchers
	deleteVouchers(paymentIds: number[]): Observable<any> {
		const url = `${this.apiPaymentVoucherUrl}delete/voucher`;
		return this.http.delete(url, { body: paymentIds }).pipe(
			map((response) => {
				console.log('Eliminación exitosa:', response);
				return response;
			}),
			catchError((error) => {
				console.error('Error al eliminar vouchers:', error);
				return throwError(() => new Error('Error al eliminar vouchers'));
			})
		);
	}

	getSchedule(idSuscription: number): Observable<Register[]> {
		return this.http.get<any>(`${this.apiUrl}schedule/${idSuscription}`).pipe(
			map((response) => {
				if (!response.result || !response.data) {
					throw new Error('Invalid response structure');
				}
				return response.data.map((res: any) => ({
					idPayment: res.idPayment,
					idSuscription: res.idSuscription,
					quoteDescription: res.quoteDescription,
					nextExpiration: formatDate(res.nextExpiration),
					dollarExchange: res.dollarExchange,
					quoteUsd: res.quotaUsd,
					percentage: res.percentage,
					statePaymentId: res.statePaymentId,
					obs: res.obs,
					payDate: formatDate(res.payDate),
					pts: res.pts,
					isQuoteInitial: res.isQuoteInitial,
					positionOnSchedule: res.positionOnSchedule,
					numberQuotePay: res.numberQuotePay,
					amortization: res.amortizationUsd,
					capitalBalance: res.capitalBalanceUsd,
					totalOverdue: res.totalOverdue,
					//   interested: res.interested,
					verif: res.statePaymentId,
					paymentVouchers: res.paymentVouchers.map((voucher: PaymentVoucher) => ({
						idPaymentVoucher: voucher.idPaymentVoucher,
						paymentId: voucher.paymentId,
						suscriptionId: voucher.suscriptionId,
						pathPicture: voucher.pathPicture,
						operationNumber: voucher.operationNumber,
						methodPaymentSubTypeId: voucher.methodPaymentSubTypeId,
						note: voucher.note,
						paymentCoinCurrencyId: voucher.paymentCoinCurrencyId,
						subTotalAmount: voucher.subTotalAmount,
						comissionPaymentSubType: voucher.comissionPaymentSubType,
						totalAmount: voucher.totalAmount,
						creationDate: voucher.creationDate,
						companyOperationNumber: voucher.companyOperationNumber,
						nameMethodPaymentType: voucher.nameMethodPaymentType,
						nameMethodPaymentSubType: voucher.nameMethodPaymentSubType,
						namePicture: voucher.namePicture
					}))
				})) as Register[];
			}),
			catchError((error) => {
				console.error('Error fetching document types:', error);
				return throwError(() => new Error('Error fetching document types'));
			})
		);
	}

	updateSchedule(idSuscription: number, newSchedule: any[]): Observable<any> {
		const url = `${this.apiUrl}update/schedule`;
		const body = {
			idSuscription: idSuscription,
			packageDetail: null,
			flagUpdatePackage: false,
			flagGenerateComission: false,
			schedule: newSchedule
		};
		return this.http.put(url, body, { responseType: 'text' }).pipe(
			map((response) => {
				return response;
			}),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}

	// Método para corregir el cronograma
	fixSchedule(idSuscription: number): Observable<any> {
		const url = `${this.apiUrl}cronograma-correction/${idSuscription}`;
		return this.http.post<any>(url, {}).pipe(
			map((response) => {
				return response;
			}),
			catchError((error: any) => {
				return throwError(error);
			})
		);
	}

	// Método para enviar a copiar/mover los vouchers
	bulkVoucherOperations(operations: any[]): Observable<any> {
		const payload = operations.map((op) => ({
			sourceVoucherId: op.sourceVoucherId,
			targetPaymentId: op.targetPaymentId,
			operationType: op.operationType
		}));

		return this.http.post(`${this.apiPaymentVoucherUrl}bulk-operations`, payload);
	}
}
