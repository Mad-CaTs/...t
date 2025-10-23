import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FilterGenericComponent,
	FilterGenericConfig
} from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { TablePaginatorComponent } from '@shared/components/tables/table-paginator/table-paginator.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';

import { CreateEventService } from '@app/event/services/create-event.service';
import { Event } from '@app/event/models/event.model';
import { TicketReportService } from '@app/entry/services/ticket-report.service';
import { TicketReport } from '@app/entry/models/ticket-report.model';
import { handleHttpError } from '@app/event/utils/handle-http-error.util';
import { exportToExcel } from '@app/event/utils/export-excel.util';
import { TICKET_REPORT_CONSTANTS } from '@app/entry/constants/ticket-report.constants';

@Component({
	selector: 'app-ticket-report',
	standalone: true,
	imports: [
		CommonModule,
		FilterGenericComponent,
		TableGenericComponent,
		TablePaginatorComponent,
		EmptyStateComponent,
		ModalNotifyComponent
	],
	templateUrl: './ticket-report.component.html',
	styleUrls: ['./ticket-report.component.scss']
})
export class TicketReportComponent implements OnInit {
	showNotify = false;
	notifyTitle = '';
	notifyMessage = '';
	notifyType: 'success' | 'error' | 'info' = 'info';

	loading = true;
	isShowingTickets = false;

	allEvents: Event[] = [];
	events: Event[] = [];
	tickets: TicketReport[] = [];


  pageSize = 10;
  pageIndex = 1;
  totalElements = 0;
  totalPages = 0;
  
  // Datos de resumen
  summaryData = {
    canjeados: 0,
    noCanjeados: 0,
    total: 0
  };

	eventStatusOptions: string[] = ['Activo', 'Inactivo', 'Cancelado', 'Pasado', 'En_curso'];

	filters: FilterGenericConfig[] = [];
	values: Record<string, any> = {};
	actionText = 'Exportar a Excel';

	constructor(
		private createEventService: CreateEventService,
		private ticketReportService: TicketReportService,
		private cd: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.resetFilters();
		this.loadEvents();
	}


  private normalizeStatus(s: any): string {
    return (s ?? '')
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[\s_\-]+/g, '');
  }

	private statusLabelToCode(s: any): string {
		const ns = this.normalizeStatus(s);
		switch (ns) {
			case 'activo':
				return 'activo';
			case 'inactivo':
				return 'inactivo';
			case 'cancelado':
				return 'cancelado';
			case 'pasado':
				return 'pasado';
			case 'en_curso':
				return 'en_curso';
			default:
				return ns;
		}
	}

	private normalizedCodeOf(s: any): string {
		return this.normalizeStatus(this.statusLabelToCode(s));
	}

	private withUpdatedFilterOptions(
		key: string,
		options: any[],
		extras?: Partial<FilterGenericConfig>
	): FilterGenericConfig[] {
		return this.filters.map((f) => {
			if (f.key !== key) return f;
			return { ...f, options: [...options], ...(extras ?? {}) };
		});
	}


  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  }

  private resetFilters(): void {
    this.filters = [
      // {
      //   type: 'select',
      //   key: 'status',
      //   label: 'Estado de evento',
      //   options: this.eventStatusOptions,
      //   order: 1,
      //   showAllOption: true,
      // },
      {
        type: 'select',
        key: 'eventId',
        label: 'Evento',
        options: [],
        order: 1,
        showAllOption: true,
      },
      {
        type: 'select',
        key: 'canjeado',
        label: 'Canjeado',
        options: [...TICKET_REPORT_CONSTANTS.REDEEMED_STATUS],
        order: 2,
        showAllOption: true,
      },
      {
        type: 'search',
        key: 'socio',
        label: 'Nombre participante',
        placeholder: 'Buscar por nombre del participante...',
        order: 3,
        preventLeadingSpace: true,
        debounceMs: 400,
      },
      {
        type: 'select',
        key: 'zona',
        label: 'Zona',
        options: [],
        order: 4,
        showAllOption: true,
      },
      {
        type: 'select',
        key: 'tipoComprador',
        label: 'Tipo Comprador',
        options: [...TICKET_REPORT_CONSTANTS.USER_TYPES],
        order: 5,
        showAllOption: true,
      },
      {
        type: 'select',
        key: 'nominado',
        label: 'Nominación',
        options: [...TICKET_REPORT_CONSTANTS.NOMINATION_STATUS],
        order: 6,
        showAllOption: true,
      },
    ];
    this.values = { eventId: '', canjeado: '', zona: '', tipoComprador: '', nominado: '' };
  }

	private loadEvents(): void {
		this.loading = true;
		this.createEventService.getAll().subscribe({
			next: (events: Event[]) => {
				this.allEvents = events ?? [];
				console.log('[TR] loadEvents -> allEvents:', this.allEvents);

				this.updateEventOptions();

        const selectedId = this.values?.eventId;
        if (selectedId && selectedId !== '') {
          // Evento específico seleccionado
          this.isShowingTickets = true;
          this.loadTickets(Number(selectedId));
        } else if (selectedId === '') {
          // "Todos" seleccionado por defecto
          this.isShowingTickets = true;
          this.loadTickets(-1);
        } else {
          // Sin selección
          this.isShowingTickets = false;
          this.applyFilters();
          this.loading = false;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        const handled = handleHttpError(err);
        this.notifyType = handled.notifyType;
        this.notifyTitle = handled.notifyTitle;
        this.notifyMessage = handled.notifyMessage;
        this.showNotify = true;
        this.isShowingTickets = false;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  private updateEventOptions(): void {
    let list = this.allEvents.slice();

    type EventOption = { label: string; value: number | ''; status?: string | null; disabled?: boolean };
    let opts: EventOption[] = list.map(e => ({ label: e.eventName, value: e.eventId, status: e.statusEvent }));

		if (opts.length === 0) {
			opts = [{ label: 'Sin elementos para mostrar', value: '', disabled: true }];
		}

    this.filters = this.withUpdatedFilterOptions('eventId', opts, { showAllOption: true });

    const prevSelected = (this.values?.eventId ?? '') as number | string | '';
    let nextSelected: number | string | '' = prevSelected;

    // Si no hay selección previa, seleccionar "Todos" por defecto
    if (!prevSelected) {
      nextSelected = ''; // '' representa "Todos"
    }

    this.values = { ...(this.values ?? {}), eventId: nextSelected };

    console.log('[TR] updateEventOptions -> opts:', opts.map(o => `${o.label}:${o.value}`),
      '| selected:', nextSelected);

    this.cd.detectChanges();
  }

  private updateRedeemedOptions(): void {
    // Usar opciones fijas en lugar de extraer de los tickets
    const options = [...TICKET_REPORT_CONSTANTS.REDEEMED_STATUS];
    this.filters = this.withUpdatedFilterOptions('canjeado', options, { showAllOption: true });

    const prev = (this.values?.canjeado ?? '').toString();
    const next = prev && options.includes(prev) ? prev : '';
    if (next !== prev) this.values = { ...(this.values ?? {}), canjeado: next };
    this.cd.detectChanges();
  }

  private updateZonaOptions(): void {
    const eventId = this.values?.eventId;
    if (!eventId || eventId === '') {
      // Si no hay evento seleccionado o se seleccionó "Todos", limpiar las opciones de zona
      this.filters = this.withUpdatedFilterOptions('zona', [], { showAllOption: true });
      this.values = { ...(this.values ?? {}), zona: '' };
      this.cd.detectChanges();
      return;
    }

    // Cargar zonas desde el backend
    this.ticketReportService.getEventZones(Number(eventId)).subscribe({
      next: (response) => {
        const zones = (response.data ?? []).map((zone: any) => zone.zoneName);
        this.filters = this.withUpdatedFilterOptions('zona', zones, { showAllOption: true });

        const prev = (this.values?.zona ?? '').toString();
        const next = prev && zones.includes(prev) ? prev : '';
        if (next !== prev) this.values = { ...(this.values ?? {}), zona: next };
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading zones:', err);
        this.filters = this.withUpdatedFilterOptions('zona', [], { showAllOption: true });
        this.values = { ...(this.values ?? {}), zona: '' };
        this.cd.detectChanges();
      }
    });
  }

  onValuesChange(incoming: Record<string, any>): void {
    const merged: Record<string, any> = {
      eventId: this.values?.eventId ?? '',
      canjeado: this.values?.canjeado ?? '',
      zona: this.values?.zona ?? '',
      tipoComprador: this.values?.tipoComprador ?? '',
      nominado: this.values?.nominado ?? '',
      ...(incoming ?? {})
    };

    this.values = merged;
    console.log('[TR] onValuesChange -> incoming:', incoming, '| merged:', this.values);

    const isCleared = !incoming || Object.keys(incoming).length === 0;
    if (isCleared) {
      this.values = { eventId: '', canjeado: '', zona: '', tipoComprador: '', nominado: '' };
      this.updateEventOptions();
      this.tickets = [];
      this.updateRedeemedOptions();
      this.updateZonaOptions();
      this.isShowingTickets = false;
      this.applyFilters();
      return;
    }
    
    // Resetear paginación cuando cambien los filtros
    if (incoming && (Object.prototype.hasOwnProperty.call(incoming, 'socio') || 
                     Object.prototype.hasOwnProperty.call(incoming, 'canjeado') ||
                     Object.prototype.hasOwnProperty.call(incoming, 'zona') ||
                     Object.prototype.hasOwnProperty.call(incoming, 'tipoComprador') ||
                     Object.prototype.hasOwnProperty.call(incoming, 'nominado'))) {
      this.pageIndex = 1;
    }

    // Si cambió el evento, actualizar las zonas
    if (incoming && Object.prototype.hasOwnProperty.call(incoming, 'eventId')) {
      this.updateZonaOptions();
    }

		const eventId = this.values?.eventId;

    if (eventId && eventId !== '') {
      this.isShowingTickets = true;
      console.log('[TR] will loadTickets() with eventId:', eventId);
      this.loadTickets(Number(eventId));
    } else if (eventId === '') {
      // Cuando se selecciona "Todos", cargar tickets de todos los eventos
      this.isShowingTickets = true;
      console.log('[TR] will loadTickets() for all events');
      this.loadTickets(-1); // Usar -1 para indicar "todos los eventos"
    } else {
      this.isShowingTickets = false;
      this.applyFilters();
    }
  }

  onActionClick(): void {
    const eventId = this.values?.eventId;
    
    console.log('[TR] onActionClick -> eventId:', eventId, 'type:', typeof eventId);
    
    // Verificar que hay un evento seleccionado (puede ser "Todos" o un evento específico)
    if (!eventId && eventId !== '') {
      this.notifyType = 'info';
      this.notifyTitle = 'Exportar tickets';
      this.notifyMessage = 'Seleccione un evento válido.';
      this.showNotify = true;
      this.cd.detectChanges();
      return;
    }

    // Mostrar loading
    this.loading = true;
    this.cd.detectChanges();

    // Preparar filtros para la exportación
    const filters: any = {};
    if (this.values?.canjeado) filters.canjeado = this.values.canjeado;
    if (this.values?.zona) filters.zona = this.values.zona;
    if (this.values?.tipoComprador) filters.tipoComprador = this.values.tipoComprador;
    if (this.values?.nominado) filters.nominado = this.values.nominado;
    if (this.values?.socio) filters.socio = this.values.socio;

    // Determinar el eventId numérico para el backend
    const backendEventId = (eventId === '' || eventId === '-1') ? -1 : Number(eventId);

    // Llamar al endpoint de exportación del backend
    this.ticketReportService.exportReport(backendEventId, filters).subscribe({
      next: (response) => {
        this.loading = false;
        
        if (response.result && response.data && response.data.length > 0) {
          // Determinar el nombre del archivo
          let fileName: string;
          if (eventId === '' || eventId === '-1') {
            // Todos los eventos
            fileName = 'Ticket-Report-Todos-Eventos';
          } else {
            // Evento específico
            const evt = this.allEvents.find(e => e.eventId === Number(eventId));
            const eventName = evt?.eventName?.toString() || `evento-${eventId}`;
            const safeName = eventName.replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim();
            fileName = `Ticket-Report-${safeName}`;
          }

          // Exportar los datos del backend
          exportToExcel(response.data, fileName);
          
          this.notifyType = 'success';
          this.notifyTitle = 'Exportar tickets';
          this.notifyMessage = `Se exportaron ${response.data.length} tickets exitosamente.`;
        } else {
          this.notifyType = 'info';
          this.notifyTitle = 'Exportar tickets';
          this.notifyMessage = 'No hay tickets para exportar con los filtros seleccionados.';
        }
        
        this.showNotify = true;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al exportar tickets:', err);
        this.notifyType = 'error';
        this.notifyTitle = 'Exportar tickets';
        this.notifyMessage = 'Error al exportar los tickets. Intente nuevamente.';
        this.showNotify = true;
        this.cd.detectChanges();
      }
    });
  }

	private applyFilters(): void {
		const status = this.values?.status ?? '';
		const eventId = this.values?.eventId;

		if ((!eventId || eventId === '') && status && status !== '') {
			let filtered = this.allEvents.map((evt) => ({
				...evt,
				eventTypeName: '',
				isMainEventText: evt.isMainEvent ? 'Destacado' : 'Secundario'
			}));

			if (status && status !== '') {
				const ncode = this.normalizedCodeOf(status);
				filtered = filtered.filter((e) => this.normalizedCodeOf(e.statusEvent) === ncode);
			}

			this.events = filtered;
		} else {
			this.events = [];
		}
		this.pageIndex = 1;
		this.cd.detectChanges();
	}

  private loadSummary(eventId: number): void {
    // Preparar filtros para enviar al backend
    const filters: any = {};
    if (this.values?.canjeado) filters.canjeado = this.values.canjeado;
    if (this.values?.zona) filters.zona = this.values.zona;
    if (this.values?.tipoComprador) filters.tipoComprador = this.values.tipoComprador;
    if (this.values?.nominado) filters.nominado = this.values.nominado;
    if (this.values?.socio) filters.socio = this.values.socio;

    this.ticketReportService.getReportSummary(eventId, filters).subscribe({
      next: (response) => {
        this.summaryData = response.data || { canjeados: 0, noCanjeados: 0, total: 0 };
        console.log('[TR] summary loaded:', this.summaryData);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error loading summary:', err);
        this.summaryData = { canjeados: 0, noCanjeados: 0, total: 0 };
        this.cd.detectChanges();
      }
    });
  }

  private loadTickets(eventId: number): void {
    this.loading = true;
    console.log('[TR] loadTickets -> eventId:', eventId);

    // Preparar filtros para enviar al backend
    const filters: any = {};
    if (this.values?.canjeado) filters.canjeado = this.values.canjeado;
    if (this.values?.zona) filters.zona = this.values.zona;
    if (this.values?.tipoComprador) filters.tipoComprador = this.values.tipoComprador;
    if (this.values?.nominado) filters.nominado = this.values.nominado;
    if (this.values?.socio) filters.socio = this.values.socio;
    
    // Agregar paginación
    filters.page = this.pageIndex - 1; // Backend usa 0-based indexing
    filters.size = this.pageSize;

    this.ticketReportService.getReportV2(eventId, filters).subscribe({
      next: (response) => {
        const pageData = response.data;
        this.tickets = (pageData?.content ?? []).map((t: any) => ({
          ...t,
          fechaCompra: this.formatDate(t.fechaCompra),
        }));
        
        // Actualizar información de paginación
        this.totalElements = pageData?.totalElements ?? 0;
        this.totalPages = pageData?.totalPages ?? 0;
        
        console.log('[TR] tickets loaded from v2 endpoint with pagination:', {
          currentPage: this.pageIndex,
          totalElements: this.totalElements,
          totalPages: this.totalPages,
          ticketsCount: this.tickets.length
        });
        
        this.updateRedeemedOptions();
        this.updateZonaOptions();
        this.loadSummary(eventId); // Cargar resumen
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        const handled = handleHttpError(err);
        this.notifyType = handled.notifyType;
        this.notifyTitle = handled.notifyTitle;
        this.notifyMessage = handled.notifyMessage;
        this.showNotify = true;
        this.tickets = [];
        this.pageIndex = 1;
        this.totalElements = 0;
        this.totalPages = 0;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  get pagedData(): any[] {
    if (this.isShowingTickets) {
      // Con paginación del backend, ya recibimos solo los datos de la página actual
      return this.tickets;
    } else {
      return this.events;
    }
  }

  get totalLength(): number {
    return this.isShowingTickets ? this.totalElements : this.events.length;
  }

  get filteredTickets(): TicketReport[] {
    // Los filtros ahora se aplican en el backend, solo retornamos los tickets tal como vienen
    return this.tickets ?? [];
  }
  
  private isRedeemedValue(v: any): boolean {
    if (v === null || v === undefined) return false;
    const s = String(v).trim().toLowerCase();
    return ['si', 'sí', 's', 'true', '1', 'yes', 'y'].includes(s);
  }

  get redeemedCount(): number {
    return this.summaryData.canjeados;
  }

  get notRedeemedCount(): number {
    return this.summaryData.noCanjeados;
  }

  get totalTickets(): number {
    return this.summaryData.total;
  }

  get visibleColumns(): string[] {
    return [
      'Item', 'Nro Ticket', 'Nro Compra', 'Fecha Compra', 'Zona',
      'Participante', 'Nombre Comprador', 'Tipo Comprador', 'Documento', 'Monto', 'Tipo Ticket', 'Canjeado'
    ];
  }

  get visibleKeys(): string[] {
    return [
      'item', 'nroTicket', 'nroCompra', 'fechaCompra', 'zona',
      'socio', 'nombreComprador', 'tipoComprador', 'documento', 'monto', 'tipoTicket', 'canjeado'
    ];
  }

  get visibleWidths(): string[] {
    return ['5%','7%','10%','15%','10%','10%','10%','10%','10%','8%','10%','10%'];
  }

  onPageChange(newPage: number): void {
    this.pageIndex = newPage;
    // Recargar datos con la nueva página
    const eventId = this.values?.eventId;
    if (eventId && eventId !== '') {
      this.loadTickets(Number(eventId));
    } else if (eventId === '') {
      this.loadTickets(-1);
    }
  }

  onPageSizeChange(newSize: number): void {
    this.pageSize = newSize;
    this.pageIndex = 1;
    // Recargar datos con el nuevo tamaño de página
    const eventId = this.values?.eventId;
    if (eventId && eventId !== '') {
      this.loadTickets(Number(eventId));
    } else if (eventId === '') {
      this.loadTickets(-1);
    }
  }
}
