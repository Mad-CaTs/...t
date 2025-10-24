import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from 'src/app/authentication/commons/services/services-auth/auth.service';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';
import { decodeJwt, extractUserId } from '@shared/utils/jwt.util';
import { switchMap, catchError, of } from 'rxjs';

@Component({
	selector: 'app-login-nuevo',
	standalone: true,
	imports: [CommonModule, FormsModule,RouterModule],
	templateUrl: './login-nuevo.html',
	styleUrl: './login.component.scss'
})
export default class LoginNuevoComponent {
	username: string = '';
	password: string = '';
	loginError: boolean = false;
	usernameError: boolean = false;
	passwordError: boolean = false;
	showPassword: boolean = false;
	loading: boolean = false;
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService,
		private cookieService: CookieService,
		private pending: PendingPurchaseService
	) {}

		onSubmit() {
		if (!this.username || !this.password) {
			this.usernameError = !this.username;
			this.passwordError = !this.password;
			return;
		}

		this.loading = true;
		this.authService.login(this.username, this.password)
			.pipe(
				switchMap(response => {
					if (response.result && response.data) {
						this.cookieService.set('authData', JSON.stringify(response.data), 1);
					}
					const accessToken = response?.data?.access_token;
					const username = response?.data?.username;
					// Obtener datos de usuario directo (endpoint single user)
					if (username) {
						return this.authService.getUser(username).pipe(
							catchError(err => {
								//console.warn('[UserEndpoint] fallo, uso fallback JWT', err);
								let fallbackId: any = null;
								if (accessToken) {
									const payload = decodeJwt(accessToken);
									fallbackId = extractUserId(payload);
								}
								return of({ data: { id: fallbackId } });
							})
						);
					}
					// Sin username: devolver estructura vacía
					return of({ data: { id: null } });
				})
			)
			.subscribe({
				next: (userResp: any) => {
					this.loading = false;
					const resolvedId = userResp?.data?.id ?? null;
					try {
						const pending = this.pending.get<any>();
						if (pending) {
							this.pending.set({ ...pending, user: { type: 'member', id: resolvedId } });
							const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/checkout';
							this.router.navigate([returnUrl], { state: { resumePendingPurchase: true } });
							return;
						}
					} catch {}
					this.router.navigate(['/authentication/login']);
				},
				error: (error) => {
					console.error('❌ Error en el login:', error);
					this.loading = false;
					if (error?.error?.errorCode === 'CREDENTIALS_ERROR') {
						this.loginError = true;
					} else {
						console.warn('Otro error ocurrió:', error);
					}
				}
			});
	}

	togglePasswordVisibility() {
		this.showPassword = !this.showPassword;
		const input = document.getElementById('input-password') as HTMLInputElement;
		input.type = this.showPassword ? 'text' : 'password';
	}

		goLoginSelection() {
			this.router.navigate(['/home']);
	}

	clearErrors() {
		this.loginError = false;
		this.usernameError = false;
		this.passwordError = false;
	}
}
