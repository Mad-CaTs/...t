import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges,
  ChangeDetectorRef, ElementRef, HostListener, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

export interface Partner { id: number; fullName: string; }
export interface CarLite { id: number; title: string; priceUsd: number; }
export abstract class PartnerService { abstract searchByName(q: string): any; }
export abstract class CarCatalogService { abstract search(q: string): any; }

export interface ScheduleInitialData {
  id?: number;
  partnerId?: number | null;
  partnerName?: string | null;
  carId?: number | null;
  carTitle?: string | null;
  priceUsd?: number | null;
  monthlyBonusUsd?: number | null;
  installments?: number | null;
  gpsUsd?: number | null;
  insuranceUsd?: number | null;
  soatUsd?: number | null;
}

export interface SchedulePayload {
  id?: number;
  partnerId: number | null;
  partnerName: string;
  carId: number | null;
  carTitle: string;
  priceUsd: number;
  monthlyBonusUsd: number;
  installments: number;
  gpsUsd: number;
  insuranceUsd: number;
  soatUsd: number;
}

@Component({
  selector: 'app-car-schedule-update-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './car-schedule-modal.component.html',
  styleUrls: ['./car-schedule-modal.component.scss']
})
export class CarScheduleModalComponent implements OnInit, OnChanges {
  @Input() initialData?: ScheduleInitialData | null;
  @Input() showShell = true;

  @Output() save = new EventEmitter<SchedulePayload>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  partnerSuggestions: Partner[] = [];
  selectedPartnerId: number | null = null;
  partnerDropdownOpen = false;
  partnerActiveIndex = -1;

  carSuggestions: CarLite[] = [];
  selectedCarId: number | null = null;
  carDropdownOpen = false;
  carActiveIndex = -1;

  private fb = inject(FormBuilder);
  private cd = inject(ChangeDetectorRef);
  private host = inject(ElementRef<HTMLElement>);
  private partnerSvc = inject<PartnerService>(PartnerService as any, { optional: true });
  private carSvc = inject<CarCatalogService>(CarCatalogService as any, { optional: true });

  ngOnInit(): void {
    this.form = this.fb.group({
      partnerName: ['', [Validators.required, Validators.pattern(/\S+/)]],
      carTitle:    ['', [Validators.required, Validators.pattern(/\S+/)]],
      priceUsd:    [{ value: 0, disabled: true }],
      monthlyBonusUsd: [0, [Validators.min(0)]],
      installments:    [1, [Validators.min(1), Validators.pattern(/^\d+$/)]],
      gpsUsd:          [0, [Validators.min(0)]],
      insuranceUsd:    [0, [Validators.min(0)]],
      soatUsd:         [0, [Validators.min(0)]],
    });

    this.applyInitialData();
    this.setupPartnerListener();
    this.setupCarListener();
  }

  ngOnChanges(ch: SimpleChanges): void {
    if (ch['initialData'] && !ch['initialData'].firstChange) this.applyInitialData();
  }

  private applyInitialData(): void {
    const d = this.initialData ?? {};
    this.form?.reset({
      partnerName: d.partnerName ?? '',
      carTitle:    d.carTitle ?? '',
      priceUsd:    d.priceUsd ?? 0,
      monthlyBonusUsd: d.monthlyBonusUsd ?? 0,
      installments:    d.installments ?? 1,
      gpsUsd:          d.gpsUsd ?? 0,
      insuranceUsd:    d.insuranceUsd ?? 0,
      soatUsd:         d.soatUsd ?? 0
    }, { emitEvent: false });

    this.selectedPartnerId = d.partnerId ?? null;
    this.selectedCarId = d.carId ?? null;
  }

  private setupPartnerListener(): void {
    this.t('partnerName')?.valueChanges.pipe(
      debounceTime(250), distinctUntilChanged(),
      tap((raw: string) => {
        const v = (raw || '').trim();
        if (!v) { this.partnerSuggestions = []; this.selectedPartnerId = null; this.partnerDropdownOpen = true; this.cd.detectChanges(); return; }
        this.partnerDropdownOpen = true;
      }),
      switchMap((raw: string) => {
        const q = (raw || '').trim();
        if (!q || !this.partnerSvc) return of({ data: [] as Partner[] });
        return this.partnerSvc.searchByName(q).pipe(catchError(() => of({ data: [] })));
      })
    ).subscribe((res: any) => {
      const list: Partner[] = res?.data ?? [];
      const term = (this.t('partnerName')?.value || '').toString().trim().toLowerCase();
      const exact = list.find(p => p.fullName.toLowerCase() === term);
      this.partnerSuggestions = list.slice(0, 20);
      this.selectedPartnerId = exact?.id ?? null;
      this.partnerActiveIndex = -1;
      this.cd.detectChanges();
    });
  }
  onPartnerFocus(){ this.partnerDropdownOpen = true; this.partnerActiveIndex = -1; this.cd.detectChanges(); }
  onPartnerInput(){ this.partnerDropdownOpen = true; }
  togglePartnerDropdown(){ this.partnerDropdownOpen = !this.partnerDropdownOpen; this.partnerActiveIndex = -1; this.cd.detectChanges(); }
  onSelectPartner(p: Partner){
    this.form.patchValue({ partnerName: p.fullName }, { emitEvent: false });
    this.selectedPartnerId = p.id;
    this.partnerDropdownOpen = false;
    this.partnerActiveIndex = -1;
    this.cd.detectChanges();
  }
  partnerKeydown(e: KeyboardEvent){
    if (!this.partnerDropdownOpen) return;
    const len = this.partnerSuggestions.length;
    if (e.key === 'ArrowDown'){ if (len) this.partnerActiveIndex = (this.partnerActiveIndex + 1 + len) % len; e.preventDefault(); }
    else if (e.key === 'ArrowUp'){ if (len) this.partnerActiveIndex = (this.partnerActiveIndex - 1 + len) % len; e.preventDefault(); }
    else if (e.key === 'Enter'){
      if (this.partnerActiveIndex >= 0 && this.partnerActiveIndex < len) this.onSelectPartner(this.partnerSuggestions[this.partnerActiveIndex]);
      e.preventDefault();
    }
  }

  private setupCarListener(): void {
    this.t('carTitle')?.valueChanges.pipe(
      debounceTime(250), distinctUntilChanged(),
      tap((raw: string) => {
        const v = (raw || '').trim();
        if (!v) { this.carSuggestions = []; this.selectedCarId = null; this.carDropdownOpen = true; this.cd.detectChanges(); return; }
        this.carDropdownOpen = true;
      }),
      switchMap((raw: string) => {
        const q = (raw || '').trim();
        if (!q || !this.carSvc) return of({ data: [] as CarLite[] });
        return this.carSvc.search(q).pipe(catchError(() => of({ data: [] })));
      })
    ).subscribe((res: any) => {
      const list: CarLite[] = res?.data ?? [];
      const term = (this.t('carTitle')?.value || '').toString().trim().toLowerCase();
      const exact = list.find(c => c.title.toLowerCase() === term);
      this.carSuggestions = list.slice(0, 20);
      this.selectedCarId = exact?.id ?? null;
      if (exact) this.form.patchValue({ priceUsd: exact.priceUsd }, { emitEvent: false });
      this.carActiveIndex = -1;
      this.cd.detectChanges();
    });
  }
  onCarFocus(){ this.carDropdownOpen = true; this.carActiveIndex = -1; this.cd.detectChanges(); }
  onCarInput(){ this.carDropdownOpen = true; }
  toggleCarDropdown(){ this.carDropdownOpen = !this.carDropdownOpen; this.carActiveIndex = -1; this.cd.detectChanges(); }
  onSelectCar(c: CarLite){
    this.form.patchValue({ carTitle: c.title, priceUsd: c.priceUsd }, { emitEvent: false });
    this.selectedCarId = c.id;
    this.carDropdownOpen = false;
    this.carActiveIndex = -1;
    this.cd.detectChanges();
  }
  carKeydown(e: KeyboardEvent){
    if (!this.carDropdownOpen) return;
    const len = this.carSuggestions.length;
    if (e.key === 'ArrowDown'){ if (len) this.carActiveIndex = (this.carActiveIndex + 1 + len) % len; e.preventDefault(); }
    else if (e.key === 'ArrowUp'){ if (len) this.carActiveIndex = (this.carActiveIndex - 1 + len) % len; e.preventDefault(); }
    else if (e.key === 'Enter'){
      if (this.carActiveIndex >= 0 && this.carActiveIndex < len) this.onSelectCar(this.carSuggestions[this.carActiveIndex]);
      e.preventDefault();
    }
  }

  t(name: string){ return this.form.get(name); }
  blockNumberKeys(ev: KeyboardEvent, allowDecimal = true){
    const invalid = allowDecimal ? ['e','E','+','-'] : ['e','E','+','-','.'];
    if (invalid.includes(ev.key)) ev.preventDefault();
  }
  disableWheel(ev: WheelEvent){ (ev.target as HTMLElement).blur(); }

  onSave(){
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const v = this.form.value;
    const payload: SchedulePayload = {
      id: this.initialData?.id,
      partnerId: this.selectedPartnerId ?? null,
      partnerName: (v.partnerName || '').toString().trim(),
      carId: this.selectedCarId ?? null,
      carTitle: (v.carTitle || '').toString().trim(),
      priceUsd: +v.priceUsd || 0,
      monthlyBonusUsd: +v.monthlyBonusUsd || 0,
      installments: +v.installments || 1,
      gpsUsd: +v.gpsUsd || 0,
      insuranceUsd: +v.insuranceUsd || 0,
      soatUsd: +v.soatUsd || 0
    };
    this.save.emit(payload);
  }

  onClose(){ this.close.emit(); }

  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent){
    if (!this.host?.nativeElement.contains(ev.target as Node)) {
      this.partnerDropdownOpen = false; this.carDropdownOpen = false;
      this.partnerActiveIndex = -1; this.carActiveIndex = -1;
      this.cd.detectChanges();
    }
  }
  onFormFocus(ev: FocusEvent){
    const el = ev.target as HTMLElement;
    const isPartner = el.getAttribute('formcontrolname') === 'partnerName';
    const isCar = el.getAttribute('formcontrolname') === 'carTitle';
    if (!isPartner && !isCar && (this.partnerDropdownOpen || this.carDropdownOpen)){
      this.partnerDropdownOpen = false; this.carDropdownOpen = false; this.cd.detectChanges();
    }
  }

  trackById(_: number, item: any){ return item?.id ?? _; }
}
