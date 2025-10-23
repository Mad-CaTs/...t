import {
  Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { BonusHistoryService } from '@app/manage-prize/services/bonus-type/bonus-car/bonus-history.service';

export type BonusFormMode = 'create' | 'edit' | 'view';

export interface BonusInitialData {
  id?: string;
  rankId?: number | null;
  monthlyAssignedUsd?: number | null;
  bonusPriceUsd?: number | null;
  initialAssignedUsd?: number | null;
  issueDate?: string | null;  // YYYY-MM-DD
  dueDate?: string | null;    // YYYY-MM-DD
}

export interface BonusPayload {
  id?: string;
  rankId: number;      // se envía el ID del rango
  rankName?: string;   // opcional para UI/logs
  monthlyAssignedUsd: number;
  bonusPriceUsd: number;
  initialAssignedUsd: number;
  issueDate: string;
  dueDate: string;
}

@Component({
  selector: 'app-bonus-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bonus-modal.component.html',
  styleUrls: ['./bonus-modal.component.scss']
})
export class BonusModalComponent implements OnInit, OnChanges {
  @Input() mode: BonusFormMode = 'create';
  @Input() initialData?: BonusInitialData | null;
  @Input() showShell = true;

  @Output() save = new EventEmitter<BonusPayload>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  // MOCK: Rangos (id + nombre)
  rankOptions = [{ id: 1, name: 'Bronce' },];

  constructor(private fb: FormBuilder,
    private _bonusHistoryService: BonusHistoryService,
    private cdr: ChangeDetectorRef
  ) { }

  // === Computados / helpers de UI ===
  get isView() { return this.mode === 'view'; }

  get computedTitle() {
    return this.mode === 'create' ? 'Crear nuevo bono'
      : this.mode === 'edit' ? 'Editar bono'
        : 'Detalle del bono';
  }
  get computedSubtitle() {
    return this.mode === 'create' ? 'Crea un nuevo bono'
      : this.mode === 'edit' ? 'Actualiza los datos del bono'
        : 'Consulta la información del bono';
  }
  get primaryButtonLabel() { return this.mode === 'create' ? 'Asignar' : 'Guardar'; }

  // === Ciclo de vida ===
  ngOnInit(): void {
    this.getRanges();
    const isView = this.isView;

    // Importante: definir disabled en creación para evitar el warning
    this.form = this.fb.group({
      rankId: [{ value: null, disabled: isView }, Validators.required],
      monthlyAssignedUsd: [{ value: 0, disabled: isView }, [Validators.required, Validators.min(0)]],
      bonusPriceUsd: [{ value: 0, disabled: isView }, [Validators.required, Validators.min(0)]],
      initialAssignedUsd: [{ value: 0, disabled: isView }, [Validators.required, Validators.min(0)]],
      issueDate: [{ value: '', disabled: isView }, Validators.required],
      dueDate: [{ value: '', disabled: isView }, [Validators.required, this.dateOrderValidator.bind(this)]]
    });

    this.applyInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialData'] && !changes['initialData'].firstChange) {
      this.applyInitialData();
    }
    if (changes['mode'] && !changes['mode'].firstChange && this.form) {
      // Habilitar/Deshabilitar desde TS (no en template)
      this.isView ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false });
      this.t('dueDate')?.updateValueAndValidity({ onlySelf: true });
    }
  }

  // === Setup inicial ===
  private applyInitialData(): void {
    const d = this.initialData ?? {};
    if (!this.form) return;

    this.form.reset({
      rankId: d.rankId ?? null,
      monthlyAssignedUsd: d.monthlyAssignedUsd ?? 0,
      bonusPriceUsd: d.bonusPriceUsd ?? 0,
      initialAssignedUsd: d.initialAssignedUsd ?? 0,
      issueDate: d.issueDate ?? '',
      dueDate: d.dueDate ?? ''
    }, { emitEvent: false });
  }

  // dueDate > issueDate
  private dateOrderValidator(ctrl: AbstractControl) {
    const due = ctrl.value as string;
    const issue = this.form?.get('issueDate')?.value as string;
    if (!due || !issue) return null;
    return new Date(due) > new Date(issue) ? null : { dateOrder: true };
  }

  // === Utilidades ===
  t(name: string) { return this.form.get(name); }

  blockNumberKeys(ev: KeyboardEvent, allowDecimal = true) {
    const invalid = allowDecimal ? ['e', 'E', '+', '-'] : ['e', 'E', '+', '-', '.'];
    if (invalid.includes(ev.key)) ev.preventDefault();
  }
  disableWheel(ev: WheelEvent) { (ev.target as HTMLElement).blur(); }

  // === Acciones ===
  onSave() {
    this.form.markAllAsTouched();
    this.t('dueDate')?.updateValueAndValidity();
    if (this.isView || this.form.invalid) return;

    const v = this.form.value;
    const id = Number(v.rankId);
    const name = this.rankOptions.find(r => r.id === id)?.name;

    const payload: BonusPayload = {
      id: this.initialData?.id,
      rankId: id,
      rankName: name,
      monthlyAssignedUsd: +v.monthlyAssignedUsd,
      bonusPriceUsd: +v.bonusPriceUsd,
      initialAssignedUsd: +v.initialAssignedUsd,
      issueDate: v.issueDate,
      dueDate: v.dueDate
    };
    this.save.emit(payload);
  }

  onClose() { this.close.emit(); }
  @HostListener('document:keydown.escape') onEsc() { this.onClose(); }

  getRanges() {
    this._bonusHistoryService.getRanges().subscribe({
      next: (res) => {
        this.rankOptions = res.data.map(range => ({ id: range.idRange, name: range.name }));
           this.cdr.detectChanges();
      },
      error: (error) => {
      
      }
    });
  }


}
