import { FormControl, AbstractControl } from '@angular/forms';
import { Component, Input, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventTypeService } from 'src/app/event/services/event-type.service';
import { EventType } from 'src/app/event/models/event-type.model';
import { EntryTypeService } from 'src/app/event/services/entry-type.service';
import { EntryType } from 'src/app/event/models/entry-type.model';
import { EventVenueService } from 'src/app/event/services/event-venue.service';
import { EventVenue } from 'src/app/event/models/event-venue.model';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  // Devuelve true si el tipo de evento seleccionado es "Virtual"
  get isVirtualEvent(): boolean {
    const selectedTypeId = this.formGroup.get('eventType')?.value;
    const selectedType = this.eventTypes?.find((t: EventType) => t.eventTypeId === +selectedTypeId);
    return selectedType ? selectedType.eventTypeName.toLowerCase() === 'virtual' : false;
  }
  eventStatusOptions = [
    { value: 'activo', label: 'Activo' },
    { value: 'inactivo', label: 'Inactivo' },
    { value: 'cancelado', label: 'Cancelado' },
    { value: 'pasado', label: 'Pasado' },
    { value: 'en_curso', label: 'En curso' }
  ];
  @Input() formGroup!: FormGroup;
  @Input() isMainEvent: boolean = false;
  @Input() flyerUrl: string | null = null;
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  invalidFlyer: File | null = null;
  flyerPreviewURL: string | null = null;
  eventTypes: EventType[] = [];
  entryTypes: EntryType[] = [];
  eventVenues: EventVenue[] = [];
  flyerDragOver = false;
  pendingFlyerFile: File | null = null;

  constructor(
    private eventTypeService: EventTypeService,
    private cd: ChangeDetectorRef,
    private entryTypeService: EntryTypeService,
    private eventVenueService: EventVenueService
  ) { }

  ngOnInit() {
    // Si hay flyerUrl y no hay archivo seleccionado, setea el control 'flyer' con un objeto especial para que el template lo detecte
    if (this.flyerUrl && !this.formGroup.get('flyer')?.value) {
      // Simula un archivo virtual solo para la vista previa
      this.formGroup.patchValue({ flyer: { name: 'Flyer actual', url: this.flyerUrl, isUrl: true } });
      this.flyerPreviewURL = this.flyerUrl;
    }
    this.eventTypeService.getAll().subscribe(types => {
      this.eventTypes = types.filter(t => t.status);
      this.cd.detectChanges();
      // Forzar actualización del campo eventType para que el summary-card muestre el nombre
      const eventTypeCtrl = this.formGroup.get('eventType');
      if (eventTypeCtrl && eventTypeCtrl.value) {
        eventTypeCtrl.setValue(eventTypeCtrl.value, { emitEvent: true });
      }
    });
    this.entryTypeService.getAll().subscribe(types => {
      this.entryTypes = types.filter(t => t.status);
      this.cd.detectChanges();
      // Forzar actualización del campo entryType para que el summary-card muestre el nombre
      const entryTypeCtrl = this.formGroup.get('entryType');
      if (entryTypeCtrl && entryTypeCtrl.value) {
        entryTypeCtrl.setValue(entryTypeCtrl.value, { emitEvent: true });
      }
    });
    this.eventVenueService.getAll().subscribe(venues => {
      this.eventVenues = venues.filter(v => v.status);
      this.cd.detectChanges();

      // Lógica para cargar ciudad y dirección al editar
      const venueId = this.formGroup.get('venue')?.value;
      const city = this.formGroup.get('city')?.value;
      const address = this.formGroup.get('address')?.value;
      if (venueId && (!city || !address)) {
        const selected = this.eventVenues.find(v => v.venueId === +venueId);
        if (selected) {
          this.formGroup.patchValue({ city: selected.city, address: selected.address }, { emitEvent: false });
        }
      }
      // Forzar actualización del campo venue para que el summary-card muestre el nombre
      const venueCtrl = this.formGroup.get('venue');
      if (venueCtrl && venueCtrl.value) {
        venueCtrl.setValue(venueCtrl.value, { emitEvent: true });
      }
    });
    this.formGroup.get('venue')?.valueChanges.subscribe(id => {
      const selected = this.eventVenues.find(v => v.venueId === +id);
      if (selected) {
        this.formGroup.patchValue({ city: selected.city, address: selected.address }, { emitEvent: false });
      } else if (id === '' || id == null) {
        // Si se selecciona "Seleccione uno", limpiar ciudad y dirección
        this.formGroup.patchValue({ city: '', address: '' }, { emitEvent: false });
      }
    });
    this.applyDefaultValidators();
    // Reglas según tipo de evento virtual/presencial
    this.formGroup.get('eventType')?.valueChanges.subscribe(val => {
      const selectedType = this.eventTypes.find(t => t.eventTypeId === +val);
      const typeName = selectedType?.eventTypeName.toLowerCase() || '';
      if (typeName === 'virtual') {
        // Deshabilitar venue, ciudad y dirección
        this.formGroup.get('venue')?.disable({ emitEvent: false });
        this.formGroup.get('city')?.disable({ emitEvent: false });
        this.formGroup.get('address')?.disable({ emitEvent: false });
        // Habilitar link y limpiar otros
        this.formGroup.get('eventLink')?.enable({ emitEvent: false });
        this.formGroup.patchValue({ venue: '', city: '', address: '' }, { emitEvent: false });
        // Validación condicional: link obligatorio, venue no requerido
        const linkCtrl = this.formGroup.get('eventLink');
        linkCtrl?.setValidators([
          Validators.required,
          this.noSpacesValidator
        ]);
        linkCtrl?.updateValueAndValidity({ emitEvent: false });
        const venueCtrl = this.formGroup.get('venue');
        venueCtrl?.clearValidators();
        venueCtrl?.updateValueAndValidity({ emitEvent: false });
        this.cd.detectChanges();
      } else {
        // Habilitar venue, ciudad y dirección
        this.formGroup.get('venue')?.enable({ emitEvent: false });
        this.formGroup.get('city')?.enable({ emitEvent: false });
        this.formGroup.get('address')?.enable({ emitEvent: false });
        // Deshabilitar link y limpiar
        this.formGroup.get('eventLink')?.disable({ emitEvent: false });
        this.formGroup.patchValue({ eventLink: '', venue: '' }, { emitEvent: false });
        // Validación condicional: venue obligatorio, link no requerido
        const venueCtrl2 = this.formGroup.get('venue');
        venueCtrl2?.setValidators([Validators.required]);
        venueCtrl2?.updateValueAndValidity({ emitEvent: false });
        const linkCtrl2 = this.formGroup.get('eventLink');
        linkCtrl2?.clearValidators();
        linkCtrl2?.updateValueAndValidity({ emitEvent: false });
      }
    });
    // Inicializar estado según valor actual de eventType
    const initialType = this.formGroup.get('eventType')?.value;
    this.formGroup.get('eventType')?.setValue(initialType, { emitEvent: true });

    const start = this.formGroup.get('timeStart');
    const end = this.formGroup.get('timeEnd');

    // Asegura que el control flyer exista
    if (!this.formGroup.get('flyer')) {
      // Hacer flyer requerido
      this.formGroup.addControl('flyer', new FormControl(null, Validators.required));
    }

    // Validador personalizado para hora fin mayor a hora inicio
    this.formGroup.setValidators((control) => {
      const allDay = control.get('allDay')?.value;
      const startValue = control.get('timeStart')?.value;
      const endValue = control.get('timeEnd')?.value;
      if (allDay) {
        if (startValue !== '00:00' || endValue !== '23:59') {
          return { allDayTime: true };
        }
        return null;
      }
      if (!startValue || !endValue) return null;
      if (endValue <= startValue) {
        return { timeOrder: true };
      }
      return null;
    });

    // Cambiar valores de hora cuando cambia allDay
    this.formGroup.get('allDay')?.valueChanges.subscribe((allDay: boolean) => {
      if (allDay) {
        this.formGroup.patchValue({ timeStart: '00:00', timeEnd: '23:59' }, { emitEvent: false });
      }
    });

    // Inicializar valores de hora según el valor inicial de allDay o rango completo
    const initialStart = this.formGroup.get('timeStart')?.value;
    const initialEnd = this.formGroup.get('timeEnd')?.value;
    const shouldAllDay = (initialStart === '00:00' && initialEnd === '23:59') || this.formGroup.get('allDay')?.value;
    if (shouldAllDay) {
      // Marca checkbox allDay y ajusta horas si corresponde
      this.formGroup.get('allDay')?.setValue(true, { emitEvent: false });
      this.formGroup.patchValue({ timeStart: '00:00', timeEnd: '23:59' }, { emitEvent: false });
    }
    start?.setValidators([Validators.required]);
    end?.setValidators([Validators.required]);
    start?.updateValueAndValidity({ emitEvent: false });
    end?.updateValueAndValidity({ emitEvent: false });
    this.formGroup.updateValueAndValidity({ emitEvent: false });
  }

  // Update flyer handlers to always store file and show its size even when exceeding limit
  onFlyerSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // Validación de tipo
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      const flyerControl = this.formGroup.get('flyer')!;
      this.pendingFlyerFile = file;
      if (!allowedTypes.includes(file.type)) {
        this.invalidFlyer = null;
        flyerControl.setErrors({ invalidType: true });
        flyerControl.markAsTouched();
        flyerControl.markAsDirty();
        flyerControl.updateValueAndValidity();
        if (this.fileInputRef?.nativeElement) {
          this.fileInputRef.nativeElement.value = '';
        }
        return;
      }
      if (file.size > 1.2 * 1024 * 1024) {
        this.invalidFlyer = file;
        flyerControl.setErrors({ maxSize: true });
        flyerControl.markAsTouched();
        flyerControl.markAsDirty();
        flyerControl.updateValueAndValidity();
        if (this.fileInputRef?.nativeElement) {
          this.fileInputRef.nativeElement.value = '';
        }
        return;
      }
      // Si pasa ambos filtros, actualizar flyer
      this.invalidFlyer = null;
      this.formGroup.patchValue({ flyer: file });
      this.flyerPreviewURL = URL.createObjectURL(file);
      flyerControl.setErrors(null);
      flyerControl.updateValueAndValidity();
    } else {
      // Si se borra el archivo, pero hay flyerUrl, restaurar el virtual
      if (this.flyerUrl) {
        this.formGroup.patchValue({ flyer: { name: 'Flyer actual', url: this.flyerUrl, isUrl: true } });
        this.flyerPreviewURL = this.flyerUrl;
      }
    }
  }

  // Maneja arrastrar y soltar
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.flyerDragOver = false; // Siempre restablecer el estado visual al soltar
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
      const flyerControl = this.formGroup.get('flyer')!;
      // Primero validar tipo
      this.pendingFlyerFile = file;
      if (!allowedTypes.includes(file.type)) {
        this.invalidFlyer = null;
        flyerControl.setErrors({ invalidType: true });
        flyerControl.markAsTouched();
        flyerControl.markAsDirty();
        flyerControl.updateValueAndValidity();
        this.flyerDragOver = false;
        return;
      }
      if (file.size > 1.2 * 1024 * 1024) {
        this.invalidFlyer = file;
        flyerControl.setErrors({ maxSize: true });
        flyerControl.markAsTouched();
        flyerControl.markAsDirty();
        flyerControl.updateValueAndValidity();
        this.flyerDragOver = false;
        return;
      }
      // Si pasa ambos filtros, actualizar flyer
      this.invalidFlyer = null;
      this.formGroup.patchValue({ flyer: file });
      this.flyerPreviewURL = URL.createObjectURL(file);
      flyerControl.setErrors(null);
      flyerControl.updateValueAndValidity();
    }
  }

  // Quitar flyer y limpiar vista previa
  removeFlyer(): void {
    const flyerControl = this.formGroup.get('flyer')!;
    this.formGroup.patchValue({ flyer: null });
    this.invalidFlyer = null;
    if (this.flyerPreviewURL && typeof this.flyerPreviewURL !== 'string') {
      URL.revokeObjectURL(this.flyerPreviewURL);
    }
    this.flyerPreviewURL = null;
    // Si hay flyerUrl, restaurar el virtual
    if (this.flyerUrl) {
      this.formGroup.patchValue({ flyer: { name: 'Flyer actual', url: this.flyerUrl, isUrl: true } });
      this.flyerPreviewURL = this.flyerUrl;
    } else {
      flyerControl.setErrors({ required: true });
    }
    flyerControl.markAsTouched();
    flyerControl.markAsDirty();
    // Limpiar valor del input file para permitir re-subir el mismo fichero
    if (this.fileInputRef && this.fileInputRef.nativeElement) {
      this.fileInputRef.nativeElement.value = '';
    }
    flyerControl.updateValueAndValidity();
  }

  // Validador: no permite espacios y debe tener un punto con al menos 2 caracteres antes y después
  noSpacesValidator(control: AbstractControl) {
    const value = control.value || '';
    if (/\s/.test(value)) {
      return { noSpaces: true };
    }
    // Validar punto con mínimo 2 caracteres antes y después
    const match = value.match(/^(.*)\.(.*)$/);
    if (!match || match[1].length < 2 || match[2].length < 2) {
      return { invalidDot: true };
    }
    return null;
  }

  private applyDefaultValidators(): void {
    const config: { [key: string]: any[] } = {
      name: [Validators.required, Validators.maxLength(100)],
      eventType: [Validators.required],
      entryType: [Validators.required],
      venue: [Validators.required],
      description: [Validators.required, Validators.maxLength(1000)],
      date: [Validators.required],
      presenter: [Validators.maxLength(100)]
    };

    Object.entries(config).forEach(([key, validators]) => {
      const control = this.formGroup.get(key);
      if (control && (!control.validator || !control.validator({} as any))) {
        control.setValidators(validators);
        control.updateValueAndValidity({ emitEvent: false });
      }
    });
  }


  // Prevent typing a space at the beginning of the field
  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (event.key === ' ' && input.selectionStart === 0) {
      event.preventDefault();
    }
  }

  // Prevent typing two consecutive spaces
  preventDoubleSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const pos = input.selectionStart || 0;
    if (event.key === ' ' && pos > 0 && input.value.charAt(pos - 1) === ' ') {
      event.preventDefault();
    }
  }

  // Permitir enter solo en textarea de descripción
  allowEnterOnlyInDescription(event: KeyboardEvent): void {
    const input = event.target as HTMLTextAreaElement;
    if (input && input.getAttribute('formControlName') === 'description') {
      // Permitir enter
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  // Prevent pasting segments of 30+ chars without space, slash or colon
  preventLongSegmentOnPaste(event: ClipboardEvent): void {
    const paste = event.clipboardData?.getData('text') || '';
    const segments = paste.split(/[\s\/:]+/);
    if (segments.some(seg => seg.length >= 30)) {
      event.preventDefault();
    }
  }

  // Prevent typing segments of 30+ chars without space, slash or colon
  preventLongSegmentOnType(event: KeyboardEvent): void {
    const key = event.key;
    if (key.length !== 1) return; // solo caracteres imprimibles
    if (/[\s\/:]/.test(key)) return; // separadores permitidos
    const input = event.target as HTMLInputElement;
    const pos = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? pos;
    const value = input.value;
    const newValue = value.slice(0, pos) + key + value.slice(end);
    const segments = newValue.split(/[\s\/:]+/);
    if (segments.some(seg => seg.length >= 30)) {
      event.preventDefault();
    }
  }

  // Evita que se pueda digitar espacio en el campo eventLink
  preventSpace(event: KeyboardEvent) {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  onFlyerDragOver(state: boolean) {
    this.flyerDragOver = state;
  }
}
