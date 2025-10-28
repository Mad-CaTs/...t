import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { map, Observable } from 'rxjs';
import { Quotation, QuotationRequest } from '../../interface/quotation.interface';
import { Event } from 'src/app/init-app/pages/events/models/public-basic-event.model';

@Injectable({
	providedIn: 'root'
})
export class QuotationService {
	private _gatewayUrl = environment.URL_GATEWEY;
	private _ticketUrl = environment.URL_API_TicketApi;
	private _http: HttpClient = inject(HttpClient);

	getQuotationsByClassificationId(classificationId: string): Observable<Quotation[]> {
		return this._http
			.get<Quotation[]>(`${this._gatewayUrl}/car-bonus/quotations/details/${classificationId}`)
			.pipe(map((response: any) => response.data));
	}

	createQuotation(request: QuotationRequest): Observable<String> {
		const formData = new FormData();

		formData.append('classificationId', request.classificationId);
		formData.append('brandName', request.brandName);
		formData.append('modelName', request.modelName);
		formData.append('color', request.color);
		formData.append('price', request.price);
		formData.append('dealershipName', request.dealershipName);
		formData.append('executiveCountryId', request.executiveCountryId);
		formData.append('salesExecutiveName', request.salesExecutiveName);
		formData.append('salesExecutivePhone', request.salesExecutivePhone);
		formData.append('quotationFile', request.quotationFile);
		formData.append('eventId', request.eventId);
		formData.append('initialInstallments', request.initialInstallments);

		return this._http
			.post<String>(`${this._gatewayUrl}/car-bonus/quotations`, formData)
			.pipe(map((response: any) => response.data));
	}

	updateQuotation(quotationId: string, request: QuotationRequest): Observable<String> {
		const formData = new FormData();

		formData.append('brandName', request.brandName);
		formData.append('modelName', request.modelName);
		formData.append('color', request.color);
		formData.append('price', request.price);
		formData.append('dealershipName', request.dealershipName);
		formData.append('executiveCountryId', request.executiveCountryId);
		formData.append('salesExecutiveName', request.salesExecutiveName);
		formData.append('salesExecutivePhone', request.salesExecutivePhone);
		if (request.quotationFile) {
			formData.append('quotationFile', request.quotationFile);
		}
		formData.append('eventId', request.eventId);
		formData.append('initialInstallments', request.initialInstallments);

		return this._http
			.put<String>(`${this._gatewayUrl}/car-bonus/quotations/${quotationId}`, formData)
			.pipe(map((response: any) => response.data));
	}

	getEvents(): Observable<Event[]> {
		return this._http.get<Event[]>(`${this._ticketUrl}/events/active`);
	}

	deleteQuotation(quotationId: string): Observable<string> {
		return this._http
			.delete<void>(`${this._gatewayUrl}/car-bonus/quotations/${quotationId}`)
			.pipe(map((response: any) => response.data));
	}
}
