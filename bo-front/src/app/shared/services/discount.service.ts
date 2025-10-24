import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {
  private readonly URL_GATEWAY = environment.URL_GATEWEY;
  private readonly URL_LOCAL = environment.URL_GATEWAY_LOCAL;

  constructor(private http: HttpClient) {}

  // Método existente para validar cupón (GET)
  validateCoupon(data: {
    couponCode: string;
    packageId: number;
    companyId: number;
    salary: number;
  }): Observable<any> {
    const url = `${this.URL_GATEWAY}/store/validate-coupon`;
    return this.http.post(url, data);
  }

  // Nuevo método para aplicar cupón general (UPDATE)
  applyCoupon(data: {
    id_user: number;
    id_suscription: number;
    codigo_cupon: string;
  }): Observable<any> {
    const url = `${this.URL_GATEWAY}/store/apply-coupon`;
    return this.http.put(url, data);
  }

  // Nuevo método para aplicar cupón de tipo de pago (UPDATE)
  applyCouponPayType(data: {
    id_user: number;
    id_suscription: number;
    codigo_cupon: string;
  }): Observable<any> {
    const url = `${this.URL_GATEWAY}/store/apply-coupon-pay-type`;
    return this.http.put(url, data);
  }

  // Método adicional para buscar cupón por cadena (GET) - si es necesario
  searchCouponByCode(couponCode: string): Observable<any> {
    const url = `${this.URL_GATEWAY}/store/search-coupon/${couponCode}`;
    return this.http.get(url);
  }
}