import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpContextToken } from '@angular/common/http';

import { Observable } from 'rxjs';

import { getCokkie } from '@utils/cokkies';
import { environment } from 'src/environments/environment';

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
@Injectable()
export class HttpClientInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// Omitir autorización para todos los endpoints TicketApi, PDF, Cupones y Collaborators
		if (
			req.url.startsWith(environment.TicketApi) || 
			req.url.startsWith(environment.apiPdf) ||
			req.url.startsWith(environment.apiCupons) ||
		 	req.url.startsWith(environment.BonusApi)
		) {
			return next.handle(req);
		}
		if (req.context.get(SKIP_AUTH)) {
			return next.handle(req);
		}
		if (
			req.url.includes('/validate/uploadBCP') ||
			req.url.includes('/auditlog/audit-logs/search') ||
			req.url.includes('/validate/download-excel') ||
			req.url.includes('/validate/download-txt') ||
			req.url.includes('/validate/validateAllBCP') ||
			req.url.includes('/bank-status') ||
			req.url.includes('/bank-status/reviews') ||
			req.url.includes('/type-wallet-transaction') ||
			req.url.includes('/list/bonus') ||
			req.url.includes('/three/getLevelsAndCommissionsPanelAdmin') ||
			req.url.includes('/solicitudebank') ||
			req.url.includes('/reasonbank') ||
			req.url.includes('/three/listPartnersAdvanced') ||
			req.url.includes('/three/ranges/active') ||
			req.url.includes('/three/listSponsors') ||
			req.url.includes('/three/listSponsors/export') ||
			req.url.includes('/three/listPartnersAdvanced/export') ||
			//req.url.includes('/user') ||
			//req.url.includes('/suscription') ||
			//req.url.includes('/country') ||
			//req.url.includes('/documenttype/country') ||
			req.url.startsWith(environment.apiUrlTransfer)
		) {
			return next.handle(req);
		}

		const token = getCokkie('TOKEN');
		//const token = localStorage.getItem('TOKEN');
		//alert(token)

		let clonedRequest = req;
		if (token) {
			clonedRequest = req.clone({
				headers: req.headers.set('Authorization', `Bearer ${token}`)
			});
		}

		//if (token) {
		//	req = req.clone({ headers: req.headers.set('Authorization', `Bearer ${token}`) });
		//}

		return next.handle(clonedRequest);
	}
}