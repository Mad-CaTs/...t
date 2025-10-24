import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private readonly ADMIN_PANEL_API = 'https://adminpanelapi-dev.inclub.world/api';
//   private readonly URL_ADMIN_LOCAL = 'http://localhost:8081/api'; 
  private readonly MEMBERSHIP_API = 'https://membershipapi-dev.inclub.world/api/v1';
  private urlGateway = environment.URL_GATEWEY;

  constructor(private http: HttpClient) {}

  validateCoupon(data: {
    couponCode: string;
    packageId: number;
    companyId: number;
    salary: number;
  }): Observable<any> {
    return this.http.post(
      `${this.ADMIN_PANEL_API}/coupons/validate`,
      data
    );
  }

  applyDiscount(data: {
    idSubscription: number;
    discountPercent: number;
  }): Observable<any> {
    return this.http.post(
      `${this.urlGateway}/store/apply-discount`,
      data
    );
  }

  getCouponByName(name: string): Observable<any> {
    return this.http.get(`${this.ADMIN_PANEL_API}/coupons/name/${name.toUpperCase()}`);
  }

  
}
