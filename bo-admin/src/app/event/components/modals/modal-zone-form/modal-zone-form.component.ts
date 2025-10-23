import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
@Component({
  standalone: true,
  selector: 'app-modal-zone-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-zone-form.component.html',
  styleUrls: ['./modal-zone-form.component.scss']
})
export class ModalZoneFormComponent implements OnInit {
  /**
   * Bloquea el pegado de valores con punto o coma en inputs numéricos enteros
   */
  blockPasteDot(event: ClipboardEvent): void {
    const paste = event.clipboardData?.getData('text') ?? '';
    if (paste.includes('.') || paste.includes(',')) {
      event.preventDefault();
    }
  }
  submitted = false;
  @Input() eventos: { id: number; name: string }[] = [];
  @Input() tiposEntrada: { id: number; label: string }[] = [];
  @Input() tiposAsiento: { id: number; label: string }[] = [];

  @Output() save = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  form!: FormGroup;

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {}
  /**
   * Bloquea la digitación de punto y coma en inputs numéricos enteros
   */
  blockDot(event: KeyboardEvent): void {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault();
    }
  }

  /**
   * Marca control como touched y formatea decimal en modals
   */
  onPriceBlur(event: FocusEvent, index: number, controlName: 'precio'|'precioUsd'): void {
    // Primero formatear el valor para evitar interferencias
    this.formatDecimal(event, index, controlName);
    const control = this.zonas.at(index).get(controlName);
    if (control) {
      // Marcar como touched y dirty después de formatear para forzar error inmediato
      control.markAsTouched();
      control.markAsDirty();
      // Recalcular estado de validación
      control.updateValueAndValidity({ onlySelf: true });
    }
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      eventoId: [null, Validators.required],
      tipoEntradaId: [null, Validators.required],
      zonas: this.fb.array([])
    });
    this.addZona(); // una zona por defecto
  }

  get zonas(): FormArray {
    return this.form.get('zonas') as FormArray;
  }

  addZona(): void {
    this.zonas.push(
      this.fb.group({
        tipoAsientoId: [null, Validators.required],
        nombre: ['', Validators.required],
        precio: [null, [Validators.required, Validators.min(0)]],
        precioUsd: [null, [Validators.required, Validators.min(0)]],
        aforo: [null, [Validators.required, Validators.min(1)]],
        asientos: [null, [Validators.required, Validators.min(1)]],
        expandido: [true]
      })
    );
    // Marcar solo los campos de las zonas anteriores como touched
    const zonasLength = this.zonas.length;
    this.zonas.controls.forEach((zona, idx) => {
      if (idx < zonasLength - 1) {
        (zona as FormGroup).markAllAsTouched();
      }
    });
  }

  removeZona(index: number): void {
    this.zonas.removeAt(index);
  }

  toggleExpand(index: number): void {
    const zona = this.zonas.at(index);
    zona.patchValue({ expandido: !zona.value.expandido });
  }

  /**
   * Prevent leading space in zone name
   */
  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }
  }

  /**
   * Normalize spaces in name (trim and collapse multiple spaces)
   */
  private normalizeName(name: string): string {
    return name.trim().replace(/\s+/g, ' ');
  }

  /**
   * Apply normalized name on blur
   */
  onZoneNameBlur(index: number): void {
    const control = this.zonas.at(index).get('nombre');
    if (control) {
      const normalized = this.normalizeName(control.value || '');
      control.setValue(normalized, { emitEvent: false });
    }
  }

  /**
   * Formatea valor de precio a 2 decimales
   */
  formatDecimal(event: FocusEvent, index: number, controlName: 'precio'|'precioUsd'): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
    if (value) {
      let num = parseFloat(value);
      if (!isNaN(num)) {
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
    }
  }

  /**
   * Detección de nombres duplicados
   */
  getDuplicatedZoneIndexes(): number[] {
    const names = this.zonas.controls.map(z => this.normalizeName(z.get('nombre')?.value || '').toLowerCase());
    const counts: Record<string, number[]> = {};
    names.forEach((name, idx) => {
      // Skip empty names (required validation handles blank)
      if (!name) {
        return;
      }
      counts[name] = counts[name] || [];
      counts[name].push(idx);
    });
    // Flatten indices arrays for names with more than one occurrence
    return Object.values(counts)
      .filter(arr => arr.length > 1)
      .reduce((acc, arr) => acc.concat(arr), [] as number[]);
  }

  /**
   * Indica si el nombre de la zona está duplicado
   */
  isZoneNameDuplicated(index: number): boolean {
    return this.getDuplicatedZoneIndexes().includes(index);
  }

  /**
   * Indica si hay duplicados en el formArray
   */
  get hasDuplicatedZoneNames(): boolean {
    return this.getDuplicatedZoneIndexes().length > 0;
  }

  onSave(): void {
    this.submitted = true;
    // Marcar controles del form principal
    this.form.get('eventoId')?.markAsTouched();
    this.form.get('tipoEntradaId')?.markAsTouched();
    // Marcar solo las zonas existentes (omitir la recién agregada) para mostrar errores
    this.zonas.controls.forEach((zona, idx) => {
      if (idx < this.zonas.length - 1) {
        (zona as FormGroup).markAllAsTouched();
      }
    });
    this.cd.markForCheck();
    if (this.form.invalid || this.hasDuplicatedZoneNames) {
      return;
    }
    this.save.emit(this.form.value);
  }

  onCloseClick(): void {
    this.close.emit();
  }
}
