import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {
	catchError,
	delay,
	map,
	Observable,
	of,
	retry,
	retryWhen,
	Subject,
	switchMap,
	take,
	takeUntil,
	tap,
	throwError
} from 'rxjs';
import { environment } from '@environments/environment';
import { Buffer } from 'buffer';
import {
	IAuthentication,
	ListResponse,
	UserResponse
} from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { CookieService } from 'ngx-cookie-service';
import { Profile } from 'src/app/authentication/commons/enums';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { SharedDataService } from '../sharedData/shared-data.service';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationService implements OnDestroy {
	private destroy$: Subject<void> = new Subject<void>();
	private apiUrl = environment.URL_GATEWEY;

	constructor(
		private http: HttpClient,
		private cookieService: CookieService,
		private dashboardService: DashboardService,
		private router: Router,
		private sharedDataService: SharedDataService
	) {}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	private setUserInfo(users: UserResponse[], username: string): void {
		try {
			// Store all users, this will be used for multi-account support
			localStorage.setItem('user_all_info', JSON.stringify(users));

			// Store individual user info (existing functionality)
			if (username && users.length > 0) {
				const userData = users.find((user) => user.username === username);
				if (userData) {
					this.setUserDataByUsername(username);
				}
			}
		} catch (error) {
			console.error('Error storing user info:', error);
		}
	}

	public setUserDataByUsername(username: string): void {
		localStorage.removeItem('user_info');
		const storedUsers: UserResponse[] = JSON.parse(localStorage.getItem('user_all_info') || '[]');
		const foundUser = storedUsers.find((user) => user.username === username);
		if (foundUser) {
			localStorage.setItem('user_info', JSON.stringify(foundUser));
			this.pointKafka(foundUser.id).subscribe({
				next: (response) => console.log('Points sent to Kafka successfully:', response),
				error: (error) => console.error('Error sending points to Kafka:', error)
			});
			
		} else {
			console.warn(`No user found with username: ${username}`);
		}
	}

	public getAllUserInfo(username: string): Observable<UserResponse[]> {
		return this.http
			.get<ListResponse<UserResponse[]>>(`${this.apiUrl}/account/user/multi-account/${username}`)
			.pipe(
				map((response) => {
					const data = Array.isArray(response.data) ? response.data : [response.data];
					return data.flat() as UserResponse[];
				}),
				retryWhen((errors) =>
					errors.pipe(
						tap((error) => {
							if (error.message === 'Invalid JSON response') {
								console.warn('Retrying due to invalid JSON response');
							} else {
								throw error;
							}
						}),
						delay(1000),
						take(4)
					)
				),
				catchError((error: HttpErrorResponse) => {
					if (error.status === 404) {
						console.error('User not found (404):', error.message);
						return throwError('User not found (404)');
					} else if (
						error.status === 200 &&
						typeof error.error === 'string' &&
						error.error.includes('<div')
					) {
						const errorMessage = 'User service is unavailable!';
						console.error(errorMessage);
						return throwError(errorMessage);
					} else {
						return this.handleHttpError(error);
					}
				})
			);
	}

	public getUserInfo(userName: string): Observable<any> {
		return this.http.get(`${this.apiUrl}/account/user/${userName}`, { responseType: 'text' }).pipe(
			map((response) => {
				try {
					const parsedResponse = JSON.parse(response);
					return parsedResponse;
				} catch (e) {
					console.error('Invalid JSON response:', response);
					throw new Error('Invalid JSON response');
				}
			}),
			retryWhen((errors) =>
				errors.pipe(
					tap((error) => {
						if (error.message === 'Invalid JSON response') {
							console.warn('Retrying due to invalid JSON response');
						} else {
							throw error;
						}
					}),
					delay(1000),
					take(4)
				)
			),
			catchError((error: HttpErrorResponse) => {
				if (error.status === 404) {
					console.error('User not found (404):', error.message);
					return throwError('User not found (404)');
				} else if (
					error.status === 200 &&
					typeof error.error === 'string' &&
					error.error.includes('<div')
				) {
					const errorMessage = 'User service is unavailable!';
					console.error(errorMessage);
					return throwError(errorMessage);
				} else {
					return this.handleHttpError(error);
				}
			})
		);
	}

	private handleHttpError(error: HttpErrorResponse) {
		let errorMessage = 'Unknown error!';
		if (error.error instanceof ErrorEvent) {
			errorMessage = `Error: ${error.error.message}`;
		} else {
			if (error.status === 404) {
				console.error('User not found (404):', error.message);
				return throwError('User not found (404)');
			} else if (
				error.status === 200 &&
				typeof error.error === 'string' &&
				error.error.includes('<div')
			) {
				errorMessage = 'User service is unavailable!';
			} else {
				errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
			}
		}
		console.log(errorMessage);
		return throwError(errorMessage);
	}

	public redirectByProfile(data: IAuthentication) {
		this.sharedDataService.setFromLogin(true);
		switch (data.username) {
			case Profile.PARTNER:
				this.router.navigate(['/profile/partner']);
				break;
			case Profile.USER:
				this.router.navigate(['/profile/user']);
				break;
			case Profile.PROMOTOR:
				this.router.navigate(['/profile/promotor']);
				break;
			default:
				this.router.navigate(['/profile/partner']);
				break;
		}
	}

	public authenticate(): Observable<any> {
		const authData = this.cookieService.get('authData');

		if (!authData) {
			return of(null);
		}

		const data = JSON.parse(authData);

		const authDataFormatted: IAuthentication = {
			access_token: data.access_token,
			accessTokenExpireAt: '',
			authorities: data.roles || [],
			roles: data.roles ? data.roles.join(',') : '',
			refreshToken: '',
			username: data.username || '',
			userInfo: undefined
		};

		console.log('dataautenticate', authDataFormatted);

		return this.processAuthenticationData(authDataFormatted);
	}

	private processAuthenticationData(authentication: IAuthentication): Observable<any> {
		if (authentication?.username) {
			return this.getAllUserInfo(authentication.username).pipe(
				switchMap((userData) => {
					if (userData) {
						this.setUserInfo(userData, authentication.username);
						this.redirectByProfile(authentication);
						return of(null);
					} else {
						this.redirectByProfile(authentication);
						return of(null);
					}
				}),
				catchError((error) => {
					console.error('Error in processing user data:', error);
					this.redirectByProfile(authentication);
					return of(null);
				})
			);
		} else {
			this.redirectByProfile(authentication);
			return of(null);
		}
	}

	public getUser(): void {
		const user: UserResponse = JSON.parse(localStorage.getItem('user_info'));
		this.getAllUserInfo(user.username).pipe(
			switchMap((userData) => {
				if (userData && userData.length > 0) {
					this.setUserInfo(userData, user.username);
					return of(null);
				}
				return of();
			})
		).subscribe({
			next: (result) => {
				if (result) {
					console.log('User information processed successfully');
				} else {
					console.log('No user data available');
				}
			},
			error: (error) => console.error('Error getting user info:', error)
		});
	}

	private pointKafka(userInfo: any): Observable<any> {
		if (userInfo) {
			const body = {
				id: userInfo,
				tipo: 'R'
			};
			return this.dashboardService.postPointsKafka(body).pipe(
				tap((response) => {
					console.log('Points sent to Kafka successfully:', response);
				}),
				catchError((error) => {
					console.error('Error sending points to Kafka:', error);
					return throwError(error);
				})
			);
		} else {
			console.error('User info is not available for Kafka');
			return throwError('User info is missing');
		}
	}

	refreshToken(refreshToken: string): Observable<any> {
		const body = new URLSearchParams();
		body.set('grant_type', 'refresh_token');
		body.set('refresh_token', refreshToken);

		let headers = new HttpHeaders();
		headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
		headers = headers.set(
			'Authorization',
			'Basic ' + Buffer.from(environment.CLIENT_ID + ':' + environment.CLIENT_SECRET).toString('base64')
		);

		return this.http.post<any>(environment.URL_AUTH_SERVER + '/oauth2/token', body.toString(), {
			headers
		});
	}
}
