import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventZoneService } from 'src/app/event/services/event-zone.service';
import { EntryTypeService } from 'src/app/event/services/entry-type.service';
import { CreateEventService } from 'src/app/event/services/create-event.service';
import { Event } from 'src/app/event/models/event.model';
import { SeatTypeService } from 'src/app/event/services/seat-type.service';
import { SeatType } from 'src/app/event/models/seat-type.module';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ActivatedRoute, Router } from '@angular/router';
import { handleHttpError } from 'src/app/event/utils/handle-http-error.util';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({
  standalone: true,
  selector: 'app-form-zones-pricing',
  imports: [CommonModule, ReactiveFormsModule, ModalNotifyComponent],
  templateUrl: './form-zones-pricing.component.html',
  styleUrls: ['./form-zones-pricing.component.scss']
})
export class FormZonesPricingComponent implements OnInit {
  // --- Estado general ---
  submitted = false;
  eventId: string | null = null;
  eventIdNum: number | null = null;
  eventZoneId?: number;
  isEditMode = false;

  form!: FormGroup;
  loading = false;
  private loadingModalRef: NgbModalRef | null = null;

  seatTypes: SeatType[] = [];
  tiposEntrada: { id: number; label: string }[] = [];
  eventsList: Event[] = [];

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'error';

  private zonesToDelete = new Set<number>();
  private baselineHash = '';
  private lastHasChanges = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private eventZoneService: EventZoneService,
    private seatTypeService: SeatTypeService,
    private entryTypeService: EntryTypeService,
    private cd: ChangeDetectorRef,
    private createEventService: CreateEventService,
    private modalService: NgbModal
  ) {
    this.eventId = this.route.snapshot.paramMap.get('eventId');
    this.eventIdNum = this.eventId ? Number(this.eventId) : null;
    this.form = this.fb.group({
      eventoId: [{ value: null, disabled: true }, Validators.required],
      tipoEntradaId: [null, Validators.required],
      zonas: this.fb.array([])
    });
  }

  // --- Diagnostics helpers ---
  private listInvalidControls(): any {
    const out: any[] = [];
    const zonas = this.zonas;
    zonas.controls.forEach((ctrl, idx) => {
      const g = ctrl as FormGroup;
      Object.keys(g.controls).forEach(k => {
        const c = g.get(k);
        if (c && c.invalid) {
          out.push({ index: idx, field: k, errors: c.errors });
        }
      });
    });
    const tipoEntrada = this.form.get('tipoEntradaId');
    if (tipoEntrada?.invalid) out.push({ field: 'tipoEntradaId', errors: tipoEntrada.errors });
    return out;
  }

  get saveDisabled(): boolean {
    const disabled = this.loading || this.form.invalid || this.hasDuplicatedZoneNames || !this.hasChanges;
    if (disabled) {
    }
    return disabled;
  }

  get hasChanges(): boolean {
    const current = this.computeCurrentHash();
    const changed = current !== this.baselineHash;
    if (changed !== this.lastHasChanges) {
      this.lastHasChanges = changed;
    }
    return changed;
  }

  private computeCurrentHash(): string {
    const ticketTypeId = this.form.get('tipoEntradaId')?.value ?? null;
    const zonasNorm = this.zonas.controls.map(ctrl => {
      const g = ctrl as FormGroup;
      return {
        eventZoneId: g.get('eventZoneId')?.value ?? null,
        seatTypeId: Number(g.get('tipoAsientoId')?.value ?? null),
        zoneName: (g.get('nombre')?.value || '').toString().trim(),
        price: Number(g.get('precioUsd')?.value ?? null),
        priceSoles: Number(g.get('precio')?.value ?? null),
        capacity: Number(g.get('aforo')?.value ?? null),
        seats: Number(g.get('asientos')?.value ?? null)
      };
    });
    // Orden estable: primero por eventZoneId (existentes) luego por índice original
    const withIndex = zonasNorm.map((z, idx) => ({ ...z, __i: idx }));
    withIndex.sort((a, b) => {
      if (a.eventZoneId && b.eventZoneId) return a.eventZoneId - b.eventZoneId;
      if (a.eventZoneId && !b.eventZoneId) return -1;
      if (!a.eventZoneId && b.eventZoneId) return 1;
      return a.__i - b.__i;
    });
    const serialized = JSON.stringify({ ticketTypeId, zonas: withIndex.map(({ __i, ...rest }) => rest) });
    return serialized;
  }

  /** Fija el baseline actual (se llama tras cargar datos o tras guardar) */
  private setBaseline(): void {
    this.baselineHash = this.computeCurrentHash();
    this.lastHasChanges = false;
  }

  // ---------- Utils de UI ----------
  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
  }
  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }

  blockDot(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') event.preventDefault();
  }
  blockPasteDot(event: ClipboardEvent): void {
    const paste = event.clipboardData?.getData('text') ?? '';
    if (paste.includes('.') || paste.includes(',')) event.preventDefault();
  }
  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === ' ' && input.selectionStart === 0) event.preventDefault();
  }

  normalize(str: string): string {
    return str.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
  }
  getDuplicatedZoneIndexes(): number[] {
    const names = this.zonas.controls.map(z => this.normalize(z.get('nombre')?.value || ''));
    const counts: Record<string, number[]> = {};
    names.forEach((name, idx) => {
      if (!name) return;
      if (!counts[name]) counts[name] = [];
      counts[name].push(idx);
    });
    return Object.values(counts).filter(arr => arr.length > 1).reduce((acc, arr) => acc.concat(arr), []);
  }
  isZoneNameDuplicated(index: number): boolean {
    return this.getDuplicatedZoneIndexes().includes(index);
  }
  get hasDuplicatedZoneNames(): boolean {
    return this.getDuplicatedZoneIndexes().length > 0;
  }

  ngOnInit(): void {
    this.loading = true;
    this.showLoadingModal();

    this.form.statusChanges.subscribe(st => {
    });
    this.form.valueChanges.subscribe(() => {
      void this.hasChanges;
    });

    this.createEventService.getAll().subscribe({
      next: events => {
        this.eventsList = events;
        this.entryTypeService.getAll().subscribe({
          next: entryTypes => {
            this.tiposEntrada = entryTypes.map(e => ({ id: e.ticketTypeId, label: e.ticketTypeName }));
            this.seatTypeService.getAll().subscribe({
              next: seatTypes => {
                this.seatTypes = seatTypes;

                if (this.eventIdNum != null) {
                  // Intentar cargar zonas existentes => modo edición
                  this.eventZoneService.getById(this.eventIdNum).subscribe({
                    next: data => {

                      this.isEditMode = (data?.zones?.length ?? 0) > 0;
                      // Limpiar y precargar
                      this.zonas.clear();
                      this.zonesToDelete.clear();
                      data.zones.forEach((zona, index) => {

                        // Incluir eventZoneId en el form para diferenciar existentes/nuevas
                        this.zonas.push(this.fb.group({
                          eventZoneId: [zona.eventZoneId ?? null],
                          tipoAsientoId: [zona.seatTypeId, Validators.required],
                          nombre: [zona.zoneName, Validators.required],
                          precio: [zona.priceSoles, [Validators.required, Validators.min(0)]],
                          precioUsd: [zona.price, [Validators.required, Validators.min(0)]],
                          aforo: [zona.capacity, [Validators.required, Validators.min(0)]],
                          asientos: [zona.seats, [Validators.required, Validators.min(1)]],
                          expandido: [true]
                        }));
                      });

                      this.form.patchValue({
                        eventoId: data.eventId,
                        tipoEntradaId: data.ticketTypeId
                      });

                      this.eventZoneId = data.eventZoneId;
                      
                      this.loading = false;
                      this.cd.detectChanges();
                      this.hideLoadingModal();
                      this.setBaseline();
                    },
                    error: err => {
                      if (err?.status === 404) {
                        this.isEditMode = false;
                        this.form.patchValue({ eventoId: this.eventIdNum, tipoEntradaId: null });
                        this.loading = false;
                        this.cd.detectChanges();
                        this.hideLoadingModal();
                        return;
                      }

                      const notify = handleHttpError(err);
                      this.notifyTitle = notify.notifyTitle;
                      this.notifyMessage = notify.notifyMessage;
                      this.notifyType = notify.notifyType;
                      this.showNotify = true;
                      this.loading = false;
                      this.cd.detectChanges();
                      this.hideLoadingModal();
                    }
                  });
                } else {
                  this.loading = false;
                  this.hideLoadingModal();
                  this.setBaseline();
                }
              },
              error: err => this.raiseInitError(err)
            });
          },
          error: err => this.raiseInitError(err)
        });
      },
      error: err => this.raiseInitError(err)
    });
  }

  private raiseInitError(err: any) {
    const notify = handleHttpError(err);
    this.notifyTitle = notify.notifyTitle;
    this.notifyMessage = notify.notifyMessage;
    this.notifyType = notify.notifyType;
    this.showNotify = true;
    this.loading = false;
    this.cd.detectChanges();
    this.hideLoadingModal();
  }

  get eventNameSelected(): string {
    const id = this.form.get('eventoId')?.value;
    return this.eventsList.find(e => e.eventId === id)?.eventName || id;
  }

  onNotifyClose(): void {
    this.showNotify = false;
    this.router.navigate(['/dashboard/events/zones-pricing']);
  }

  get zonas(): FormArray {
    return this.form.get('zonas') as FormArray;
  }

  addZona(): void {
    this.zonas.push(
      this.fb.group({
        eventZoneId: [null],
        tipoAsientoId: [null, Validators.required],
        nombre: ['', Validators.required],
        precio: [null, [Validators.required, Validators.min(0)]],
        precioUsd: [null, [Validators.required, Validators.min(0)]],
          aforo: [null, [Validators.required, Validators.min(0)]],
        asientos: [null, [Validators.required, Validators.min(1)]],
        expandido: [true]
      })
    );

    // Marcar solo las anteriores como touched para forzar validación visual
    const zonasLength = this.zonas.length;
    this.zonas.controls.forEach((zona, idx) => {
      if (idx < zonasLength - 1) (zona as FormGroup).markAllAsTouched();
    });
  }

  removeZona(index: number): void {
    const group = this.zonas.at(index) as FormGroup;
    const existingId = group.get('eventZoneId')?.value as number | null;
    if (existingId) {
      this.zonesToDelete.add(existingId);
    }
    this.zonas.removeAt(index);
  }

  toggleExpand(index: number): void {
    const zona = this.zonas.at(index);
    zona.patchValue({ expandido: !zona.value.expandido });
  }

  formatDecimal(event: FocusEvent, index: number, controlName: 'precio' | 'precioUsd') {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    if (value === '' || value == null) return;

    let num = parseFloat(value);
    if (isNaN(num)) return;

    // Redondeo a la décima más cercana (y formateo .00)
    let entero = Math.floor(num);
    let decimal = num - entero;
    let dec = Math.round(decimal * 100);
    let decima = Math.floor(dec / 10) * 0.10;
    let residuo = dec % 10;
    if (residuo >= 5) decima += 0.10;

    let final = entero + decima;
    if (decima >= 1) { final = entero + 1; decima = 0; }
    const finalValue = final.toFixed(2);

    this.zonas.at(index).get(controlName)?.setValue(Number(finalValue), { emitEvent: false });
    input.value = finalValue;
  }

  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }
  onZoneNameBlur(index: number): void {
    const control = this.zonas.at(index).get('nombre');
    if (control) {
      const normalized = this.normalizeName(control.value || '');
      control.setValue(normalized, { emitEvent: false });
    }
  }

  guardarCambios(): void {
    this.submitted = true;
    this.zonas.controls.forEach(z => (z as FormGroup).markAllAsTouched());
    if (this.form.invalid) return;

    if (this.zonas.length === 0) {
      this.notifyTitle = 'Error';
      this.notifyMessage = 'Debe agregar al menos una zona antes de guardar.';
      this.notifyType = 'error';
      this.showNotify = true;
      this.cd.detectChanges();
      return;
    }

    if (this.eventIdNum == null) {
      this.notifyTitle = 'Error';
      this.notifyMessage = 'ID de evento no encontrado en la ruta.';
      this.notifyType = 'error';
      this.showNotify = true;
      this.cd.detectChanges();
      return;
    }

    this.showLoadingModal();

    const ticketTypeId = this.form.get('tipoEntradaId')?.value as number;

    // Construir zonas según modo:
    // - Si el formGroup tiene eventZoneId => zona existente (PUT con eventZoneId)
    // - Si eventZoneId es null => zona nueva (POST o PUT con ticketTypeId)
    const zones = this.zonas.controls.map(z => {
      const g = z as FormGroup;
      const existingId = g.get('eventZoneId')?.value as number | null;

      const common = {
        seatTypeId: Number(g.get('tipoAsientoId')?.value),
        zoneName: (g.get('nombre')?.value || '').toString().trim(),
        price: Number(g.get('precioUsd')?.value),
        priceSoles: Number(g.get('precio')?.value),
        capacity: Number(g.get('aforo')?.value),
        seats: Number(g.get('asientos')?.value)
      } as const;

      if (existingId) {
        return { eventZoneId: existingId, ...common };
      }
      return { ticketTypeId, ...common };
    });

    if (this.isEditMode) {
      const payload = {
        eventId: this.eventIdNum,
        ticketTypeId,
        zones,
        zonesToDelete: Array.from(this.zonesToDelete) // puede ser []
      };

      this.eventZoneService.updateByEventId(this.eventIdNum, payload as any).subscribe({
        next: () => {
          this.hideLoadingModal();
          this.zonesToDelete.clear();
          this.notifyTitle = '¡Guardado exitoso!';
          this.notifyMessage = 'Las zonas y tarifas se actualizaron correctamente.';
          this.notifyType = 'success';
          this.showNotify = true;
          this.cd.detectChanges();
          this.setBaseline();
        },
        error: err => {
          this.hideLoadingModal();
          const notify = handleHttpError(err);
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.notifyType = notify.notifyType;
          this.showNotify = true;
          this.cd.detectChanges();
        }
      });

    } else {
      // Crear (todas nuevas, ya llevan ticketTypeId a nivel item)
      this.eventZoneService.createEventZones(this.eventIdNum, ticketTypeId, zones as any).subscribe({
        next: () => {
          this.hideLoadingModal();
          this.notifyTitle = '¡Creado!';
          this.notifyMessage = 'Las zonas y tarifas se registraron correctamente.';
          this.notifyType = 'success';
          this.showNotify = true;
          this.cd.detectChanges();
          this.setBaseline();
        },
        error: err => {
          this.hideLoadingModal();
          const notify = handleHttpError(err);
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.notifyType = notify.notifyType;
          this.showNotify = true;
          this.cd.detectChanges();
        }
      });
    }
  }

  cancelar(): void {
    this.router.navigate(['/dashboard/events/zones-pricing']);
  }
}
