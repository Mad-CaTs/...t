// src/app/shared/guards/guest/guest.guard.ts
import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';

export const GuestGuard: CanActivateFn = () => {
   const router = inject(Router);

   // Obtener token desde localStorage
   const token = localStorage.getItem('guestToken');

	if (!token) {
		router.navigate(['/login-public']);
		return of(false);
	}

	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		const expiration = payload.exp * 1000;
		const now = Date.now();

		if (now >= expiration) {
	  console.warn('⚠️ Token de público expirado');
	  localStorage.removeItem('guestToken');
			router.navigate(['/login-public']);
			return of(false);
		}

		return of(true);
	} catch (e) {
	 console.error('❌ Token de público inválido', e);
	 localStorage.removeItem('guestToken');
		router.navigate(['/login-public']);
		return of(false);
	}
};
