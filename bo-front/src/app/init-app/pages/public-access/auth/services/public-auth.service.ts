// src/app/init-app/pages/public-access/auth/services/public-auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { decodeJwt, extractUserId } from '@shared/utils/jwt.util';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';

@Injectable({ providedIn: 'root' })
export class PublicAuthService {
	private baseUrl = `${environment.URL_API_TicketApi}/users`;

	constructor(private http: HttpClient, private router: Router, private pending: PendingPurchaseService) { }

	// Login del público
	login(documentTypeId: number, documentNumber: string, password: string): Observable<{ id?: number; accesToken: string; message?: string; status?: boolean }> {
		const body = { documentTypeId, documentNumber, password };
		return this.http.post<{ id?: number; accesToken: string; message?: string; status?: boolean }>(`${this.baseUrl}/event-login`, body);
	}

	// Registro del público
	register(payload: any): Observable<any> {
		return this.http.post(`${this.baseUrl}/event-signup`, payload);
	}

	// Cerrar sesión del invitado
	logout(): void {
		try {
			localStorage.removeItem('guestToken');
			localStorage.removeItem('guestUserId');
			// localStorage.removeItem('guestUser'); //para guardar el perfil próximamente
		} finally {
			// Redirigir al Home del backoffice
			this.router.navigate(['/home']);
		}
	}

	// Indica si hay un token de invitado activo.
	isGuestLoggedIn(): boolean {
		return !!localStorage.getItem('guestToken');
	}

	// Guarda el ID del invitado (res.id) para uso global.
	setGuestUserId(id: number | string | null): void {
		if (id == null) return;
		localStorage.setItem('guestUserId', String(id));
	}

	getPartnerId(): number | null {
		const storedSoc = localStorage.getItem('user_info')
		const { id } = JSON.parse(storedSoc)
		if (storedSoc != null && storedSoc !== '') {
			const n = Number(id);
			return Number.isNaN(n) ? id : n;
		}
		return null
	}

	// Devuelve el ID del invitado; prioriza 'guestUserId', luego pending.user.id y al final decodifica el JWT.
	getGuestId(): number | string | null {
		// 1) Preferir el ID persistido explícitamente (res.id)
		const stored = localStorage.getItem('guestUserId');
		if (stored != null && stored !== '') {
			const n = Number(stored);
			return Number.isNaN(n) ? stored : n;
		}

		// 2) Usar el ID guardado en la compra pendiente si existe
		try {
			const pending = this.pending.get<any>();
			const pendingId = pending?.user?.id;
			if (pendingId != null) {
				const n2 = Number(pendingId);
				return Number.isNaN(n2) ? pendingId : n2;
			}
		} catch { /* ignore */ }

		// 3) Fallback: decodificar el JWT (puede devolver DNI si así viene en el token)
		const token = localStorage.getItem('guestToken');
		if (!token) return null;
		try {
			const payload = decodeJwt(token);
			return extractUserId(payload);
		} catch {
			return null;
		}
	}

	getGuestIdAmbassador(): number | null {
		const userInfoString = localStorage.getItem('user_info') || this.getCookie('user_info');
		if (!userInfoString) {
			return null;
		}

		try {
			const userInfo = JSON.parse(userInfoString);
			return userInfo?.id ?? null;
		} catch (e) {
			console.error('Error parseando user_info', e);
			return null;
		}
	}

	private getCookie(name: string): string | null {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
		return null;
	}

}
