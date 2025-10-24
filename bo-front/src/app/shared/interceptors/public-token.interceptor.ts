// src/app/shared/interceptors/public-token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export const PublicTokenInterceptor: HttpInterceptorFn = (req, next) => {
	const token = localStorage.getItem('guestToken');
	const base = environment.URL_API_TicketApi;

	const isPublicApi = req.url.startsWith(base);
	const isAuthEndpoint = req.url.includes('/event-login') || req.url.includes('/event-signup');

	/*
	 if (isPublicApi && !isAuthEndpoint && token) {
		  const authReq = req.clone({
				setHeaders: {
					Authorization: `Bearer ${token}`
				}
		  });
		  return next(authReq);
	 }
	*/

	return next(req);
};
