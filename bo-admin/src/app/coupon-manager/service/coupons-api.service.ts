import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

// Interfaces para el servicio de cupones (API Real)
export interface CouponResponse {
  idCoupon: number;
  idUser?: number;
  idSalary?: number;
  discountPercentage: number;
  couponCode: string;
  dateStart: number[] | null; // Array format: [year, month, day, hour, minute, second, nanosecond]
  dateEnd: number[] | null;
  state: boolean;
  idBusiness: number;
  isPartner: boolean;
  createdAt: number[];
  username?: string;
  fullName?: string;
}

export interface CouponListResponse {
  total: number;
  totalRecords: number;
  data: CouponResponse[];
  size: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
  state: boolean;
  page: number;
  message: string;
}

export interface CouponSearchFilters {
  page?: number;
  size?: number;
  search?: string;
  idbus?: number;
  ispartner?: boolean;
}

export interface CouponCreateRequest {
  idUser?: number;
  idSalary?: number;
  idSubscription?: number;
  discountPercentage: number;
  code: string;
  dateStart: string;
  dateEnd: string;
  state: boolean;
  idBusiness: number;
  isPartner: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CouponsApiService {
  
  private readonly baseUrl = environment.apiCupons;

  constructor(private http: HttpClient) {}

  // El interceptor HTTP maneja automáticamente la autorización
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json'
    });
  }

  /**
   * Obtiene listado paginado de cupones con filtros
   * GET /all/{page}/{size}?search={string}&idbus={int}&ispartner={boolean}
   * 
   * @param filters Filtros de búsqueda
   * @returns Observable con la respuesta paginada
   */
  getAllCoupons(filters: CouponSearchFilters = {}): Observable<CouponListResponse> {
    const page = filters.page ?? 1;
    const size = filters.size ?? 10;
    const url = `${this.baseUrl}/all/${page}/${size}`;
    
    let params = new HttpParams();
    
    if (filters.search) {
      params = params.set('search', filters.search);
    }
    
    if (filters.idbus !== undefined && filters.idbus !== null) {
      params = params.set('idbus', filters.idbus.toString());
    }
    
    if (filters.ispartner !== undefined) {
      params = params.set('ispartner', filters.ispartner.toString());
    }

    return this.http.get<CouponListResponse>(url, {
      headers: this.getHeaders(),
      params: params
    }).pipe(
      catchError(error => {
        console.error('Error obteniendo cupones:', error);
        return of({
          total: 0,
          totalRecords: 0,
          data: [],
          size: size,
          totalPages: 0,
          hasPrevious: false,
          hasNext: false,
          state: true,
          page: page,
          message: 'Error al obtener cupones'
        });
      })
    );
  }

  /**
   * Busca cupones por código
   * GET /search/{codigo_cupon}
   * 
   * @param couponCode Código del cupón a buscar
   * @returns Observable con array de cupones encontrados
   */
  searchByCouponCode(couponCode: string): Observable<CouponResponse[]> {
    const url = `${this.baseUrl}/search/${couponCode}`;
    
    return this.http.get<CouponResponse[]>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => Array.isArray(response) ? response : [response]),
      catchError(error => {
        console.error('Error buscando por código:', error);
        return of([]);
      })
    );
  }

  /**
   * Busca cupones por código y ID de usuario
   * GET /search/{codigo_cupon}/{id_usuario}
   * 
   * @param couponCode Código del cupón
   * @param userId ID del usuario
   * @returns Observable con array de cupones encontrados
   */
  searchByCouponCodeAndUser(couponCode: string, userId: number): Observable<CouponResponse[]> {
    const url = `${this.baseUrl}/search/${couponCode}/${userId}`;
    
    return this.http.get<CouponResponse[]>(url, {
      headers: this.getHeaders()
    }).pipe(
      map(response => Array.isArray(response) ? response : [response]),
      catchError(error => {
        console.error('Error buscando por código y usuario:', error);
        return of([]);
      })
    );
  }

  /**
   * Crea un nuevo cupón
   * POST /create
   * 
   * @param couponData Datos del cupón a crear
   * @returns Observable con el cupón creado
   */
  createCoupon(couponData: CouponCreateRequest): Observable<CouponResponse> {
    const url = `${this.baseUrl}/create`;
    
    return this.http.post<CouponResponse>(url, couponData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error creando cupón:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza un cupón existente
   * PUT /update/{id}
   * 
   * @param id ID del cupón a actualizar
   * @param couponData Datos del cupón a actualizar
   * @returns Observable con el cupón actualizado
   */
  updateCoupon(id: number, couponData: Partial<CouponCreateRequest>): Observable<CouponResponse> {
    const url = `${this.baseUrl}/update/${id}`;
    
    return this.http.put<CouponResponse>(url, couponData, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error actualizando cupón:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un cupón
   * DELETE /delete/{id}
   * 
   * @param id ID del cupón a eliminar
   * @returns Observable con la respuesta del servidor
   */
  deleteCoupon(id: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${id}`;
    
    return this.http.delete<any>(url, {
      headers: this.getHeaders()
    }).pipe(
      catchError(error => {
        console.error('Error eliminando cupón:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene cupones solo para colaboradores (ispartner=false)
   * Método de conveniencia
   */
  getCollaboratorCoupons(page: number = 1, size: number = 10, search?: string, idbus?: number): Observable<CouponListResponse> {
    return this.getAllCoupons({
      page,
      size,
      search,
      idbus,
      ispartner: false
    });
  }

  /**
   * Obtiene cupones solo para socios (ispartner=true)
   * Método de conveniencia
   */
  getPartnerCoupons(page: number = 1, size: number = 10, search?: string, idbus?: number): Observable<CouponListResponse> {
    return this.getAllCoupons({
      page,
      size,
      search,
      idbus,
      ispartner: true
    });
  }
}