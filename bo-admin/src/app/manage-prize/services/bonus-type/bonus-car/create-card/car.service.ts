import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GenericCrudService } from '../../generic-crud.service';
import { Car } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car.model';
import { environment } from 'src/environments/environment';

const BASE_URL = environment.BonusApi;

@Injectable({ providedIn: 'root' })
export class CarService extends GenericCrudService<Car> {
  protected override endpoint = 'car-bonus/assignments';

  private readonly detailsBase = `${BASE_URL}/car-bonus/assignments/details`;
  private readonly activeBase = `${BASE_URL}/car-bonus/assignments/active`;

  constructor(protected override http: HttpClient) {
    super(http);
  }

  /** POST /assignments/create */
  createCar(formData: FormData): Observable<any> {
    const fd = this.toAssignmentsFormData(formData);
    return this.http.post<any>(`${BASE_URL}/car-bonus/assignments/create`, fd);
  }

  /** PUT /assignments/update/{id} (si existe) */
  updateCar(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${BASE_URL}/car-bonus/assignments/update/${id}`, formData);
  }

  /** DELETE /assignments/delete/{id} (si existe) */
  deleteCar(id: string): Observable<any> {
    return this.http.delete<any>(`${BASE_URL}/car-bonus/assignments/delete/${id}`);
  }

  /** ✅ GET /assignments/details/search — listado general */
  searchDetails(params: Record<string, any>): Observable<any> {
    return this.http.get<any>(`${this.detailsBase}/search`, { params: this.buildParams(params) });
  }

  /** ✅ GET /assignments/details/{id} — detalle por ID */
  getDetailsById(id: string): Observable<any> {
    return this.http.get<any>(`${this.detailsBase}/${id}`);
  }

  /** ✅ GET /assignments/active/search — asignaciones activas */
  searchActive(params: Record<string, any>): Observable<any> {
    return this.http.get<any>(`${this.activeBase}/search`, { params: this.buildParams(params) });
  }

  // =========================================================
  // 🔧 Helpers internos
  // =========================================================

  /** Convierte un objeto plano en HttpParams, ignorando undefined/null */
  private buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.append(key, value);
      }
    });
    return httpParams;
  }

  /** Arma el FormData esperado por el endpoint /assignments/create */
  private toAssignmentsFormData(flat: FormData): FormData {
    const fd = new FormData();
    const pick = (k: string): string => {
      const v = flat.get(k);
      return v === null ? '' : String(v);
    };

    const brandId = pick('brandId');
    const modelId = pick('modelId');
    const color = pick('color');
    const image = flat.get('image') as File | null;
    const memberId = pick('memberId');
  const price = pick('price');
  const interestRate = pick('interestRate');
  const companyInitial = pick('companyInitial');
  const memberInitial = pick('memberInitial');
  const initialParts = pick('initialInstallmentsCount');
  const monthly = pick('monthlyInstallmentsCount');
    const startDate = pick('paymentStartDate');

    if (brandId) fd.append('car.brandId', brandId);
    if (modelId) fd.append('car.modelId', modelId);
    if (color) fd.append('car.color', color);
    if (image instanceof File) fd.append('car.image', image);

  if (memberId) fd.append('assignment.memberId', memberId);
  if (price) fd.append('assignment.price', price);
  if (interestRate) fd.append('assignment.interestRate', interestRate);
  if (companyInitial) fd.append('assignment.companyInitial', companyInitial);
  if (memberInitial) fd.append('assignment.memberInitial', memberInitial);
  if (initialParts) fd.append('assignment.initialInstallmentsCount', initialParts);
  if (monthly) fd.append('assignment.monthlyInstallmentsCount', monthly);
    if (startDate) fd.append('assignment.paymentStartDate', startDate);

    return fd;
  }
}
