export interface Coupon {
  id: number;
  id_user?: number;
  id_salary?: number;
  id_subscription?: number;
  discount_percentage: number;
  coupon_code: string;
  date_start: string | null;
  date_end: string | null;
  state: boolean;
  id_business: number;
  is_partner: boolean;
  created_at: string | null;
  updated_at?: string;
  
  // Nuevas propiedades del API real
  username?: string;
  fullName?: string;
  
  // Campos adicionales para compatibilidad y display
  name?: string; // alias para coupon_code
  percent: string; // alias para discount_percentage
  salaryMin?: number;
  salaryMax?: number;
  companyId?: number; // alias para id_business
  companyname?: string;
  startDate?: string | null; // alias para date_start
  endDate?: string | null; // alias para date_end
}

// Interface para la respuesta paginada de la API
export interface CouponPaginatedResponse {
  content: Coupon[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

// Interface para parámetros de búsqueda
export interface CouponSearchParams {
  page?: number;
  size?: number;
  search?: string;
  idbus?: number;
  ispartner?: boolean;
}