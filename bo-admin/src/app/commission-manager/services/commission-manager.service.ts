import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {
	ICreateMembershipBonusRangeRequest,
	ICreateMembershipBonusRequest,
	ICreateMembershipBonusResponse,
	IPercentCommissionAffiliationResponse,
	IPeriodRangeDatesResponse,
	IUpdateMembershipBonusRequest,
	IUpdateMembershipBonusResponse,
	IUpdateMembershipRangeBonusRequest,
	IUpdateMembershipRangeBonusResponse,
	IValidatePeriodResponse,
	IWalletTransactionType,
	IWalletTransactionTypeResponse
} from '@interfaces/wallet-transaction-type.interface';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ISelectOpt } from '@interfaces/form-control.interface';
import {
	ILevelCommissionPanelAdmin,
	ILevelCommissionPanelAdminResponse,
	IListMembershipByIdUserRequest,
	IListMembershipByIdUserResponse,
	IPayOneUserBonusResponse
} from '@interfaces/commissions.interface';

@Injectable({
	providedIn: 'root'
})
export class CommissionManagerService {
	private readonly APIWALLET = environment.apiWallet;
	private readonly APICOMMISSION = environment.apiCommission;
	private readonly APIADMIN = environment.api;
	private readonly APITREE = environment.apiTree;
	private apiUrlWallet = `${this.APIWALLET}/api/v1`;
	private apiUrlCommission = `${this.APICOMMISSION}/api/v1`;
	private apiUrlAdmin = `${this.APIADMIN}/api`;
	private apiUrlTree = `${this.APITREE}/api/v1`;

	constructor(private http: HttpClient) {}

	getWalletTransactionTypes(): Observable<IWalletTransactionType[]> {
		return this.http
			.get<IWalletTransactionTypeResponse>(
				`${this.apiUrlWallet}/wallettransaction/list/type-wallet-transaction`
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener tipos de bonos');
					}
					return response.data;
				})
			);
	}

	// Combo de Tipo de Comisiones
	getWalletTransactionTypesAsOptions(): Observable<ISelectOpt[]> {
		return this.getWalletTransactionTypes().pipe(
			map((types) =>
				types.map((type) => ({
					id: type.idTypeWalletTransaction.toString(),
					text: type.description
				}))
			)
		);
	}

	// Listado de Comisiones por Tipo de Comisiones
	getListBonusByTypeBonus(typeBonusIds: number[], idUser: number, size: number): Observable<any> {
		const typeBonusParams = typeBonusIds.map((id) => `typeBonusIds=${id}`).join('&');

		return this.http
			.get<any>(
				`${this.apiUrlCommission}/commissions/list/bonus?${typeBonusParams}&size=${size}&idUser=${idUser}`
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener el listado por bonos por tipo');
					}
					return response.data;
				})
			);
	}

	// Listado de Bono de Logro de rango
	getListRankBonus(idUser: number, periodIds: number[] | string): Observable<any> {
		let periodIdsParam: string;

		if (Array.isArray(periodIds)) {
			periodIdsParam = periodIds.join(',');
		} else {
			periodIdsParam = periodIds;
		}

		const params = new HttpParams().set('idUser', idUser.toString()).set('periodIds', periodIdsParam);

		return this.http
			.get<any>(`${this.apiUrlCommission}/commissions/list/bono-logro-rango`, { params })
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener el listado de bonos de logro de rango');
					}
					return response.data;
				}),
				catchError((error) => {
					console.error('Error en getListRankBonus:', error);
					return throwError(() => new Error('Error al obtener los bonos'));
				})
			);
	}

	// Obtener membresías por ID de usuario
	getMembershipsByUserId(idUser: number): Observable<IListMembershipByIdUserRequest[]> {
		return this.http
			.get<IListMembershipByIdUserResponse>(
				`${this.apiUrlCommission}/commissions/list/membership-type-bonus/${idUser}`
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener las membresías');
					}
					return response.data;
				}),
				catchError((error) => {
					console.error('Error en getMembershipsByUserId:', error);
					return throwError(() => new Error('Error al obtener las membresías'));
				})
			);
	}

	// Combo de membresías
	getMembershipAsOptions(idUser: number): Observable<ISelectOpt[]> {
		return this.getMembershipsByUserId(idUser).pipe(
			map((types) =>
				types.map((type) => ({
					id: type.idSuscription.toString(),
					text: type.nameSuscription
				}))
			)
		);
	}

	// Editor de Comisiones Tipo de Comisiones
	updateUserMembershipBonus(
		body: IUpdateMembershipBonusRequest
	): Observable<IUpdateMembershipBonusRequest> {
		return this.http
			.put<IUpdateMembershipBonusResponse>(
				`${this.apiUrlCommission}/commissions/update/userMembershipBonus`,
				body
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al actualizar');
					}
					return response.data;
				})
			);
	}

	// Editor de Comisiones de Bono de logro de rango
	updateUserMembershipBonusRank(
		body: IUpdateMembershipRangeBonusRequest
	): Observable<IUpdateMembershipRangeBonusRequest> {
		return this.http
			.put<IUpdateMembershipRangeBonusResponse>(
				`${this.apiUrlCommission}/commissions/update/userRangeBonus`,
				body
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al actualizar');
					}
					return response.data;
				})
			);
	}

	// Validador de Periodo
	getValidatePeriod(periodId: number): Observable<any> {
		return this.http
			.get<IValidatePeriodResponse>(
				`${this.apiUrlCommission}/commissions/validate-pay/period/${periodId}`
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener tipos de bonos');
					}
					return response.data;
				})
			);
	}

	// Porcentajes por tipo de Wallet
	getPercentCommissionAffiliation(typeId: number): Observable<any> {
		return this.http
			.get<IPercentCommissionAffiliationResponse>(
				`${this.apiUrlCommission}/commissions/list/commission-affiliation/${typeId}`
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener los porcentajes');
					}
					return response.data;
				})
			);
	}

	// Inserción de comisión de Tipo de Comisiones
	postUserMembershipBonus(body: ICreateMembershipBonusRequest): Observable<boolean> {
		return this.http
			.post<ICreateMembershipBonusResponse>(
				`${this.apiUrlCommission}/commissions/create/userMembershipBonus`,
				body
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al insertar');
					}
					return response.data;
				})
			);
	}

	// Inserción de comisión de Bono de logro de Rango
	postUserMembershipBonusRange(body: ICreateMembershipBonusRangeRequest): Observable<boolean> {
		return this.http
			.post<ICreateMembershipBonusResponse>(
				`${this.apiUrlCommission}/commissions/create/userRangeBonus`,
				body
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al insertar');
					}
					return response.data;
				})
			);
	}

	// Combo periodos
	getListPeriodsByDate(initialDate: string, endDate: string): Observable<any> {
		const params = new HttpParams().set('initialDate', initialDate).set('endDate', endDate);
		return this.http
			.get<IPeriodRangeDatesResponse>(`${this.apiUrlAdmin}/period/rangeBetweenDates`, {
				params: params
			})
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener los periodos');
					}
					return response.data;
				})
			);
	}

	// Obtener el Periodo Actual
	getPeriodDate(date: string): Observable<any> {
		return this.http
			.get<IPeriodRangeDatesResponse>(`${this.apiUrlAdmin}/period/rangeBetween/${date}`)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener los periodos');
					}
					return response.data;
				})
			);
	}

	// Obtener el Periodo Próximo a Pagar
	getLastPeriodToPay(date: string): Observable<any> {
		return this.http
			.get<IPeriodRangeDatesResponse>(`${this.apiUrlAdmin}/period/rangeBetweenInitialAndPayDates/${date}`)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener los periodos');
					}
					return response.data;
				})
			);
	}

	// Listado de Histórico
	getHistoryBonus(
		periodIds: number[] = [],
		page = 0,
		size = 15
	): Observable<{ data: any[]; page: number; size: number; total: number }> {
		const params = new HttpParams({
			fromObject: {
				periodIds: periodIds.join(','),
				page: page.toString(),
				size: size.toString()
			}
		});

		return this.http.get<any>(`${this.apiUrlCommission}/commissions/list/history-bonus`, { params }).pipe(
			map((res) => {
				if (!res.result) {
					throw new Error('Error al obtener histórico');
				}

				return {
					data: res.data,
					page: res.page,
					size: res.size,
					total: res.total
				};
			}),
			catchError((err) => {
				console.error('Error en getHistoryBonus', err);
				return throwError(() => err);
			})
		);
	}

	// Generador de comisiones para Tipo de Comisiones
	getLevelsAndCommissionsPanelAdmin(
		idSocio: number,
		idSuscription: number,
		typeCommission: number,
		typeBonusIds: number[],
		createDateSuscription: string,
		flagPanelAdmin: boolean = true
	): Observable<ILevelCommissionPanelAdmin[]> {
		const params = new HttpParams()
			.set('idSocio', idSocio.toString())
			.set('idSuscription', idSuscription.toString())
			.set('typeCommission', typeCommission.toString())
			.set('typeBonusIds', typeBonusIds.join(','))
			.set('createDateSuscription', createDateSuscription)
			.set('flagPanelAdmin', flagPanelAdmin.toString());
		return this.http
			.get<ILevelCommissionPanelAdminResponse>(
				`${this.apiUrlTree}/three/getLevelsAndCommissionsPanelAdmin`,
				{ params }
			)
			.pipe(
				map((response) => {
					if (!response.result) {
						throw new Error('Error al obtener niveles y comisiones');
					}
					return response.data;
				}),
				catchError((error) => {
					console.error('Error en getLevelsAndCommissionsPanelAdmin:', error);
					return throwError(() => new Error('Error al obtener niveles y comisiones'));
				})
			);
	}

	// Generador de comisiones para Bono de logro de rango
	postBonusRange(idPeriod: number, idUser: number): Observable<{ success: boolean; message: string }> {
		const body = { idPeriod, iduser: idUser };

		return this.http
			.post<IPayOneUserBonusResponse>(`${this.apiUrlCommission}/commissions/bonus/pay-one-user/`, body)
			.pipe(
				map((resp) => {
					if (!resp.result) {
						throw new Error('Error en el servidor al intentar pagar bono');
					}
					console.log('resp.data.success', resp.data.success);
					if (resp.data.success === false) {
						throw new Error(resp.data.message);
					}
					return resp.data;
				}),
				catchError((err) => {
					console.error('Error en postBonusRange:', err);
					return throwError(() => (err instanceof Error ? err : new Error(String(err))));
				})
			);
	}
}
