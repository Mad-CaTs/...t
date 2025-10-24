import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalPartnerPaymentService {
  private url = environment.URL_ADMIN; 
  private membershipUrl = 'https://membershipapi-dev.inclub.world'; 

  constructor(private http: HttpClient) {}
  searchCouponByCode(couponCode: string): Observable<any> {
    return this.http
      .get<any>(`${this.membershipUrl}/api/v1/coupons/search/${couponCode}`)
      .pipe(
        tap(res => console.log('📦 Respuesta de búsqueda de cupón:', res)),
        map(res => {
          if (res?.state && res?.data) {
            const coupon = res.data;
            return {
              found: true,
              idCoupon: coupon.idCoupon,
              discountPercentage: coupon.discountPercentage,
              couponCode: coupon.code,
              state: coupon.state, 
              dateStart: coupon.dateStart,
              dateEnd: coupon.dateEnd,
              isPartner: coupon.isPartner,
              idUser: coupon.idUser,
              idSalary: coupon.idSalary,
              idSubscription: coupon.idSubscription,
              idBusiness: coupon.idBusiness,
              message: res.message,
              raw: res
            };
          }
          return {
            found: false,
            message: res?.message || 'Cupón no encontrado',
            raw: res
          };
        })
      );
  }

  validateCoupon(payload: {
    couponCode: string;
    packageId: number;
    companyId: number;
    salary: number;
  }): Observable<{ discountPercent: number; raw: any }> {

    const params = new HttpParams({ fromObject: payload });

    return this.http
      .get<any>(`${this.url}/coupons`, { params })
      .pipe(
        map(res => ({
          discountPercent: res?.data?.discountPercent ?? 0,
          raw            : res
        }))
      );
  }

  applyDiscount(body: { idSubscription: number; discountPercent: number }): Observable<any> {
    return this.http.post(
      `${this.membershipUrl}/api/v1/store/apply-discount`,
      body
    );
  }

getPaymenttype(): Observable<any> {
    return this.http.get<any>(`${this.url}/paymenttype/`).pipe(
      map((response) => response.data),
      map((types) => types.sort((a, b) => a.idPaymentType - b.idPaymentType)),
      map((types) => {
        return types.map((type) => {
          type.paymentSubTypeList.forEach((sub) => {
            sub.content = sub.description;
            sub.value = sub.idPaymentSubType;
          });
          return type;
        });
      })
    );
  }

  getBankAccountsForPaymentType(paymentTypeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.url}/bankaccount/paymentType/${paymentTypeId}`).pipe(
      map((response: any) => {
        return response.data;
      })
    );
  }

 

  getFractioninitialQuota(): Observable<any[]> {
		return this.http.get<any>(`${this.url}/paymentoption/`).pipe(
			map((response: any) => {
				return response.data.map((paymentOption: any) => {
					return { value: paymentOption.idPaymentOption, content: paymentOption.description };
				});
			})
		);
	}
}
