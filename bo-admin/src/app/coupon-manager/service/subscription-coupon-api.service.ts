import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Coupon, CouponPaginatedResponse, CouponSearchParams } from '../models/coupon.model';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionCouponApiService {
  private readonly baseUrl = environment.apiCupons;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  /**
   * Búsqueda por código de cupón
   * GET /api/v1/coupons/search/{codigo_cupon}
   */
  searchByCouponCode(couponCode: string): Observable<Coupon[]> {
    const url = `${this.baseUrl}/search/${couponCode}`;
    const headers = this.getHeaders();

    return this.http.get<Coupon[]>(url, { headers }).pipe(
      map(response => this.mapResponseToCoupons(response)),
      catchError(error => {
        console.error('Error buscando por código de cupón:', error);
        return of([]);
      })
    );
  }

  /**
   * Búsqueda por código de cupón y ID de usuario
   * GET /api/v1/coupons/search/{codigo_cupon}/{id_usuario}
   */
  searchByCouponCodeAndUserId(couponCode: string, userId: number): Observable<Coupon[]> {
    const url = `${this.baseUrl}/search/${couponCode}/${userId}`;
    const headers = this.getHeaders();

    return this.http.get<Coupon[]>(url, { headers }).pipe(
      map(response => this.mapResponseToCoupons(response)),
      catchError(error => {
        console.error('Error buscando por código y usuario:', error);
        return of([]);
      })
    );
  }

  /**
   * Obtener registros paginados con filtros
   * GET /api/v1/coupons/all/{page}/{size}?search={string}&idbus={int}&ispartner={boolean}
   */
  getAllPaginated(params: CouponSearchParams): Observable<CouponPaginatedResponse> {
    const page = params.page ?? 1;
    const size = params.size ?? 10;
    const url = `${this.baseUrl}/all/${page}/${size}`;
    const headers = this.getHeaders();

    let httpParams = new HttpParams();
    
    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    
    if (params.idbus !== undefined) {
      httpParams = httpParams.set('idbus', params.idbus.toString());
    }
    
    if (params.ispartner !== undefined) {
      httpParams = httpParams.set('ispartner', params.ispartner.toString());
    }

    return this.http.get<any>(url, { headers, params: httpParams }).pipe(
      map(response => this.mapPaginatedResponse(response)),
      catchError(error => {
        console.error('Error obteniendo cupones paginados:', error);
        return of({
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: 0,
          size: size,
          first: true,
          last: true,
          empty: true
        });
      })
    );
  }

  /**
   * Crear nuevo cupón de suscripción
   * POST /api/v1/coupons
   */
  createCoupon(coupon: Partial<Coupon>): Observable<Coupon> {
    const url = this.baseUrl;
    const headers = this.getHeaders();
    
    const payload = this.mapCouponToApiFormat(coupon);
    
    return this.http.post<Coupon>(url, payload, { headers }).pipe(
      map(response => this.mapApiToCoupon(response)),
      catchError(error => {
        console.error('Error creando cupón:', error);
        throw error;
      })
    );
  }

  /**
   * Actualizar cupón existente
   * PUT /api/v1/coupons/{id}
   */
  updateCoupon(id: number, coupon: Partial<Coupon>): Observable<Coupon> {
    const url = `${this.baseUrl}/${id}`;
    const headers = this.getHeaders();
    
    const payload = this.mapCouponToApiFormat(coupon);
    
    return this.http.put<Coupon>(url, payload, { headers }).pipe(
      map(response => this.mapApiToCoupon(response)),
      catchError(error => {
        console.error('Error actualizando cupón:', error);
        throw error;
      })
    );
  }

  /**
   * Eliminar cupón
   * DELETE /api/v1/coupons/{id}
   */
  deleteCoupon(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    const headers = this.getHeaders();
    
    return this.http.delete<void>(url, { headers }).pipe(
      catchError(error => {
        console.error('Error eliminando cupón:', error);
        throw error;
      })
    );
  }

  /**
   * Mapea la respuesta de la API a formato Coupon[]
   */
  private mapResponseToCoupons(response: any): Coupon[] {
    if (!response) return [];
    
    const coupons = Array.isArray(response) ? response : [response];
    return coupons.map(item => this.mapApiToCoupon(item));
  }

  /**
   * Mapea la respuesta paginada de la API
   */
  private mapPaginatedResponse(response: any): CouponPaginatedResponse {
    return {
      content: response.content ? response.content.map((item: any) => this.mapApiToCoupon(item)) : [],
      totalElements: response.totalElements ?? 0,
      totalPages: response.totalPages ?? 0,
      number: response.number ?? 0,
      size: response.size ?? 10,
      first: response.first ?? true,
      last: response.last ?? true,
      empty: response.empty ?? true
    };
  }

  /**
   * Mapea un objeto de la API al formato Coupon
   */
  private mapApiToCoupon(apiItem: any): Coupon {
    return {
      id: apiItem.id,
      id_user: apiItem.id_user,
      id_salary: apiItem.id_salary,
      id_subscription: apiItem.id_subscription,
      discount_percentage: apiItem.discount_percentage,
      coupon_code: apiItem.coupon_code,
      date_start: apiItem.date_start,
      date_end: apiItem.date_end,
      state: apiItem.state,
      id_business: apiItem.id_business,
      is_partner: apiItem.is_partner,
      created_at: apiItem.created_at,
      updated_at: apiItem.updated_at,
      
      // Campos de compatibilidad
      name: apiItem.coupon_code,
      percent: apiItem.discount_percentage?.toString(),
      startDate: apiItem.date_start,
      endDate: apiItem.date_end,
      companyId: apiItem.id_business
    };
  }

  /**
   * Mapea un objeto Coupon al formato esperado por la API
   */
  private mapCouponToApiFormat(coupon: Partial<Coupon>): any {
    return {
      id_user: coupon.id_user,
      id_salary: coupon.id_salary,
      id_subscription: coupon.id_subscription,
      discount_percentage: coupon.discount_percentage || parseFloat(coupon.percent || '0'),
      coupon_code: coupon.coupon_code || coupon.name,
      date_start: coupon.date_start || coupon.startDate,
      date_end: coupon.date_end || coupon.endDate,
      state: coupon.state,
      id_business: coupon.id_business || coupon.companyId,
      is_partner: coupon.is_partner || false
    };
  }
}