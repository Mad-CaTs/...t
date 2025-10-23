
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Coupon } from '../models/coupon.model';
import { CouponRequest } from '@interfaces/coupon.interface';

@Injectable({ providedIn: 'root' })
export class CouponApiService {
  private readonly base = 'https://adminpanelapi-dev.inclub.world/api/coupons';
  // private readonly base = 'http://localhost:8081/api/coupons'; // 

  constructor(private http: HttpClient) {}

  private auth() {
    const token = localStorage.getItem('token') ?? '';
    return {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    };
  }

 
  all(): Observable<Coupon[]> {
    return this.http.get<any[]>(this.base, this.auth()).pipe(
      map(apiCoupons => {
        if (!Array.isArray(apiCoupons)) {
          console.error("La respuesta del API no es un array:", apiCoupons);
          return [];
        }
        return apiCoupons.map(apiCoupon => ({
          id: apiCoupon.idcoupon,
          name: apiCoupon.name,
          percent: apiCoupon.percent,
          salaryMin: apiCoupon.salarymin,
          salaryMax: apiCoupon.salarymax,
          companyId: apiCoupon.companyid,
          companyname: apiCoupon.companyname,
          startDate: apiCoupon.startdate.join('-'),
          endDate: apiCoupon.enddate.join('-'),
          state: apiCoupon.state
        } as Coupon));
      })
    );
  }

  create(c: CouponRequest): Observable<CouponRequest> {
    return this.http.post<CouponRequest>(this.base, c, this.auth());
  }

  update(id: number, c: CouponRequest): Observable<CouponRequest> {
    return this.http.put<CouponRequest>(`${this.base}/${id}`, c, this.auth());
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`, this.auth());
  }
}