import { ChangeDetectorRef, Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, of } from 'rxjs';
import { map, catchError, takeUntil } from 'rxjs/operators';

import { TablesModule } from '@shared/components/tables/tables.module';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';

import { ICompany } from '@interfaces/create-prize.interface';
import { CompanyApiService } from '@app/coupon-manager/service/company-api.service';
import { CouponsApiService, CouponResponse, CouponListResponse } from '@app/coupon-manager/service/coupons-api.service';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { Coupon } from '@app/coupon-manager/models/coupon.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-partner-discounts',
  templateUrl: './partner-discounts.component.html',
  styleUrls: ['./partner-discounts.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule, 
    TablesModule, 
    DatePipe
  ]
})
export class PartnerDiscountsComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;
  @ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;

  public readonly table: TableModel<Coupon>;
  public loading = false;
  selectedCoupon: Coupon | null = null;

  filterForm: FormGroup;
  couponForm: FormGroup;
  companies: ICompany[] = [];
  salaryRanges = [
    { label: 'Desde S/ 1500',   min: 0,    max: 1500 },
    { label: 'S/1501 – S/2500', min: 1501, max: 2500 },
    { label: 'S/2501 – S/3500', min: 2501, max: 3500 },
    { label: 'S/3501 – S/4500', min: 3501, max: 4500 },
    { label: 'Desde S/ 4501',   min: 4501, max: 50000 } 
  ];
  
  private allCoupons: Coupon[] = [];
  private destroy$ = new Subject<void>();
  public editingCoupon: Coupon | null = null;
  public itemsPerPage: number = 5;
  public paginatedCoupons: Coupon[] = [];
  
  // Propiedades para paginación de API
  public totalElements: number = 0;
  public totalPages: number = 0;
  public currentApiPage: number = 0;
  
  // Propiedades simplificadas para filtros
  public searchText: string = '';
  public selectedCompany: string = '';
  public selectedRange: string = '';

  constructor(
    private modalService: NgbModal,
    private tableService: TableService,
    private companyApiService: CompanyApiService,
    private couponsApiService: CouponsApiService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.table = this.tableService.generateTable<Coupon>({
      headers: ['N°', 'Cupón', 'Min. Salarial', 'Máx. Salarial', '% Descto.', 'Empresa', 'Vigencia', 'Estado', 'Acciones'],
      noCheckBoxes: false,
      headersMinWidth: [60, 160, 120, 120, 110, 180, 220, 140, 100]
    });

    this.filterForm = this.fb.group({ search: [''], companyId: [null], salaryRangeIndex: [null] });
    this.couponForm = this.fb.group({
      code: ['', Validators.required],
       discount: [
    null,
    [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
      Validators.pattern(/^\d+$/)  
    ]
  ],
      companyId: [null, Validators.required],
      salaryRangeIndex: [null, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      active: [true]
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.applyFilters();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Función helper para convertir CouponResponse a Coupon
  private mapCouponResponseToCoupon(apiCoupon: CouponResponse): Coupon {
    // Función helper para convertir array de fecha a string ISO
    const arrayDateToISOString = (dateArray: number[] | null): string | null => {
      if (!dateArray || dateArray.length < 3) return null;
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateArray;
      return new Date(year, month - 1, day, hour, minute, second).toISOString();
    };

    const dateStart = arrayDateToISOString(apiCoupon.dateStart);
    const dateEnd = arrayDateToISOString(apiCoupon.dateEnd);
    const createdAt = arrayDateToISOString(apiCoupon.createdAt);

    return {
      // Propiedades usando la nueva estructura del API
      id: apiCoupon.idCoupon,
      id_user: apiCoupon.idUser,
      id_salary: apiCoupon.idSalary,
      discount_percentage: apiCoupon.discountPercentage,
      coupon_code: apiCoupon.couponCode,
      date_start: dateStart,
      date_end: dateEnd,
      state: apiCoupon.state,
      id_business: apiCoupon.idBusiness,
      is_partner: apiCoupon.isPartner,
      created_at: createdAt,
      username: apiCoupon.username,
      fullName: apiCoupon.fullName,
      
      // Campos de compatibilidad con el modelo anterior
      name: apiCoupon.couponCode,
      percent: apiCoupon.discountPercentage?.toString(),
      startDate: dateStart,
      endDate: dateEnd,
      companyId: apiCoupon.idBusiness,
      companyname: 'Inclub' // Por defecto para socios
    };
  }

  // Función pública para convertir string ISO a Date (para el template)
  public parseDate(dateString: string | null | undefined): Date | null {
    return dateString ? new Date(dateString) : null;
  }

  private loadCouponsFromApi(): void {
    this.loading = true;
    
    const page = this.currentApiPage + 1;
    const size = this.itemsPerPage;
    const search = this.searchText?.trim() || '';
    const companyId = this.selectedCompany ? parseInt(this.selectedCompany) : undefined;
    const isPartner = true;

    const apiCall = this.couponsApiService.getPartnerCoupons(page, size, search, companyId);

    apiCall.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response: CouponListResponse) => {
        this.allCoupons = response.data.map(this.mapCouponResponseToCoupon);
        this.table.data = this.allCoupons;
        this.totalElements = response.total;
        this.totalPages = response.totalPages;
        this.updatePaginatedView();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  private loadInitialData(): void {
    this.loading = true;
    this.companyApiService.fetchGetAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: companies => {
        this.companies = companies;
        this.loadCouponsFromApi();
      },
      error: error => {
        // Si falla la carga de empresas, usar valor por defecto y continuar
        this.companies = [{ key: 1, text: 'Inclub' }];
        this.loadCouponsFromApi();
      }
    });
  }

  private updatePaginatedView(): void {
    this.paginatedCoupons = this.allCoupons;
  }
  


blockInvalidKeys(event: KeyboardEvent): void {
  const invalidKeys = ['e', 'E', '+', '-', '.', ','];
  if (invalidKeys.includes(event.key)) {
    event.preventDefault();
  }
}


blockPaste(event: ClipboardEvent): void {
  const pasteData = event.clipboardData?.getData('text') ?? '';
  if (!/^\d+$/.test(pasteData)) {
    event.preventDefault();
  }
}


  private applyFilters(): void {
    this.currentApiPage = 0;
    this.loadCouponsFromApi();
  }

  public search(): void {
    this.currentApiPage = 0;
    this.loadCouponsFromApi();
  }

  public addCoupon(): void {
    this.onCreate();
  }
  
  public get totalPagesLocal(): number {
    return Math.ceil(this.table.data.length / this.itemsPerPage);
  }
  
  public goToPage(page: number): void {
    if ((page < 1 || page > this.totalPages) && this.totalPages > 0) {
      return;
    }
    this.currentApiPage = page - 1;
    this.loadCouponsFromApi();
  }
  
  public getPages(): number[] {
    return Array(this.totalPages).fill(0).map((x, i) => i + 1);
  }

  public get currentPage(): number {
    return this.currentApiPage + 1;
  }
  
  onCreate(): void {
    this.editingCoupon = null;
    this.couponForm.reset({
      active: true,
      companyId: null, 
      salaryRangeIndex: null,
    });
    this.couponForm.get('code')?.enable();
    this.modalService.open(this.modalContent, { centered: true, backdrop: 'static', size: 'lg', windowClass: 'custom-modal' });
  }

  onEdit(coupon: Coupon): void {
    this.editingCoupon = coupon;
    
    // Intentar encontrar el rango salarial basado en idSalary
    const salaryRangeIndex = coupon.id_salary 
      ? this.salaryRanges.findIndex(r => r.min === coupon.id_salary)
      : -1;
    
    const startDate = (coupon.date_start || coupon.startDate) ? 
      new Date(coupon.date_start || coupon.startDate || '').toISOString().split('T')[0] : '';
    const endDate = (coupon.date_end || coupon.endDate) ? 
      new Date(coupon.date_end || coupon.endDate || '').toISOString().split('T')[0] : '';
    
    this.couponForm.patchValue({
      code: coupon.coupon_code,
      discount: coupon.percent ? parseFloat(coupon.percent) : 0,
      salaryRangeIndex: salaryRangeIndex !== -1 ? salaryRangeIndex : null,
      startDate: startDate,
      endDate: endDate,
      active: coupon.state
    });
    
    this.couponForm.get('code')?.disable();
    
    this.modalService.open(this.modalContent, { centered: true, backdrop: 'static', size: 'lg', windowClass: 'custom-modal' });
  }

  saveCoupon(): void {
    if (this.couponForm.invalid) {
      alert('Formulario inválido. Por favor, complete todos los campos requeridos.');
      return;
    }
    
    const formVal = this.couponForm.getRawValue();
    const range = this.salaryRanges[formVal.salaryRangeIndex];
    
    const couponRequest = {
      code: this.editingCoupon ? this.editingCoupon.coupon_code : formVal.code.trim(),
      discountPercentage: formVal.discount,
      idBusiness: formVal.companyId ?? 1,
      dateStart: formVal.startDate + 'T00:00:00',
      dateEnd: formVal.endDate + 'T23:59:59',
      state: formVal.active,
      isPartner: true,
      idSalary: range.min
    };

    const apiCall$ = this.editingCoupon
      ? this.couponsApiService.updateCoupon(this.editingCoupon.id, couponRequest)
      : this.couponsApiService.createCoupon(couponRequest);

    apiCall$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.modalService.dismissAll();
        const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
        const modal = ref.componentInstance as ModalConfirmationComponent;

        modal.title = 'Registro exitoso';
        modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
        modal.body = 'se agregó correctamente.';
        this.loadInitialData();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Error al guardar el cupón.';
        this.modalService.dismissAll();
        const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
        const modal = ref.componentInstance as ModalConfirmationComponent;

        modal.title = 'Error al guardar';
        modal.icon = 'bi bi-exclamation-triangle-fill text-danger fa-2x';
        modal.body = errorMsg;
      }
    });
  }

  onDelete(coupon: Coupon): void {
    this.selectedCoupon = coupon;
    this.modalService.open(this.confirmDeleteModal);

  }

  confirmDelete(modalRef: any) {
    if (!this.selectedCoupon?.id) { return; }

    this.couponsApiService.deleteCoupon(this.selectedCoupon.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        modalRef.close();
        const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
        const modal = ref.componentInstance as ModalConfirmationComponent;

        modal.title = 'Cupón eliminado';
        modal.icon = 'bi bi-check-circle-fill text-success fa-2x';
        modal.body = 'El cupón se eliminó correctamente.';
        
        this.loadInitialData();
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Error al eliminar el cupón.';
        this.modalService.dismissAll();
        const ref = this.modalService.open(ModalConfirmationComponent, { centered: true, size: 'md' });
        const modal = ref.componentInstance as ModalConfirmationComponent;

        modal.title = 'Error al eliminar';
        modal.icon = 'bi bi-exclamation-triangle-fill text-danger fa-2x';
        modal.body = errorMsg;
      }
    });
  }
}
