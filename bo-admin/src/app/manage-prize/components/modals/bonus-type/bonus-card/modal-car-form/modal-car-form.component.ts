import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges,
  ChangeDetectorRef, ViewChild, ElementRef, HostListener, inject, OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError , tap, takeUntil } from 'rxjs/operators';
import { of , Subject} from 'rxjs';
import { CarBrand } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car-brand.model';
import { CarModel } from '@app/manage-prize/models/bonus-type/bonus-car/create-car/car-model.model';
import { CarBrandService } from '@app/manage-prize/services/bonus-type/bonus-car/create-card/car-brand.service';
import { CarModelService } from '@app/manage-prize/services/bonus-type/bonus-car/create-card/car-model.service';

export type CarFormMode = 'create' | 'edit' | 'view';

export interface CarFormData {
  id?: number;
  brand: string;
  model: string;
  color: string;
  price: number;
  interestRate: number;
  vehicleInsurance?: number | null;
  gps?: number | null;
  monthlyInstallmentsCount: number;
  companyInitialAmount: number;
  partnerInitialAmount: number;
  fractionate: boolean;
  initialInstallmentsCount?: number | null;
  image?: File | { name: string; url: string; isUrl: true } | null;
  paymentDate: string;
  status: boolean;
  partnerName?: string | null;
  memberId?: number | null;
  brandId?: number | null;
  modelId?: number | null;
}

@Component({
  selector: 'app-modal-car-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-car-form.component.html',
  styleUrls: ['./modal-car-form.component.scss']
})
export class ModalCarFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() mode: CarFormMode = 'create';
  @Input() initialData?: Partial<CarFormData> | null;
  @Input() title?: string;
  @Input() showShell = true;

  @Output() save = new EventEmitter<CarFormData>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  imagePreview: string | null = null;
  currentFileName = '';
  currentFileSize = '';
  fileError: 'type' | 'size' | '' = '';
  dragOver = false;

  brands: CarBrand[] = [];
  brandSuggestions: CarBrand[] = [];
  selectedBrandId: number | null = null;
  showCreateBrand = false;
  creatingBrand = false;

  modelSuggestions: CarModel[] = [];
  selectedModelId: number | null = null;
  showCreateModel = false;
  creatingModel = false;

  brandDropdownOpen = false;
  modelDropdownOpen = false;
  private lastModelSuggestions: CarModel[] = [];
  brandActiveIndex: number = -1;
  modelActiveIndex: number = -1;

  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private brandService = inject(CarBrandService);
  private modelService = inject(CarModelService);
  private destroy$ = new Subject<void>();
  private hostRef = inject(ElementRef) as ElementRef<HTMLElement>;

  fractionQtyOptions = Array.from({ length: 12 }, (_, i) => i + 1);

  get isView(): boolean { return this.mode === 'view'; }
  get showInsuranceGps(): boolean { return this.mode === 'view'; }
  get showPartnerField(): boolean { return this.mode !== 'create'; }

  get computedTitle(): string {
    if (this.title) return this.title;
    if (this.mode === 'create') return 'Nuevo Auto';
    if (this.mode === 'view') return 'Detalle del Auto';
    return 'Asignar Auto a Socio';
  }
  get computedSubtitle(): string {
    if (this.mode === 'create') return 'Agrega el detalle del nuevo auto';
    if (this.mode === 'view') return 'Revisa el detalle del auto.';
    return 'Asigna el nuevo auto al socio.';
  }
  get primaryButtonLabel(): string {
    if (this.mode === 'create') return 'Crear';
    if (this.mode === 'edit') return 'Asignar y Crear cronograma (Inicial)';
    return '';
  }

  ngOnInit(): void {
    this.buildForm();
    this.updateModelFieldState();
    this.loadInitialData();
    if (this.isView) this.disableForm();

    this.loadBrands();
    this.setupBrandListener();
    this.setupModelListener();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] && !changes['mode'].firstChange) {
      if (this.isView) this.disableForm(); else this.enableForm();
      this.updateModelFieldState();
    }
    if (changes['initialData'] && !changes['initialData'].firstChange) {
      this.loadInitialData();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      brand: ['', [Validators.required, Validators.pattern(/\S+/)]],
      model: ['', [Validators.required, Validators.pattern(/\S+/), Validators.maxLength(100)]],
      color: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      interestRate: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      vehicleInsurance: [0, [Validators.min(0)]],
      gps: [0, [Validators.min(0)]],
  monthlyInstallmentsCount: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      partnerInitialAmount: [0, [Validators.required, Validators.min(0)]],
  initialInstallmentsCount: [1, [Validators.required, Validators.min(1), Validators.pattern(/^\d+$/)]],
      companyInitialAmount: [0, [Validators.required, Validators.min(0)]],
      image: [null],
      paymentDate: ['', Validators.required],
      status: [true],
      partnerName: [{ value: '', disabled: false }],
      memberId: [null]
    });
  }

  private loadInitialData(): void {
    if (!this.initialData) {
      this.form.reset({
        brand: '',
        model: '',
        color: '',
        price: 0,
        interestRate: 0,
        vehicleInsurance: 0,
        gps: 0,
        monthlyInstallmentsCount: 1,
        partnerInitialAmount: 0,
        initialInstallmentsCount: 0,
        companyInitialAmount: 0,
        image: null,
        paymentDate: '',
        status: true,
        partnerName: '',
        memberId: null
      }, { emitEvent: false });
      this.imagePreview = null;
      this.currentFileName = '';
      this.currentFileSize = '';
      this.fileError = '';
      this.selectedBrandId = null;
      this.selectedModelId = null;
      return;
    }

    const d = this.initialData;
    this.form.patchValue({
      brand: d.brand ?? '',
      model: d.model ?? '',
      color: d.color ?? '',
      price: d.price ?? 0,
      interestRate: d.interestRate ?? 0,
      vehicleInsurance: d.vehicleInsurance ?? 0,
      gps: d.gps ?? 0,
      monthlyInstallmentsCount: d.monthlyInstallmentsCount ?? 1,
      partnerInitialAmount: d.partnerInitialAmount ?? 0,
      initialInstallmentsCount: (d.initialInstallmentsCount ?? (d as any)?.quantity ?? 0) || 0,
      companyInitialAmount: d.companyInitialAmount ?? 0,
      paymentDate: d.paymentDate ?? '',
      status: d.status ?? true,
      partnerName: (d as any)?.partnerName ?? '-',
      memberId: (d as any)?.memberId ?? null
    }, { emitEvent: false });

    this.selectedBrandId = (d as any)?.brandId ?? null;
    this.selectedModelId = (d as any)?.modelId ?? null;

    if ((d as any)?.image?.isUrl && (d as any)?.image?.url) {
      this.imagePreview = (d as any).image.url;
      this.currentFileName = (d as any).image.name || 'Imagen';
      this.currentFileSize = '';
    } else {
      this.imagePreview = null;
      this.currentFileName = '';
      this.currentFileSize = '';
    }

    this.cd.detectChanges();
  }

  private disableForm(): void { this.form.disable({ emitEvent: false }); }
  private enableForm(): void { this.form.enable({ emitEvent: false }); }

  t(name: string) { return this.form.get(name); }
  preventLeadingSpace(e: KeyboardEvent): void {
    const input = e.target as HTMLInputElement;
    if (e.key === ' ' && input.selectionStart === 0) e.preventDefault();
  }
  blockNumberKeys(ev: KeyboardEvent, allowDecimal = true) {
    const invalid = allowDecimal ? ['e', 'E', '+', '-'] : ['e', 'E', '+', '-', '.'];
    if (invalid.includes(ev.key)) ev.preventDefault();
  }
  disableWheel(ev: WheelEvent) { (ev.target as HTMLElement).blur(); }

  private loadBrands(): void {
    this.brandService.getAll().pipe(
      takeUntil(this.destroy$),
      catchError(() => of({ data: [] }))
    ).subscribe((res: any) => {
      this.brands = res?.data ?? [];
      this.brandSuggestions = this.brands.slice(0, 20);
      const name = (this.t('brand')?.value || '').toString().trim();
      if (name) {
        const b = this.findBrandByName(name);
        this.selectedBrandId = b?.id ?? null;
      }
      this.cd.detectChanges();
    });
  }

  private setupBrandListener(): void {
    this.t('brand')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => {
        this.selectedModelId = null;
        this.form.patchValue({ model: '' }, { emitEvent: false });
        this.modelSuggestions = [];
        this.showCreateModel = false;
      }),
      tap((raw: string) => {
        const value = (raw || '').toString().trim();
        const exact = this.findBrandByName(value);
        this.selectedBrandId = exact?.id ?? null;

        if (value.length === 0) {
          this.selectedBrandId = null;
          this.brandSuggestions = this.brands.slice(0, 20);
          this.showCreateBrand = false;
          this.selectedModelId = null;
          this.form.patchValue({ model: '' }, { emitEvent: false });
          this.modelSuggestions = [];
          this.lastModelSuggestions = [];
          this.modelDropdownOpen = false;
          return;
        }
        const lc = value.toLowerCase();
        const local = this.brands.filter(b => b.name.toLowerCase().includes(lc)).slice(0, 20);
        this.brandSuggestions = local;

        this.showCreateBrand = !exact && value.length > 0;
        this.brandDropdownOpen = true;
  }),
      switchMap((raw: string) => {
        const value = (raw || '').toString().trim();
        if (!value) return of({ data: [] });
        return this.brandService.searchByName(value).pipe(
          catchError(() => of([] as CarBrand[])),
          switchMap((data: any) => of({ data }))
        );
      })
    ).subscribe((res: any) => {
      const remote: CarBrand[] = res?.data ? (Array.isArray(res.data) ? res.data : []) : [];
      const map = new Map<string, CarBrand>();
      this.brandSuggestions.forEach(b => map.set(b.name.toLowerCase(), b));
      remote.forEach(b => { if (!map.has(b.name.toLowerCase())) map.set(b.name.toLowerCase(), b); });
      this.brandSuggestions = Array.from(map.values()).slice(0, 20);

      const current = (this.t('brand')?.value || '').toString().trim();
      const exact = this.findBrandByName(current);
      this.selectedBrandId = exact?.id ?? null;
      this.showCreateBrand = !exact && !!current;
      this.brandActiveIndex = -1;
      this.cd.detectChanges();
    });
  }

  private setupModelListener(): void {
    this.t('model')?.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(250),
      distinctUntilChanged(),
      filter(() => !!this.selectedBrandId && !this.isView),
      switchMap((raw: string) => {
        const value = (raw || '').toString().trim();
        if (!value) {
          this.modelSuggestions = this.lastModelSuggestions.slice(0, 20);
          this.showCreateModel = false;
          this.selectedModelId = null;
          this.modelDropdownOpen = true;
          this.cd.detectChanges();
          return of({ data: [] });
        }
        return this.modelService.search(this.selectedBrandId!, value).pipe(
          catchError(() => of({ data: [] }))
        );
      })
    ).subscribe((res: any) => {
      const term = (this.t('model')?.value || '').toString().trim();
      const list: CarModel[] = res?.data ?? [];
      this.modelSuggestions = list.slice(0, 20);
      this.lastModelSuggestions = this.modelSuggestions.slice(0, 20);
      const exact = this.modelSuggestions.find(m => m.name.toLowerCase() === term.toLowerCase());
      this.selectedModelId = exact?.id ?? null;

  this.showCreateModel = !!this.selectedBrandId && !exact && term.length > 0;
      this.modelDropdownOpen = true;
      this.modelActiveIndex = -1;
      this.cd.detectChanges();
    });
  }

  private findBrandByName(name: string): CarBrand | undefined {
    const n = (name || '').toLowerCase();
    return this.brands.find(b => b.name.toLowerCase() === n)
      || this.brandSuggestions.find(b => b.name.toLowerCase() === n);
  }

  onCreateBrand(): void {
    if (this.isView) return;
    const name = (this.t('brand')?.value || '').toString().trim();
    if (!name) return;

    this.creatingBrand = true;
    this.brandService.create({ name } as any).pipe(
      catchError(() => of(null)),
      tap(() => this.creatingBrand = false)
    ).subscribe((res: any) => {
      if (!res?.data) return;
      const created: CarBrand = res.data;
      this.brands = [created, ...this.brands];
      this.brandSuggestions = [created, ...this.brandSuggestions];
      this.selectedBrandId = created.id;
      this.showCreateBrand = false;
      this.brandDropdownOpen = false;
      this.form.patchValue({ brand: created.name }, { emitEvent: false });
      this.selectedModelId = null;
      this.form.patchValue({ model: '' }, { emitEvent: true });
      this.lastModelSuggestions = [];
      this.cd.detectChanges();
    });
  }

  onCreateModel(): void {
    if (this.isView || !this.selectedBrandId) return;
    const name = (this.t('model')?.value || '').toString().trim();
    if (!name) return;

    this.creatingModel = true;
    this.modelService.create({ name, brandId: this.selectedBrandId } as any).pipe(
      catchError(() => of(null)),
      tap(() => this.creatingModel = false)
    ).subscribe((res: any) => {
      if (!res?.data) return;
      const created: CarModel = res.data;
      this.modelSuggestions = [created, ...this.modelSuggestions];
      this.lastModelSuggestions = this.modelSuggestions.slice(0, 20);
      this.selectedModelId = created.id;
      this.showCreateModel = false;
      this.modelDropdownOpen = false;

      this.form.patchValue({ model: created.name }, { emitEvent: false });
      this.cd.detectChanges();
    });
  }

  trackById(index: number, item: any) { return item?.id ?? index; }

  onBrandFocus(): void {
    if (this.isView) return;
    const value = (this.t('brand')?.value || '').toString().trim();
    if (!value) {

      this.selectedBrandId = null;
      this.showCreateBrand = false;
      this.brandSuggestions = this.brands.slice(0, 20);
      this.selectedModelId = null;
      this.form.patchValue({ model: '' }, { emitEvent: false });
      this.modelSuggestions = [];
      this.lastModelSuggestions = [];
    }
    this.brandDropdownOpen = true;
    this.brandActiveIndex = -1;
    this.cd.detectChanges();
  }
  onBrandInput(): void {
    if (this.isView) return;
    this.brandDropdownOpen = true;
    const raw = (this.t('brand')?.value || '').toString();
    const value = raw.trim();
    if (!value) {
      this.selectedBrandId = null;
      this.showCreateBrand = false;
      this.brandSuggestions = this.brands.slice(0, 20);
      this.selectedModelId = null;
      this.form.patchValue({ model: '' }, { emitEvent: false });
      this.modelSuggestions = [];
      this.lastModelSuggestions = [];
      this.modelDropdownOpen = false;
      this.brandActiveIndex = -1;
      this.cd.detectChanges();
      return;
    }
    const exact = this.findBrandByName(value);
    this.selectedBrandId = exact?.id ?? null;
    const lc = value.toLowerCase();
    this.brandSuggestions = this.brands.filter(b => b.name.toLowerCase().includes(lc)).slice(0, 20);
    this.showCreateBrand = !exact && value.length > 0;
    this.brandActiveIndex = -1;
    if (!this.selectedBrandId) {
      this.selectedModelId = null;
      this.showCreateModel = false;
      this.modelDropdownOpen = false;
    }
    this.cd.detectChanges();
  }
  toggleBrandDropdown(): void {
    if (this.isView) return;
  this.brandDropdownOpen = !this.brandDropdownOpen;
  this.brandActiveIndex = -1;
    if (this.brandDropdownOpen) {
      const value = (this.t('brand')?.value || '').toString().trim();
      if (!value) {
        this.selectedBrandId = null;
        this.showCreateBrand = false;
        this.brandSuggestions = this.brands.slice(0, 20);
        this.selectedModelId = null;
        this.form.patchValue({ model: '' }, { emitEvent: false });
        this.modelSuggestions = [];
        this.lastModelSuggestions = [];
      } else {
        const exact = this.findBrandByName(value);
        const lc = value.toLowerCase();
        this.brandSuggestions = this.brands.filter(b => b.name.toLowerCase().includes(lc)).slice(0, 20);
        this.showCreateBrand = !exact && value.length > 0;
      }
    }
    this.cd.detectChanges();
  }
  onSelectBrand(b: CarBrand): void {
    if (this.isView) return;
    this.form.patchValue({ brand: b.name }, { emitEvent: true });
    this.selectedBrandId = b.id;
    this.showCreateBrand = false;
    this.selectedModelId = null;
    this.form.patchValue({ model: '' }, { emitEvent: true });
    this.lastModelSuggestions = [];
    this.brandDropdownOpen = false;
    this.brandActiveIndex = -1;
    
    if (this.selectedBrandId) {
      this.modelService.search(this.selectedBrandId, '').pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          return of([]);
        })
      ).subscribe((response: any) => {
        const models = response?.data || [];
        this.lastModelSuggestions = models;
        this.modelSuggestions = models.slice(0, 20);
        this.cd.detectChanges();
      });
    }
    
    this.cd.detectChanges();
    this.updateModelFieldState();
  }

  private updateModelFieldState(): void {
    const modelControl = this.form.get('model');
    if (!modelControl) return;
    
    if (this.isView || !this.selectedBrandId) {
      modelControl.disable();
    } else {
      modelControl.enable();
    }
  }

  onModelFocus(): void {
    if (this.isView || !this.selectedBrandId) {
      this.modelDropdownOpen = false;
      return;
    }
    const value = (this.t('model')?.value || '').toString().trim();
    
    // Si no hay modelos cargados, cargarlos automáticamente
    if (this.lastModelSuggestions.length === 0) {
      this.modelService.search(this.selectedBrandId, '').pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          return of([]);
        })
      ).subscribe((response: any) => {
        // Extraer el array de modelos del campo 'data' de la respuesta
        const models = response?.data || [];
        this.lastModelSuggestions = models;
        this.modelSuggestions = models.slice(0, 20);
        this.modelDropdownOpen = true;
        this.modelActiveIndex = -1;
        this.cd.detectChanges();
      });
    } else {
      if (!value) this.modelSuggestions = this.lastModelSuggestions.slice(0, 20);
      this.modelDropdownOpen = true;
      this.modelActiveIndex = -1;
      this.cd.detectChanges();
    }
  }
  onModelInput(): void {
    if (this.isView || !this.selectedBrandId) {
      this.modelDropdownOpen = false;
      this.cd.detectChanges();
      return;
    }
    this.modelDropdownOpen = true;
    const raw = (this.t('model')?.value || '').toString();
    const term = raw.trim();
    if (!term) {
      this.modelSuggestions = this.lastModelSuggestions.slice(0, 20);
      this.showCreateModel = false;
      this.selectedModelId = null;
      this.modelActiveIndex = -1;
      this.cd.detectChanges();
      return;
    }
    const exact = this.modelSuggestions.find(m => m.name.toLowerCase() === term.toLowerCase());
    this.selectedModelId = exact?.id ?? null;
    this.showCreateModel = !!this.selectedBrandId && !exact && term.length > 0;
    this.modelActiveIndex = -1;
  }
  toggleModelDropdown(): void {
    if (this.isView || !this.selectedBrandId) return;
  this.modelDropdownOpen = !this.modelDropdownOpen;
  this.modelActiveIndex = -1;
    if (this.modelDropdownOpen) {
      const value = (this.t('model')?.value || '').toString().trim();
      if (!value) this.modelSuggestions = this.lastModelSuggestions.slice(0, 20);
    }
    this.cd.detectChanges();
  }
  onSelectModel(m: CarModel): void {
    if (this.isView) return;
    this.form.patchValue({ model: m.name }, { emitEvent: true });
    this.selectedModelId = m.id;
    this.showCreateModel = false;
    this.modelDropdownOpen = false;
    this.modelActiveIndex = -1;
    this.cd.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(ev: MouseEvent): void {
    const hostEl = this.hostRef?.nativeElement;
    if (!hostEl) return;
    if (!hostEl.contains(ev.target as Node)) {
      this.brandDropdownOpen = false;
      this.modelDropdownOpen = false;
      this.brandActiveIndex = -1;
      this.modelActiveIndex = -1;
      this.cd.detectChanges();
    }
  }
  onFormFocus(ev: FocusEvent): void {
    const target = ev.target as HTMLElement;
    const isBrand = target && (target as HTMLElement).getAttribute('formcontrolname') === 'brand';
    const isModel = target && (target as HTMLElement).getAttribute('formcontrolname') === 'model';
    if (!isBrand && !isModel) {
      if (this.brandDropdownOpen || this.modelDropdownOpen) {
        this.brandDropdownOpen = false;
        this.modelDropdownOpen = false;
        this.cd.detectChanges();
      }
    }
  }

  onFileSelected(evt: Event): void {
    if (this.isView) return;
    const input = evt.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    this.handleFile(input.files[0]);
    input.value = '';
  }
  onDragOver(e: DragEvent): void { if (this.isView) return; e.preventDefault(); this.dragOver = true; }
  onDrop(e: DragEvent): void {
    if (this.isView) return;
    e.preventDefault(); this.dragOver = false;
    if (!e.dataTransfer || !e.dataTransfer.files.length) return;
    this.handleFile(e.dataTransfer.files[0]);
  }
  private handleFile(file: File) {
    const allowed = ['image/png', 'image/jpeg', 'image/webp'];
    this.fileError = '';
    if (!allowed.includes(file.type)) { this.fileError = 'type'; return; }
    if (file.size > 1.5 * 1024 * 1024) { this.fileError = 'size'; return; }
    this.form.patchValue({ image: file }, { emitEvent: false });
    this.imagePreview = URL.createObjectURL(file);
    this.currentFileName = file.name;
    this.currentFileSize = `${(file.size / 1024).toFixed(0)} KB`;
    this.cd.detectChanges();
  }
  removeImage(): void {
    if (this.isView) return;
    this.form.patchValue({ image: null }, { emitEvent: false });
    if (this.imagePreview) URL.revokeObjectURL(this.imagePreview);
    this.imagePreview = null; this.currentFileName = ''; this.currentFileSize = ''; this.fileError = '';
    if (this.fileInputRef?.nativeElement) this.fileInputRef.nativeElement.value = '';
    this.cd.detectChanges();
  }

  onSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const brandTextNow = (this.t('brand')?.value || '').toString().trim();
    const exactBrand = this.findBrandByName(brandTextNow);
    if (!exactBrand) {
      this.selectedBrandId = null;
      this.selectedModelId = null;
      this.modelDropdownOpen = false;
      this.cd.detectChanges();
      return;
    }
    this.selectedBrandId = exactBrand.id;
    const brandText = (this.t('brand')?.value || '').toString().trim();
    if (!this.selectedBrandId && brandText) {
      const b = this.findBrandByName(brandText);
      this.selectedBrandId = b?.id ?? null;
    }
    const modelText = (this.t('model')?.value || '').toString().trim();
    if (!this.selectedModelId && modelText) {
      const m = this.modelSuggestions.find(mm => mm.name.toLowerCase() === modelText.toLowerCase());
      this.selectedModelId = m?.id ?? null;
    }

    const v = this.form.value;
    const fractionQty = Number(v.initialInstallmentsCount ?? 0);
    const payload: CarFormData = {
      id: this.initialData?.id,
      brand: String(v.brand || '').trim(),
      model: String(v.model || '').trim(),
      color: String(v.color || '').trim(),
      price: +v.price,
      interestRate: +v.interestRate,
      vehicleInsurance: v.vehicleInsurance != null && v.vehicleInsurance !== '' ? +v.vehicleInsurance : 0,
      gps: v.gps != null && v.gps !== '' ? +v.gps : 0,
      monthlyInstallmentsCount: +v.monthlyInstallmentsCount,
      companyInitialAmount: +v.companyInitialAmount,
      partnerInitialAmount: +v.partnerInitialAmount,
      fractionate: fractionQty > 0,
      initialInstallmentsCount: fractionQty,
      image: (this.initialData as any)?.image?.isUrl ? (this.initialData as any).image : (v as any).image || null,
      paymentDate: v.paymentDate,
      status: !!v.status,
      partnerName: v.partnerName ?? null,
      memberId: (v.memberId !== undefined && v.memberId !== null && v.memberId !== '') ? Number(v.memberId) : null,
      brandId: this.selectedBrandId ?? null,
      modelId: this.selectedModelId ?? null
    };

    this.save.emit(payload);
  }

  onClose(): void { this.close.emit(); }
  @HostListener('document:keydown.escape') onEsc() { this.onClose(); }

  brandKeydown(e: KeyboardEvent): void {
    if (this.isView) return;
    const key = e.key;
    const len = this.brandSuggestions.length;
    if (key === 'ArrowDown') {
      if (!this.brandDropdownOpen) this.brandDropdownOpen = true;
      if (len > 0) this.brandActiveIndex = (this.brandActiveIndex + 1 + len) % len;
      e.preventDefault();
      e.stopPropagation();
    } else if (key === 'ArrowUp') {
      if (!this.brandDropdownOpen) this.brandDropdownOpen = true;
      if (len > 0) this.brandActiveIndex = (this.brandActiveIndex - 1 + len) % len;
      e.preventDefault();
      e.stopPropagation();
    } else if (key === 'Enter') {
      if (this.brandActiveIndex >= 0 && this.brandActiveIndex < len) {
        const item = this.brandSuggestions[this.brandActiveIndex];
        if (item) this.onSelectBrand(item);
        e.preventDefault();
        e.stopPropagation();
      } else if (this.showCreateBrand && this.brandDropdownOpen) {
        this.onCreateBrand();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }

  modelKeydown(e: KeyboardEvent): void {
    if (this.isView || !this.selectedBrandId) return;
    const key = e.key;
    const len = this.modelSuggestions.length;
    if (key === 'ArrowDown') {
      if (!this.modelDropdownOpen) this.modelDropdownOpen = true;
      if (len > 0) this.modelActiveIndex = (this.modelActiveIndex + 1 + len) % len;
      e.preventDefault();
      e.stopPropagation();
    } else if (key === 'ArrowUp') {
      if (!this.modelDropdownOpen) this.modelDropdownOpen = true;
      if (len > 0) this.modelActiveIndex = (this.modelActiveIndex - 1 + len) % len;
      e.preventDefault();
      e.stopPropagation();
    } else if (key === 'Enter') {
      if (this.modelActiveIndex >= 0 && this.modelActiveIndex < len) {
        const item = this.modelSuggestions[this.modelActiveIndex];
        if (item) this.onSelectModel(item);
        e.preventDefault();
        e.stopPropagation();
      } else if (this.showCreateModel && this.modelDropdownOpen) {
        this.onCreateModel();
        e.preventDefault();
        e.stopPropagation();
      }
    }
  }
}
