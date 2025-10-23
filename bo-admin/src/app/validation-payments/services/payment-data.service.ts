import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
	ITableExpiratedPayments,
	ITableInitialPayments,
	ITableMigrationPayments,
	ITablePendingPayments
} from '@interfaces/payment-validate.interface';
import { ICountry } from '@interfaces/users.interface';
import { UserService } from '@app/users/services/user.service';

@Injectable({
	providedIn: 'root'
})
export class SubscriptionService {
	private readonly API = environment.api;

	constructor(private http: HttpClient, private userService: UserService) { }

	public getSubscriptionData<
		T extends
		| ITableInitialPayments
		| ITableExpiratedPayments
		| ITableMigrationPayments
		| ITablePendingPayments
	>(
		subscriptionType: string,
		addNationality: boolean = false,
		addCellphone: boolean = false
	): Observable<T[]> {
		return this.userService.getAllCountries().pipe(
			switchMap((countries: ICountry[]) => {
				const url = `${this.API}/api/suscription/status/${subscriptionType}`;
				return this.http.get<any>(url).pipe(
					map((response) => {
						return this.processSubscriptionData<T>(
							response.data,
							countries,
							addNationality,
							addCellphone
						);
					}),
					catchError((error) => {
						console.error('Error fetching subscription data:', error);
						throw error;
					})
				);
			})
		);
	}

	private processSubscriptionData<
		T extends
		| ITableInitialPayments
		| ITableExpiratedPayments
		| ITableMigrationPayments
		| ITablePendingPayments
	>(data: any, countries: ICountry[], addNationality: boolean, addCellphone: boolean): T[] {
		return data.map((subscription: any, index: number) => {
			if (this.isExpiratedPayment(subscription)) {
				const expiratedData: ITableExpiratedPayments = {
					id: index + 1,
					idsuscription: subscription.idSuscription,
					ordenNumber: index + 1,
					fullname: `${subscription.userResponseDto.name || ''} ${subscription.userResponseDto.lastName || ''
						}`,
					description: subscription.description || 'Sin descripción',
					date: this.formatDate(subscription.lastPaymentDate) || 'No hay fecha',
					amount: subscription.amount || 0,
					iduser: subscription.idUser || 0,
					package: subscription.package
						? {
							idPackage: subscription.idSuscription,
							name: subscription.package.name
						}
						: undefined,

					packageOpt: subscription.package
						? [
							{
								id: subscription.idSuscription.toString(),
								text: subscription.package.name
							}
						]
						: [
							{
								id: '0',
								text: 'No Package'
							}
						]
				};
				return expiratedData as T;
			} else if (this.isMigrationPayment(subscription)) {
				const migrationPaymentData: ITableMigrationPayments = {
					id: index + 1,
					ordenNumber: index + 1,
					date: this.formatDate(subscription.lastPaymentDate) || 'No hay fecha',
					username: subscription.userResponseDto.userName || '-',
					fullname: `${subscription.userResponseDto.name || ''} ${subscription.userResponseDto.lastName || ''
						}`,
					dni: subscription.userResponseDto.nroDocument || '-',
					partner: `${subscription.userResponseDto.nameSponsor || '-'} ${subscription.userResponseDto.lastNameSponsor || ''
						}`,
					membership: subscription.package?.name || '-',
					couponCode: 'No hay cupón',
					daysGracePeriod: 0,
					verification: false,
					preState: false,
					idSuscription: subscription.idSuscription || 0,
					idUser: subscription.idUser || 0,
					paymentDate: this.formatDate(subscription.lastPaymentDate) || 'No hay fecha',
					package: subscription.package?.name || 'No Package'
				};
				return migrationPaymentData as T;
			} else if (this.isPendingPayment(subscription)) {
				const pendingPaymentData: ITablePendingPayments = {
					id: index + 1,
					ordenNumber: index + 1,
					date: this.formatDate(subscription.lastPaymentDate) || 'No hay fecha',
					username: subscription.userResponseDto.userName || '-',
					fullname: `${subscription.userResponseDto.name || ''} ${subscription.userResponseDto.lastName || ''
						}`,
					dni: subscription.userResponseDto.nroDocument || '-',
					partner: `${subscription.userResponseDto.nameSponsor || '-'} ${subscription.userResponseDto.lastNameSponsor || ''
						}`,
					membership: subscription.package?.name || '-',
					couponCode: 'No hay cupón',
					daysGracePeriod: 0,
					verification: false,
					preState: false,
					idSuscription: subscription.idSuscription || 0,
					idUser: subscription.idUser || 0,
					nationality:
						countries.find(
							(country) => country.idCountry === subscription.userResponseDto.idNationality
						)?.countrydesc || 'Unknown',
					phone: subscription.userResponseDto.nroPhone || '-'
				};
				return pendingPaymentData as T;
			} else if (this.isQuotePayment(subscription)) {
				const quotePaymentData: ITableInitialPayments = {
					id: index + 1,
					ordenNumber: index + 1,
					date: this.formatDate(subscription.lastPaymentDate) || 'No hay fecha',
					username: subscription.userResponseDto.userName || '-',
					fullname: `${subscription.userResponseDto.name || ''} ${subscription.userResponseDto.lastName || ''
						}`,
					dni: subscription.userResponseDto.nroDocument || '-',
					partner: `${subscription.userResponseDto.nameSponsor || '-'} ${subscription.userResponseDto.lastNameSponsor || ''
						}`,
					membership: subscription.package?.name || '-',
					couponCode: 'No hay cupón',
					daysGracePeriod: 0,
					verification: false,
					preState: false,
					idSuscription: subscription.idSuscription || 0,
					idUser: subscription.idUser || 0
				};
				return quotePaymentData as T;
			} else if (this.isInitialPayment(subscription)) {
				const initialPaymentData: ITableInitialPayments = {
					id: index + 1,
					ordenNumber: index + 1,
					date: this.formatDate(subscription.lastPaymentDate) || 'No hay fecha',
					username: subscription.userResponseDto.userName || '-',
					fullname: `${subscription.userResponseDto.name || ''} ${subscription.userResponseDto.lastName || ''
						}`,
					dni: subscription.userResponseDto.nroDocument || '-',
					partner: `${subscription.userResponseDto.nameSponsor || '-'} ${subscription.userResponseDto.lastNameSponsor || ''
						}`,
					membership: subscription.package?.name || '-',
					couponCode: 'No hay cupón',
					daysGracePeriod: 0,
					verification: false,
					preState: false,
					idSuscription: subscription.idSuscription || 0,
					idUser: subscription.idUser || 0
				};
				return initialPaymentData as T;
			}

			console.error('Subscription data does not match expected types');
			return {} as T;
		});
	}

	private isExpiratedPayment(subscription: any): boolean {
		return (
			subscription.status === 5 ||
			subscription.status === 6 ||
			subscription.status === 7 ||
			subscription.status === 8 ||
			subscription.status === 9
		);
	}

	private isInitialPayment(subscription: any): boolean {
		return subscription.status === 2;
	}

	private isPendingPayment(subscription: any): boolean {
		return subscription.status === 4;
	}

	private isQuotePayment(subscription: any): boolean {
		return subscription.status === 10 || subscription.status === 16;
	}

	private isMigrationPayment(subscription: any): boolean {
		return subscription.status === 13;
	}

	getUnpaidPaymentBySubscription(idSuscription: number): Observable<any> {
		const url = `${this.API}/api/payment/unpaidBySuscription/${idSuscription}`;
		return this.http.get<any>(url).pipe(
			map((response) => {
				if (response && response.data) {
					return this.processUnpaidPayment(response.data);
				}
				console.error('No unpaid payment data found');
				return null;
			}),
			catchError((error) => {
				console.error('Error fetching unpaid payment data:', error);
				throw error;
			})
		);
	}

	private processUnpaidPayment(data: any): any {
		return {
			idPayment: data.idPayment,
			idSuscription: data.idSuscription,
			quoteDescription: data.quoteDescription || 'Sin descripción',
			nextExpiration: this.formatDate(data.nextExpiration),
			dollarExchange: data.dollarExchange || 0,
			quotaUsd: data.quotaUsd || 0,
			percentage: data.percentage || 0,
			statePaymentId: data.statePaymentId,
			payDate: this.formatDate(data.payDate),
			pts: data.pts || 0,
			isQuoteInitial: data.isQuoteInitial || 0,
			positionOnSchedule: data.positionOnSchedule || 0,
			numberQuotePay: data.numberQuotePay || 0,
			amortizationUsd: data.amortizationUsd || 0,
			capitalBalanceUsd: data.capitalBalanceUsd || 0,
			totalOverdue: data.totalOverdue || 0,
			percentOverdueDetailId: data.percentOverdueDetailId || 0,
			paymentVouchers: data.paymentVouchers || []
		};
	}

	private formatDate(dateArray: number[]): string {
		if (!Array.isArray(dateArray) || dateArray.length < 3) {
			return 'No hay fecha';
		}

		const [year, month, day, hour = 0, min = 0, seg = 0] = dateArray;

		const padNumber = (value: number): string => value.toString().padStart(2, '0');

		const formattedSeg = padNumber(seg);
		const formattedHour = padNumber(hour);
		const formattedMin = padNumber(min);
		const formattedDay = padNumber(day);
		const formattedMonth = padNumber(month);

		return `${formattedDay}/${formattedMonth}/${year} ${formattedHour}:${formattedMin}:${formattedSeg}`;
	}
}
