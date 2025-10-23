import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeTypeService } from '@app/core/services/api/change-type/change-type.service';
import { monthNamesConstant, weekDaysFullConstant } from '@constants/date.constant';
import { IResponseData } from '@interfaces/globals.interface';
import { NgbModal, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { LegalService } from '@app/legal/services/LegalService';
import { ICycle } from '@interfaces/legal-module.interface';

@Component({
	selector: 'app-timeline-legalization',
	standalone: true,
	templateUrl: './timeline-legalization.component.html',
	styleUrls: ['./timeline-legalization.component.scss'],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormControlModule,
		TablesModule,
		InlineSVGModule,
		FormsModule,
		NgbNavModule,
		FullCalendarModule
	]
})
export class TimelineLegalizationComponent implements OnInit {
	@ViewChild('eventModal') eventModal!: TemplateRef<any>;
	selectedEvent: any; // Variable para almacenar el evento seleccionado

	@ViewChild('newCycleModal') newCycleModal!: TemplateRef<any>;
	@ViewChild('confirmDeleteModal') confirmDeleteModal!: TemplateRef<any>;

	newCycleForm!: FormGroup;
	cycleForm!: FormGroup;

	modalTitle: string = '';

	isEditMode: boolean = false;
	selectedCycleId: number | null = null;

	calendarEvents: any[] = [];

	calendarOptions: any = {
		plugins: [dayGridPlugin, interactionPlugin],
		initialView: 'dayGridMonth',
		locale: 'es',
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: ''
		},
		eventClick: this.handleEventClick.bind(this),
		eventContent: this.renderEventContent.bind(this),
		events: []
	};
	constructor(
		private modalService: NgbModal,
		private fb: FormBuilder,
		private legalService: LegalService,
		private cdr: ChangeDetectorRef
	) {
		this.initForm();
	}

	ngOnInit(): void {
		this.loadCycles();
	}

	loadCycles(): void {
		this.legalService.getAllCycles().subscribe({
			next: (res) => {
				this.calendarEvents = res.data.map((cycle: ICycle) => {
					const startDate = new Date(cycle.startAt);
					const endDate = new Date(cycle.endAt);

					// Sumar 1 día para que FullCalendar pinte inclusive el último día
					const endDateForCalendar = new Date(endDate);
					endDateForCalendar.setDate(endDateForCalendar.getDate() + 1);

					return {
						id: cycle.id,
						title: cycle.name,
						start: startDate.toISOString().split('T')[0],
						end: endDateForCalendar.toISOString().split('T')[0],
						allDay: cycle.allDay === 1,
						backgroundColor: cycle.color,
						borderColor: cycle.color,
						extendedProps: {
							editable: true,
							location: cycle.locale,
							description: cycle.description,
							startHourAt: cycle.startHourAt,
							endHourAt: cycle.endHourAt,
							allDay: cycle.allDay === 1
						}
					};
				});

				// Actualizar eventos del calendario y refrescar
				this.calendarOptions = {
					...this.calendarOptions,
					events: this.calendarEvents
				};
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error al cargar ciclos:', err);
			}
		});
	}

	initForm() {
		this.cycleForm = this.fb.group({
			type: ['', Validators.required],
			cycleName: ['', Validators.required],
			startDate: ['', Validators.required],
			endDate: ['', Validators.required],
			color: ['#000000'],
			allDay: [false], //
			startTime: [''],
			endTime: [''],
			location: [''],
			description: ['']
		});

		// Habilitar/deshabilitar horario según checkbox
		this.cycleForm.get('allDay')?.valueChanges.subscribe((allDay) => {
			if (allDay) {
				this.cycleForm.get('startTime')?.disable();
				this.cycleForm.get('endTime')?.disable();
			} else {
				this.cycleForm.get('startTime')?.enable();
				this.cycleForm.get('endTime')?.enable();
			}
		});
	}

	openNewCycleModal() {
		this.cycleForm.reset(); // Reinicia siempre el formulario al abrir el modal
		this.isEditMode = false;
		this.selectedEvent = null;
		this.modalTitle = 'Nuevo ciclo de legalización';

		const modalRef = this.modalService.open(this.newCycleModal);

		modalRef.result.finally(() => {
			this.onModalClose(); // limpia el modal
		});
	}

	submitCycleForm(modalRef: any) {
		if (this.cycleForm.invalid) return;

		const form = this.cycleForm.value;

		const payload: Omit<ICycle, 'id' | 'createdAt' | 'modifiedAt'> = {
			legalizationType: +form.type,
			name: form.cycleName,
			startAt: new Date(form.startDate).toISOString(),
			endAt: new Date(form.endDate).toISOString(),
			allDay: form.allDay ? 1 : 0,
			startHourAt: form.startTime || '00:00:00',
			endHourAt: form.endTime || '00:00:00',
			locale: form.location,
			description: form.description,
			color: form.color,
			userPanelId: 0
		};

		if (this.isEditMode && this.selectedEvent?.id) {
			this.legalService.editCycle(this.selectedEvent.id, payload).subscribe({
				next: () => {
					modalRef.close();
					this.cycleForm.reset();
					this.isEditMode = false;
					this.onModalClose();
					this.loadCycles();
				},
				error: (err) => {
					console.error('Error al editar ciclo:', err);
				}
			});
		} else {
			this.legalService.addCycle(payload).subscribe({
				next: () => {
					modalRef.close();
					this.cycleForm.reset();
					this.onModalClose();
					this.loadCycles();
				},
				error: (err) => {
					console.error('Error al agregar ciclo:', err);
				}
			});
		}
	}

	saveCycle(modalRef: any) {
		if (this.newCycleForm.valid) {
			const ciclo = this.newCycleForm.value;
			console.log('Nuevo ciclo:', ciclo);
			modalRef.close();
			// agregar el ciclo al calendario
		}
	}

	handleEventClick(arg: EventClickArg) {
		this.selectedEvent = {
			id: arg.event.id,
			title: arg.event.title,
			location: arg.event.extendedProps['location'] || '',
			description: arg.event.extendedProps['description'] || '',
			allDay: arg.event.allDay,
			startHourAt: arg.event.extendedProps['startHourAt'] || '',
			endHourAt: arg.event.extendedProps['endHourAt'] || '',
			editable: true,
			color: arg.event.backgroundColor,
			legalizationType: arg.event.extendedProps['legalizationType'] || 1,
			startAt: arg.event.startStr,
			//endAt: arg.event.endStr
			endAt: this.adjustDate(arg.event.endStr, -1)
		};

		// abre el modal con los detalles del evento
		this.modalService.open(this.eventModal, { size: 'xs' });
	}

	renderEventContent(arg: any) {
		const event = arg.event;
		const title = event.title || '';
		const location = event.extendedProps['location'] || '';
		const description = event.extendedProps['description'] || '';
		const allDay = event.allDay;
		const startHourAt = event.extendedProps['startHourAt'] || '';
		const endHourAt = event.extendedProps['endHourAt'] || '';

		// define etiqueta de hora y formateado
		let timeLabel = '🕘 Todo el día';
		if (!allDay && startHourAt && endHourAt) {
			timeLabel = `🕘 ${startHourAt.substring(0, 5)} - ${endHourAt.substring(0, 5)}`;
		} else if (!allDay && startHourAt) {
			timeLabel = `🕘 ${startHourAt.substring(0, 5)}`;
		}

		// crea contenido del evento
		const div = document.createElement('div');
		div.classList.add('custom-event');

		// HTML personalizado
		div.innerHTML = `
			<div><strong>${title}</strong></div>
			<div>${timeLabel}</div>
	
		`;

		return { domNodes: [div] };
	}

	// metodo para cargar los valores del evento en el formulario de edicion
	editEvent() {
		this.isEditMode = true;
		this.modalTitle = 'Editar ciclo de legalización';

		this.cycleForm.patchValue({
			type: this.selectedEvent.legalizationType.toString(),
			cycleName: this.selectedEvent.title,
			startDate: this.formatDateToInput(this.selectedEvent.startAt),
			endDate: this.formatEndDateForEdit(this.selectedEvent.endAt),
			color: this.selectedEvent.color,
			allDay: this.selectedEvent.allDay,
			startTime: this.selectedEvent.startHourAt,
			endTime: this.selectedEvent.endHourAt,
			location: this.selectedEvent.location,
			description: this.selectedEvent.description
		});

		this.modalService.dismissAll();
		this.modalService.open(this.newCycleModal);
	}

	formatEndDateForEdit(endStr: string): string {
		const date = new Date(endStr);
		date.setDate(date.getDate());
		return date.toISOString().split('T')[0];
	}

	formatDateToInput(dateString: string): string {
		const date = new Date(dateString);
		return date.toISOString().split('T')[0]; // Devuelve "yyyy-MM-dd"
	}

	// metodo para guardar el ciclo editado
	saveEditedCycle(modalRef: any) {
		if (this.cycleForm.invalid) return;

		const form = this.cycleForm.value;

		// Formato de la hora
		const startDate = new Date(form.startDate);
		const endDate = new Date(form.endDate);
		const startTime = form.startTime || '00:00:00';
		const endTime = form.endTime || '00:00:00';

		const payload: Omit<ICycle, 'id' | 'createdAt' | 'modifiedAt'> = {
			legalizationType: +form.type,
			name: form.cycleName,
			startAt: new Date(form.startDate).toISOString(),
			endAt: new Date(form.endDate).toISOString(),
			allDay: form.allDay ? 1 : 0,
			startHourAt: startTime,
			endHourAt: endTime,
			locale: form.location,
			description: form.description,
			color: form.color,
			userPanelId: 0
		};

		// el servicio `editCycle` para actualizar el ciclo en el backend
		this.legalService.editCycle(this.selectedEvent.id, payload).subscribe({
			next: (res) => {
				console.log('Ciclo editado:', res);
				modalRef.close();
				this.loadCycles(); // recargar los ciclos para reflejar los cambios
			},
			error: (err) => {
				console.error('Error al editar ciclo:', err);
			}
		});
	}

	onModalClose() {
		this.isEditMode = false;
		this.selectedEvent = null;
		this.cycleForm.reset();
		this.cycleForm.markAsPristine();
		this.cycleForm.markAsUntouched();
		this.cycleForm.updateValueAndValidity();
	}

	deleteCycle() {
		if (!this.selectedEvent?.id) return;

		this.modalService.open(this.confirmDeleteModal);
	}

	confirmDelete(modalRef: any) {
		if (!this.selectedEvent?.id) return;

		this.legalService.deleteCycle(this.selectedEvent.id).subscribe({
			next: () => {
				modalRef.close(); // Cierra el modal de confirmación
				this.modalService.dismissAll(); // Cierra cualquier otro modal abierto
				this.loadCycles(); // Recarga eventos
			},
			error: (err) => {
				console.error('Error al eliminar ciclo:', err);
			}
		});
	}

	adjustDate(dateStr: string, days: number): string {
		const date = new Date(dateStr);
		date.setDate(date.getDate() + days);
		return date.toISOString().split('T')[0];
	}
}
