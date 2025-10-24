import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { inject, Injector } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const TokensInterceptor: HttpInterceptorFn = (req, next) => {
	const injector = inject(Injector);
	const cookieService = inject(CookieService);
	const router = injector.get(Router);

	const isExcluded =
		req.url.includes('/api/v1/auth/*') ||
		(req.url.startsWith(environment.URL_ADMIN) &&
			!req.url.includes('/api/coupons/*') &&
			!req.url.includes('/api/coupons/validate')) ||
		(req.url.startsWith(environment.URL_ADMIN) && req.url.includes('/api/coupons/name')) ||
		req.url.includes('assets/archivo.html') ||
		req.url.startsWith('/assets/') ||
		req.url.startsWith(window.location.origin + '/assets/') ||
		(req.url.startsWith(environment.URL_API_PAYMENT) && !req.url.includes('/store/apply-discount')) ||
		req.url.startsWith(environment.URL_WALLET) ||
		req.url.startsWith(environment.URL_API_PDF) ||
		req.url.startsWith(environment.URL_ACCOUNT) ||
		req.url.startsWith(environment.URL_API_TicketApi) ||
		req.url.startsWith(environment.URL_API_TRANSFER);
	if (isExcluded) {
		return next(req);
	}

	let modifiedUrl = req.url;
	if (req.url.startsWith('/api/v1')) {
		modifiedUrl = `${environment.URL_GATEWEY}${req.url.replace('/api/v1', '')}`;
	}
	const authData = cookieService.get('authData');
	const token = authData ? JSON.parse(authData)?.access_token : null;
	if (token) {
		const clonedRequest = req.clone({
			url: modifiedUrl,
			setHeaders: {
				Authorization: `Bearer ${token}`
			}
		});
		return next(clonedRequest);
	}

	return next(req.clone({ url: modifiedUrl }));
};
