import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidatorFn } from '@angular/forms';
import { PublicAuthService } from '../../../public-access/auth/services/public-auth.service';

type PurchaseLine = { zoneId: number; zoneName: string; quantity: number; unitPrice: number; subtotal: number; };
type PendingPurchasePayload = {
  eventId: string | number;
  eventName: string;
  eventType?: string;
  purchases: PurchaseLine[];
  totalSoles: number;
};

export type AttendeeFormValue = {
  docType: 'dni' | 'ce' | 'passport' | 'libAdol';
  docNumber: string;
  firstName: string;
  lastName: string;
};

@Component({
  selector: 'app-checkout-step-attendee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-step-attendee.component.html',
  styleUrl: './checkout-step-attendee.component.scss'
})
export class CheckoutStepAttendeeComponent implements OnChanges {
  @Input() payload: PendingPurchasePayload | null = null;
  @Output() validChange = new EventEmitter<boolean>();
  @Output() valueChange = new EventEmitter<AttendeeFormValue[]>();

  form = this.fb.group({
    attendees: this.fb.array<FormGroup>([])
  });

  zones: string[] = [];
  collapsed: boolean[] = [];

  constructor(private fb: FormBuilder, private publicAuth: PublicAuthService) {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('payload' in changes) {
      this.rebuildFromPayload();
    }
  }

  get attendeesFA(): FormArray<FormGroup> {
    return this.form.get('attendees') as FormArray<FormGroup>;
  }

  private rebuildFromPayload(): void {
    // limpiar
    this.attendeesFA.clear();
    this.zones = [];
    this.collapsed = [];

    // calcular cantidad total e hidratar zonas: 1 form por ticket
    const p = this.payload;
    if (!p || !Array.isArray(p.purchases)) return;

    // Primero calcular totales por etiqueta (zoneName o 'zone - package')
    const totals = new Map<string, number>();
    p.purchases.forEach(line => {
      const qty = Number(line.quantity) || 0;
      const entriesPer = Number((line as any).entriesPerPackage) || 1;
      const totalEntries = qty * entriesPer;
      const pkgName = (line as any).packageName ? String((line as any).packageName) : '';
      const baseZone = String(line.zoneName || 'Zona');
      const display = pkgName ? `${baseZone} - ${pkgName}` : baseZone;
      totals.set(display, (totals.get(display) || 0) + totalEntries);
    });

    // Contadores por etiqueta para numerar cada entrada dentro del paquete
    const counters = new Map<string, number>();
    p.purchases.forEach(line => {
      const qty = Number(line.quantity) || 0;
      const entriesPer = Number((line as any).entriesPerPackage) || 1;
      const totalEntries = qty * entriesPer;
      const pkgName = (line as any).packageName ? String((line as any).packageName) : '';
      const baseZone = String(line.zoneName || 'Zona');
      const displayBase = pkgName ? `${baseZone} - ${pkgName}` : baseZone;

      for (let i = 0; i < totalEntries; i++) {
        this.attendeesFA.push(this.makeAttendeeForm());
        const current = (counters.get(displayBase) || 0) + 1;
        counters.set(displayBase, current);
        const totalForDisplay = totals.get(displayBase) || totalEntries;
        // Formato: 'Zona 1 - paquete 1 (1/12)'
        const display = totalForDisplay > 1 ? `${displayBase} (${current}/${totalForDisplay})` : displayBase;
        this.zones.push(display);
        this.collapsed.push(this.attendeesFA.length > 1);
      }
    });

    // Prefill desde payload.attendees si existe
    const saved: AttendeeFormValue[] = (p as any).attendees || [];
    if (Array.isArray(saved) && saved.length) {
      this.attendeesFA.controls.forEach((grp, idx) => {
        const a = saved[idx];
        if (!a) return;
        grp.patchValue({
          docType: a.docType || 'dni',
          docNumber: a.docNumber || '',
          firstName: a.firstName || '',
          lastName: a.lastName || '',
        }, { emitEvent: false });
      });
    }

    // suscribir una sola vez
    this.form.valueChanges.subscribe(() => this.emitChanges());
    this.emitChanges();
  }

  private makeAttendeeForm(): FormGroup {
    const grp = this.fb.group({
      docType: ['dni', Validators.required],
      docNumber: this.fb.control('', {
        validators: [Validators.required, this.getDocValidator()],
        updateOn: 'blur'
      }),
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    // Cuando cambia el tipo de documento, reiniciar y revalidar el número
    grp.get('docType')?.valueChanges.subscribe(() => {
      const ctrl = grp.get('docNumber');
      ctrl?.reset();
      ctrl?.updateValueAndValidity();
    });
    return grp;
  }

  toggle(i: number): void {
    this.collapsed[i] = !this.collapsed[i];
  }

  private emitChanges(): void {
    // Regla personalizada: "todo o nada".
    // Si NO se ha completado ningún dato (docNumber/firstName/lastName) en ninguna fila,
    // permitimos avanzar (true). Si se ha completado al menos un dato en alguna fila,
    // entonces requerimos que todas las filas estén válidas.
    const total = this.attendeesFA.length;
    const controls = this.attendeesFA.controls as FormGroup[];

    const isGroupFilled = (grp: FormGroup) => {
      const docNumber = String(grp.get('docNumber')?.value || '').trim();
      const first = String(grp.get('firstName')?.value || '').trim();
      const last = String(grp.get('lastName')?.value || '').trim();
      return docNumber !== '' || first !== '' || last !== '';
    };

    const anyFilled = controls.some(g => isGroupFilled(g));
    const allValidWhenFilled = controls.every(g => g.valid);

    const valid = total > 0 ? (!anyFilled ? true : allValidWhenFilled) : false;

    this.validChange.emit(valid);
    this.valueChange.emit(this.attendeesFA.getRawValue() as AttendeeFormValue[]);
  }

  // --- Validadores y sanitización (mismos criterios que public-login) ---
  private getDocValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const parent = control.parent;
      const docType = parent?.get('docType')?.value;
      const value = control.value?.toString().trim() || '';
      if (!value) return null;
      switch (docType) {
        case 'dni':
          return /^[0-9]{8}$/.test(value) ? null : { docInvalid: 'DNI debe tener 8 dígitos' };
        default:
          return /^[A-Za-z0-9]{6,12}$/.test(value) ? null : { docInvalid: 'Formato inválido' };
      }
    };
  }

  handleDocKeydown(event: KeyboardEvent, grp: FormGroup): void {
    const input = event.target as HTMLInputElement;
    const key = event.key;
    const type = grp.get('docType')?.value;
    if (!key || key.length !== 1) return;
    if (type === 'dni') {
      if (!/[0-9]/.test(key) || input.value.length >= 8) {
        event.preventDefault();
      }
    } else {
      if (!/[A-Za-z0-9]/.test(key) || input.value.length >= 12) {
        event.preventDefault();
      }
    }
  }

  sanitizeDocNumber(event: Event, grp: FormGroup): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      const type = grp.get('docType')?.value;
      let v = input.value || '';
      v = type === 'dni' ? v.replace(/\D/g, '').slice(0, 8) : v.replace(/[^A-Za-z0-9]/g, '').slice(0, 12);
      input.value = v;
      grp.get('docNumber')?.setValue(v);
    }, 0);
  }

  trimSpaces(event: FocusEvent): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.trim().replace(/ {2,}/g, ' ');
  }

  getDocNumberErrorMessage(ctrl: AbstractControl | null): string {
    if (!ctrl) return '';
    const req = this.requiredError(ctrl, 'Este campo es obligatorio.');
    if (req) return req;
    if (ctrl.hasError('docInvalid')) return ctrl.getError('docInvalid');
    return '';
  }

  // Helper común para mensajes de requerido
  private requiredError(ctrl: AbstractControl, message: string): string | '' {
    return ctrl.hasError('required') ? message : '';
  }

  private isControlKey(key: string): boolean {
    return ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'].includes(key);
  }

  // Permitir solo letras (A-Z, a-z) y espacios controlados.
  // firstName: puede tener múltiples nombres (varios espacios únicos)
  // lastName: solo dos apellidos (máximo un espacio en total)
  handleNameKeydown(event: KeyboardEvent, grp: FormGroup, controlName: 'firstName' | 'lastName'): void {
    const key = event.key ?? '';
    const code = (event as KeyboardEvent).code || '';
    if (this.isControlKey(key) || key.length !== 1) return;
    const isSpace = key === ' ' || key === 'Spacebar' || code === 'Space';
    if (isSpace) {
      const input = event.target as HTMLInputElement;
      const cursorPos = input.selectionStart ?? 0;
      const val = input.value || '';
      // No permitir espacio al inicio ni espacios dobles consecutivos
      if (cursorPos === 0 || val.charAt(cursorPos - 1) === ' ') {
        event.preventDefault();
        return;
      }
      if (controlName === 'lastName') {
        // En apellidos, permitir máximo un espacio total
        const current = (grp.get(controlName)?.value || '').toString();
        const hasSpace = current.includes(' ');
        if (hasSpace) {
          event.preventDefault();
          return;
        }
      }
      return;
    }
    if (!/[A-Za-z]/.test(key)) {
      event.preventDefault();
    }
  }

  // Sanitiza pegado/entrada: solo letras y espacios; colapsa múltiples y recorta extremos
  sanitizeName(event: Event, grp: FormGroup, controlName: 'firstName' | 'lastName'): void {
    const input = event.target as HTMLInputElement;
    setTimeout(() => {
      let v = input.value || '';
      v = v.replace(/[^A-Za-z ]/g, '');
      if (event instanceof ClipboardEvent) {
        // En pegado: limpiar y normalizar por completo
        v = v.trim().replace(/ {2,}/g, ' ');
      } else {
        // En tipeo: no quitar espacio final recién ingresado; solo colapsar dobles internos
        v = v.replace(/ {2,}/g, ' ');
      }
      if (controlName === 'lastName') {
        // Forzar máximo 2 palabras
        const parts = v.split(' ').filter(Boolean);
        if (parts.length > 2) v = parts.slice(0, 2).join(' ');
      }
      input.value = v;
      grp.get(controlName)?.setValue(v);
    }, 0);
  }

  getFirstNameErrorMessage(ctrl: AbstractControl | null): string {
  if (!ctrl) return '';
  return this.requiredError(ctrl, 'El nombre es obligatorio.');
  }

  getLastNameErrorMessage(ctrl: AbstractControl | null): string {
  if (!ctrl) return '';
  return this.requiredError(ctrl, 'Los apellidos son obligatorios.');
  }
}
