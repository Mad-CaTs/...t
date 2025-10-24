import { CanActivateFn } from '@angular/router';
import { of } from 'rxjs';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
	const cookieService = inject(CookieService);
	const router = inject(Router);

	const authData = cookieService.get('authData');
	const token = authData ? JSON.parse(authData)?.access_token : null;

	if (token) {
		try {
			const tokenPayload = JSON.parse(atob(token.split('.')[1]));
			const expirationTime = tokenPayload.exp * 1000;
			const currentTime = Date.now();

			if (currentTime >= expirationTime) {
				console.warn('⚠️ Token expirado, redirigiendo al login...');
				/* comentado por el momento*/
				/*  cookieService.delete('authData');
                router.navigate(['/login-nuevo']); */
				return of(false);
			}

			return of(true);
		} catch (error) {
			console.error('❌ Error al decodificar el token:', error);
			/* comentado por el momento*/

			/*  cookieService.delete('authData');
            router.navigate(['/login-nuevo']); */
			return of(false);
		}
	} else {
		/* comentado por el momento*/
		/*         router.navigate(['/login-nuevo']);
		 */ return of(false);
	}
};
