import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CreateEventService } from 'src/app/event/services/create-event.service';
import { EventTypeService } from 'src/app/event/services/event-type.service';
import { EntryTypeService } from 'src/app/event/services/entry-type.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventFormComponent, EventImagePreviewComponent, EventSummaryCardComponent } from './components';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { Router, ActivatedRoute } from '@angular/router';

import { handleHttpError } from '../../../utils/handle-http-error.util';

@Component({
  selector: 'app-form-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EventFormComponent,
    EventImagePreviewComponent,
    EventSummaryCardComponent,
    ModalNotifyComponent
  ],
  templateUrl: './form-event.component.html',
  styleUrls: ['./form-event.component.scss']
})
export class FormEventComponent implements OnInit {
  private notifyOnGetIdError = false;
  eventTypeName: string = '';
  entryTypeName: string = '';
  editMode: boolean = false;
  eventData: any = null;
  flyerUrl: string | null = null;

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  private loadingModalRef: NgbModalRef | null = null;

  // Form
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private eventService: CreateEventService,
    private eventTypeService: EventTypeService,
    private entryTypeService: EntryTypeService,
    private modalService: NgbModal,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      eventType: ['', Validators.required],
      entryType: ['', Validators.required],
      date: [''],
      timeStart: [''],
      timeEnd: [''],
      allDay: [false],
      isMain: [false],
      venue: ['', Validators.required],      // se deshabilita en el hijo cuando es virtual
      eventLink: [''],                       // se habilita en el hijo cuando es virtual
      city: [''],
      address: [''],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      presenter: [''],
      flyer: [null, Validators.required],
      eventStatus: ['', Validators.required]
    });
  }

  // Previene submit con Enter fuera de textarea
  onEnterKey(event: any): void {
    const target = event.target as HTMLElement;
    if (target.tagName.toLowerCase() !== 'textarea') {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.editMode = true;
      this.eventService.getById(+idParam).subscribe({
        next: (event) => {
          this.eventData = event;
          this.flyerUrl = event.flyerUrl || null;
          this.patchFormWithEvent();

          if (event.eventTypeId) {
            this.eventTypeService.getById(event.eventTypeId).subscribe((et: any) => {
              this.eventTypeName = et.eventTypeName;
              this.cd.detectChanges();
            });
          }
          if (event.ticketTypeId) {
            this.entryTypeService.getById(event.ticketTypeId).subscribe((en: any) => {
              this.entryTypeName = en.ticketTypeName;
              this.cd.detectChanges();
            });
          }
          this.cd.detectChanges();
        },
        error: (err) => {
          const notify = handleHttpError(err);
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.notifyType = notify.notifyType;
          this.showNotify = true;
          this.notifyOnGetIdError = true;
          this.cd.detectChanges();
        }
      });
    }

    // Actualiza nombre de tipo de evento para el preview y para el isVirtual()
    this.eventForm.get('eventType')?.valueChanges.subscribe(id => {
      if (id && +id > 0) {
        this.eventTypeService.getById(+id).subscribe((et: any) => {
          this.eventTypeName = et.eventTypeName || '';
          this.cd.detectChanges();
        });
      } else {
        this.eventTypeName = '';
        this.cd.detectChanges();
      }
    });

    // Actualiza nombre de tipo de entrada para el preview
    this.eventForm.get('entryType')?.valueChanges.subscribe(id => {
      if (id && +id > 0) {
        this.entryTypeService.getById(+id).subscribe((en: any) => {
          this.entryTypeName = en.ticketTypeName || '';
          this.cd.detectChanges();
        });
      } else {
        this.entryTypeName = '';
        this.cd.detectChanges();
      }
    });
  }

  private patchFormWithEvent(): void {
    // Normalizar y detectar si las horas definen todo el día (00:00 a 23:59)
    const rawStart = this.eventData.startDate ?? '';
    const rawEnd = this.eventData.endDate ?? '';
    const timeStartVal = rawStart.includes('T') ? rawStart.split('T')[1].substr(0, 5) : rawStart.substr(0, 5);
    const timeEndVal = rawEnd.includes('T') ? rawEnd.split('T')[1].substr(0, 5) : rawEnd.substr(0, 5);
    const isAllDayTime = timeStartVal === '00:00' && timeEndVal === '23:59';

    this.eventForm.patchValue({
      name: this.eventData.eventName ?? '',
      eventType: this.eventData.eventTypeId ?? '',
      entryType: this.eventData.ticketTypeId ?? '',
      date: this.eventData.eventDate ?? '',
      timeStart: timeStartVal,
      timeEnd: timeEndVal,
      allDay: isAllDayTime || this.eventData.allDay,
      isMain: this.eventData.isMainEvent ?? false,
      venue: this.eventData.venueId ?? '',
      eventLink: this.eventData.eventUrl ?? '',
      city: this.eventData.city ?? '',
      address: this.eventData.address ?? '',
      description: this.eventData.description ?? '',
      presenter: this.eventData.presenter ?? '',
      eventStatus: this.eventData.statusEvent ?? '',
      flyer: this.eventData.flyerUrl ? { name: 'Flyer actual', url: this.eventData.flyerUrl, isUrl: true } : null
    });

    if (isAllDayTime) {
      this.eventForm.get('allDay')?.setValue(true, { emitEvent: false });
    }
    this.cd.detectChanges();
  }

  // Normaliza texto: trim + colapsa espacios múltiples
  private normalizeField(value: string): string {
    return value.trim().replace(/\s+/g, ' ');
  }

  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
      centered: true,
      size: 'sm'
    });
  }

  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }

  // Determina si el evento es virtual (por nombre o por estado del control)
  private isVirtual(): boolean {
    const byName = (this.eventTypeName || '').toLowerCase() === 'virtual';
    const venueDisabled = this.eventForm.get('venue')?.disabled === true;
    const linkEnabled = this.eventForm.get('eventLink')?.enabled === true;
    // Cualquiera de estas señales indica virtual
    return byName || (venueDisabled && linkEnabled);
  }

  onSubmit(): void {
    // 1) Normaliza campos de texto
    ['name', 'city', 'address', 'description', 'presenter', 'eventLink'].forEach(key => {
      const control = this.eventForm.get(key);
      if (control && typeof control.value === 'string') {
        control.setValue(this.normalizeField(control.value), { emitEvent: false });
      }
    });

    // 2) Marca todos como tocados
    this.eventForm.markAllAsTouched();
    if (this.eventForm.invalid) return;

    // 3) Calcula si es virtual
    const isVirtual = this.isVirtual();

    // 4) Mapea valores (sin fabricar File vacío y casteando IDs a number)
    const formValue = this.eventForm.value;
    const flyerValue = formValue.flyer;
    const flyerFileToSend = flyerValue instanceof File ? flyerValue : undefined;

    const mapped: any = {
      eventName: formValue.name,
      isMainEvent: !!formValue.isMain,
      ticketTypeId: formValue.entryType ? +formValue.entryType : undefined,
      eventTypeId: formValue.eventType ? +formValue.eventType : undefined,
      eventDate: formValue.date || undefined,
      startDate: formValue.timeStart || undefined,
      endDate: formValue.timeEnd || undefined,

      // Virtual: NO enviar venueId; Presencial: enviar si existe
      venueId: isVirtual ? undefined : (formValue.venue ? +formValue.venue : undefined),

      // Virtual: enviar link; Presencial: no enviar
      eventUrl: isVirtual ? (formValue.eventLink || undefined) : undefined,

      statusEvent: formValue.eventStatus || undefined,
      description: formValue.description || undefined,
      presenter: formValue.presenter || undefined,
      flyerFile: flyerFileToSend
    };

    // 5) Modo edición: detectar "sin cambios"
    if (this.editMode && this.eventData && this.eventData.eventId) {
      const clean = (val: any) => (val === null || val === undefined ? '' : String(val));

      const isUnchanged =
        clean(this.eventData.eventName) === clean(mapped.eventName) &&
        String(!!this.eventData.isMainEvent) === String(!!mapped.isMainEvent) &&
        clean(this.eventData.ticketTypeId) === clean(mapped.ticketTypeId) &&
        clean(this.eventData.eventTypeId) === clean(mapped.eventTypeId) &&
        clean(this.eventData.eventDate) === clean(mapped.eventDate) &&
        clean(this.eventData.startDate) === clean(mapped.startDate) &&
        clean(this.eventData.endDate) === clean(mapped.endDate) &&
        clean(this.eventData.venueId) === clean(mapped.venueId) &&
        clean(this.eventData.eventUrl) === clean(mapped.eventUrl) &&
        clean(this.eventData.statusEvent) === clean(mapped.statusEvent) &&
        clean(this.eventData.description) === clean(mapped.description) &&
        clean(this.eventData.presenter) === clean(mapped.presenter) &&
        // Si no se subió un nuevo archivo, consideramos sin cambio de flyer
        !mapped.flyerFile;

      if (isUnchanged) {
        this.notifyTitle = 'Sin cambios';
        this.notifyMessage = 'No hay cambios para guardar. Realiza alguna edición antes de guardar.';
        this.notifyType = 'info';
        this.showNotify = true;
        this.cd.detectChanges();
        return;
      }

      // 6) Update
      this.showLoadingModal();
      this.eventService.updateFormData(this.eventData.eventId, mapped).subscribe({
        next: () => {
          this.hideLoadingModal();
          this.notifyTitle = 'Evento actualizado';
          this.notifyMessage = 'El evento se actualizó correctamente.';
          this.notifyType = 'success';
          this.showNotify = true;
          this.cd.detectChanges();
        },
        error: (err) => {
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
      // 7) Create
      this.showLoadingModal();
      this.eventService.create(mapped).subscribe({
        next: () => {
          this.hideLoadingModal();
          this.notifyTitle = 'Evento creado';
          this.notifyMessage = 'El evento se creó correctamente.';
          this.notifyType = 'success';
          this.showNotify = true;
          this.cd.detectChanges();
          setTimeout(() => {
            this.eventForm.reset();
          }, 100);
        },
        error: (err) => {
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

  onNotifyClose(): void {
    this.showNotify = false;
    if (this.notifyType === 'success' || this.notifyOnGetIdError) {
      this.router.navigate(['/dashboard/events/create-event']);
      this.notifyOnGetIdError = false;
    }
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/events/create-event']);
  }
}
