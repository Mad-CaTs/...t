import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (req, next) => {
	return next(req).pipe(
		catchError((error: HttpErrorResponse) => {
			/* dialogService
					.open(RequestErrorModalComponent, {
						header: ``,
						data: {}
					})
					.onClose.subscribe(); */
			if (error.status === 404) {
				console.log('Error 404: Not Found', error);
			} else {
				console.log('Error:', error);
			}
			return throwError(error);
		})
	);
};
