import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';
import { AuthApiService } from '@app/core/services/api';
import { deleteCookie, setCokkie, getCokkie } from '@utils/cokkies';
import { ILoginResponse } from '@interfaces/api';
import { ToastService } from '@app/core/services/toast.service';

export type UserType = UserModel | undefined;

@Injectable({
	providedIn: 'root'
})
export class AuthService implements OnDestroy {
	// private fields
	private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
	private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
	private username = 'USERNAME';
	private temporalKey = 'B8w3Rf7fG9!kLjO6xZQ2#yV4cI1@TpD$';

	// public fields
	currentUser$: Observable<UserType>;
	isLoading$: Observable<boolean>;
	currentUserSubject: BehaviorSubject<UserType>;
	isLoadingSubject: BehaviorSubject<boolean>;

	get currentUserValue(): UserType {
		return this.currentUserSubject.value;
	}

	set currentUserValue(user: UserType) {
		this.currentUserSubject.next(user);
	}

	constructor(
		private authHttpService: AuthHTTPService,
		private router: Router,
		private authApiService: AuthApiService,
		private toastService: ToastService
	) {
		this.isLoadingSubject = new BehaviorSubject<boolean>(false);
		this.currentUserSubject = new BehaviorSubject<UserType>(undefined);
		this.currentUser$ = this.currentUserSubject.asObservable();
		this.isLoading$ = this.isLoadingSubject.asObservable();
		const subscr = this.getUserByToken().subscribe();
		this.unsubscribe.push(subscr);
	}

	login(email: string, password: string): Observable<ILoginResponse | undefined> {
		this.isLoadingSubject.next(true);

		return this.authApiService.fetchLogin({ username: email, password }).pipe(
			map((res) => {
				const { token, expiration, authorities } = res;

				setCokkie('TOKEN', token, expiration);
				setCokkie('USERNAME', email);
				this.storeAllowedUrlsInSessionStorage(authorities);

				return res;
			}),
			catchError((err) => {
				this.toastService.addToast('Error al logear usuario', 'error');
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	storeAllowedUrlsInSessionStorage(authorities: any[]): void {
		const allowedUrls = authorities.map((auth: any) => auth.url);

		if (allowedUrls && allowedUrls.length > 0) {
			sessionStorage.setItem('ALLOWED_URLS', JSON.stringify(allowedUrls));
		} else {
			console.warn('No se encontraron URLs permitidas');
		}
	}

	getAllowedUrlsFromSessionStorage(): string[] {
		const storedUrls = sessionStorage.getItem('ALLOWED_URLS');

		return storedUrls ? JSON.parse(storedUrls) : [];
	}

	canAccessUrl(requestedUrl: string): boolean {
		const allowedUrls = this.getAllowedUrlsFromSessionStorage();
		console.log('allowedUrlskeyla', allowedUrls);

		// Asegúrate de que 'allowedUrls' no esté vacío
		if (allowedUrls.length === 0) {
			console.warn('No se han encontrado URLs permitidas');
			return false;
		}

		if (allowedUrls.includes(requestedUrl)) {
			return true;
		}

		return allowedUrls.some((allowedUrl) => {
			const regex = new RegExp(`^${allowedUrl.replace(/\*/g, '.*')}$`);
			return regex.test(requestedUrl);
		});
	}

	public logout() {
		deleteCookie('TOKEN');
		deleteCookie('USERNAME');
		this.router.navigate(['/auth/login'], {
			queryParams: {}
		});
	}

	getUserByToken(): Observable<UserType> {
		const auth = this.getAuthFromLocalStorage();
		if (!auth || !auth.authToken) {
			return of(undefined);
		}

		this.isLoadingSubject.next(true);
		return this.authHttpService.getUserByToken(auth.authToken).pipe(
			map((user: UserType) => {
				if (user) {
					this.currentUserSubject.next(user);
				} else {
					this.logout();
				}
				return user;
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	getCookie(name: string) {
		const cookies = document.cookie.split('; ');
		const cookie = cookies.find(c => c.startsWith(name + '='));
		return cookie ? cookie.split('=')[1] : null;
	}

	getUsernameOfCurrentUser(): string | undefined {
		try {
			const lsValue = this.getCookie(this.username);
			if (!lsValue) {
				return undefined;
			}
			return lsValue;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	// need create new user then login
	registration(user: UserModel): Observable<any> {
		this.isLoadingSubject.next(true);
		return this.authHttpService.createUser(user).pipe(
			map(() => {
				this.isLoadingSubject.next(false);
			}),
			switchMap(() => this.login(user.email, user.password)),
			catchError((err) => {
				console.error('err', err);
				return of(undefined);
			}),
			finalize(() => this.isLoadingSubject.next(false))
		);
	}

	forgotPassword(email: string): Observable<boolean> {
		this.isLoadingSubject.next(true);
		return this.authHttpService
			.forgotPassword(email)
			.pipe(finalize(() => this.isLoadingSubject.next(false)));
	}

	// private methods
	private setAuthFromLocalStorage(auth: AuthModel): boolean {
		// store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
		if (auth && auth.authToken) {
			localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
			return true;
		}
		return false;
	}

	private getAuthFromLocalStorage(): AuthModel | undefined {
		try {
			const lsValue = localStorage.getItem(this.authLocalStorageToken);
			if (!lsValue) {
				return undefined;
			}

			const authData = JSON.parse(lsValue);
			return authData;
		} catch (error) {
			console.error(error);
			return undefined;
		}
	}

	ngOnDestroy() {
		this.unsubscribe.forEach((sb) => sb.unsubscribe());
	}

	getAuthTokenFromCookie(): string | null {
		return getCokkie('TOKEN');
	}

	isTokenValid(): boolean {
		const token = this.getAuthTokenFromCookie();
		if (token) {
			const decodedToken = this.decodeToken(token);
			const currentTime = Math.floor(Date.now() / 1000);
			return decodedToken.exp > currentTime;
		}
		return false;
	}

	private decodeToken(token: string): any {
		try {
			const payload = token.split('.')[1];
			return JSON.parse(atob(payload));
		} catch (error) {
			return null;
		}
	}

	encryptData(data: string): string {
		return CryptoJS.AES.encrypt(data, this.temporalKey).toString();
	}

	decryptData(data: string): string {
		const bytes = CryptoJS.AES.decrypt(data, this.temporalKey);
		return bytes.toString(CryptoJS.enc.Utf8);
	}
}
