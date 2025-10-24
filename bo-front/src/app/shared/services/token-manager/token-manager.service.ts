import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class TokenManagerService {
	constructor(private router: Router) { }

	public goHome() {
		this.router.navigate(['/backoffice/home']);
	}

	generateTokenBase64(id: string, expiryMinutes: number): string {
		const payload = {
			id: id,
			exp: Date.now() + expiryMinutes * 60 * 1000,
		};
		const token = btoa(JSON.stringify(payload));
		return token;
	}

	validateTokenBase64(token: string): boolean {
		try {
			if (!this.isBase64(token)) {
				console.error('Invalid Base64 token');
				return false;
			}
			const paddedToken = this.padBase64(token);
			const decodedString = atob(paddedToken);
			const decoded = JSON.parse(decodedString);
			if (typeof decoded !== 'object' || !decoded.exp || !decoded.id) {
				console.error('Invalid token structure');
				return false;
			}
			const currentTimeInSeconds = Math.floor(Date.now() / 1000);
			if (decoded.exp <= currentTimeInSeconds) {
				console.error('Token has expired');
				return false;
			}
			return true;
		} catch (e) {
			console.error('Invalid token:', e);
			return false;
		}
	}

	private isBase64(str: string): boolean {
		const base64Regex = /^[A-Za-z0-9+/=]*$/;
		return base64Regex.test(str) && str.length % 4 === 0;
	}

	private padBase64(base64: string): string {
		while (base64.length % 4 !== 0) {
			base64 += '=';
		}
		return base64;
	}

	decodeTokenBase64(token: string): any {
		try {
			return JSON.parse(atob(token));
		} catch (e) {
			console.error('Invalid token:', e);
			return null;
		}
	}
}
