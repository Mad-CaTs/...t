import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { handleHttpError } from '../../utils/handle-http-error.util';
import { CommonModule } from '@angular/common';
import { ListToolbarComponent } from '../../components/shared/list-toolbar/list-toolbar.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state.component';
import { TableGenericComponent } from '../../../shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '../../../shared/components/tables/table-paginator/table-paginator.component';
import { EventTypeService } from '../../services/event-type.service';
import { CreateEventService } from '../../services/create-event.service';
import { Event } from '../../models/event.model';
import { EventType } from '../../models/event-type.model';
import { exportToExcel } from '../../utils/export-excel.util';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-event-history',
  standalone: true,
  imports: [
    CommonModule,
    ListToolbarComponent,
    EmptyStateComponent,
    TableGenericComponent,
    TablePaginatorComponent,
    ModalNotifyComponent,
    ModalConfirmDeleteComponent
  ],
  templateUrl: './event-history.component.html',
  styleUrls: ['./event-history.component.scss']
})
export class EventHistoryComponent implements OnInit {

  showNotify: boolean = false;
  notifyTitle: string = '';
  notifyMessage: string = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  showDeleteModal: boolean = false;
  selectedToDelete: Event | null = null;
  @ViewChild(ListToolbarComponent) toolbar!: ListToolbarComponent;

  allEvents: Event[] = [];
  events: Event[] = [];

  pageSize = 8;
  pageIndex = 1;

  currentSearch: string = '';
  currentType: string = 'Pasado';

  eventStatusOptions: string[] = [
    'Activo',
    'Inactivo',
    'Cancelado',
    'Pasado',
    'En_curso'
  ];
  typeOptions: string[] = [];
  eventTypes: EventType[] = [];

  loading: boolean = true;

  private loadingModalRef: NgbModalRef | null = null;

  constructor(
    private createEventService: CreateEventService,
    private eventTypeService: EventTypeService,
    private cd: ChangeDetectorRef,
    public modalService: NgbModal,
    private router: Router
  ) {}
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

  ngOnInit(): void {
    // default dropdown options: 'Todos' is first hard-coded in template
    this.typeOptions = this.eventStatusOptions;
    this.eventTypeService.getAll().subscribe({
      next: (types: EventType[]) => {
        this.eventTypes = types;
        this.cd.detectChanges();
        this.loadEvents();
      },
      error: (err) => {
        this.loading = false;
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
        this.cd.detectChanges();
      }
    });
  }

  private loadEvents(): void {
    this.loading = true;
    this.createEventService.getAll().subscribe({
      next: (events: Event[]) => {
        //console.log('Datos recibidos de getAll:', events);
        this.allEvents = events.map(evt => ({
          ...evt,
          eventTypeName: this.getEventTypeName(evt.eventTypeId),
          isMainEventText: evt.isMainEvent ? 'Destacado' : 'Secundario',
          eventDay: this.formatDate(evt.eventDate)
        }));
        this.applyFilters();
        this.loading = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
        this.cd.detectChanges();
      }
    });
  }

  getEventTypeName(eventTypeId: number): string {
    const found = this.eventTypes.find(t => t.eventTypeId === eventTypeId);
    return found ? found.eventTypeName : '';
  }
  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const needsLocalMidnight = !/T|\d{2}:\d{2}|[Zz]|[+\-]\d{2}:?\d{2}/.test(dateString);
    const isoLike = needsLocalMidnight ? `${dateString}T00:00:00` : dateString;
    const d = new Date(isoLike);
    if (isNaN(d.getTime())) return String(dateString);
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  get pagedData(): Event[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.events.slice(start, start + this.pageSize);
  }

  get visibleColumns(): string[] {
    return this.currentType && this.currentType !== 'Todos'
      ? [
        'Item',
        'Imagen',
        'Nombre del evento',
        'Fecha del evento',
        'Tipo de evento'
      ]
      : [
        'Item',
        'Imagen',
        'Nombre del evento',
        'Fecha del evento',
        'Tipo de evento',
        'Estado'
      ];
  }

  get visibleKeys(): string[] {

    return this.currentType && this.currentType !== 'Todos'
      ? ['item', 'flyerUrl', 'eventName', 'eventDay', 'eventTypeName']
      : ['item', 'flyerUrl', 'eventName', 'eventDay', 'eventTypeName', 'statusEvent'];
  }

  get visibleWidths(): string[] {

    return this.currentType && this.currentType !== 'Todos'
      ? ['8%', '10%', '20%', '30%', '15%']
      : ['8%', '10%', '20%', '15%', '15%', '15%'];
  }

  onPageChange(newPage: number) {
    this.pageIndex = newPage;
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 1;
  }

  isCountdownActive = false;
  clearCountdownText = '';
  resetTimeoutId: any;
  resetIntervalId: any;

  onSearch(value: string) {
    if (this.isCountdownActive) return;
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = normalize(value.trim());
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);

    this.currentSearch = value.trim();
    this.applyFilters();

    if (!query) {
      this.pageIndex = 1;
      this.cd.detectChanges();
      return;
    }

    if (this.events.length === 0) {
      this.isCountdownActive = true;
      let secondsLeft = 3;
      this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
      this.resetIntervalId = setInterval(() => {
        secondsLeft--;
        this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
        this.cd.detectChanges();
      }, 1000);
      this.resetTimeoutId = setTimeout(() => {
        clearInterval(this.resetIntervalId);
        this.clearCountdownText = '';
        this.isCountdownActive = false;
        this.toolbar.clear();
        this.cd.detectChanges();
      }, 3000);
    }
  }

  onFilterByType(type: string) {
    this.currentType = type;
    this.applyFilters();
  }

  private applyFilters() {
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();

    let filtered = this.allEvents.map(evt => ({
      ...evt,
      eventTypeName: this.getEventTypeName(evt.eventTypeId),
      isMainEventText: evt.isMainEvent ? 'Destacado' : 'Secundario',
      eventDay: this.formatDate(evt.eventDate)
    }));

    if (this.currentSearch) {
      const q = normalize(this.currentSearch);
      filtered = filtered.filter(evt => {
        const idText = String(evt.eventId).padStart(2, '0');
        return (
          idText === q ||
          normalize(evt.eventName).includes(q)
        );
      });
    }

    if (this.currentType && this.currentType !== 'Todos') {
      filtered = filtered.filter(evt => (evt.statusEvent || '').toLowerCase() === this.currentType.toLowerCase());
    }

    this.events = filtered;
    this.pageIndex = 1;
  }

  onAdd() {
  if (this.events.length === 0) {
    this.notifyType = 'info';
    this.notifyTitle = 'Exportar eventos';
    this.notifyMessage = 'No hay eventos para exportar.';
    this.showNotify = true;
    this.cd.detectChanges();
    return;
  }

  let status = '';
  if (this.currentType === 'Todos' || this.currentType === '') {
    status = 'todos';
  } else {
    status = this.currentType.toLowerCase();
  }

  const exportData = this.events.map(evt => ({
    'Event ID': evt.eventId,
    'Event Name': evt.eventName,
    'Event Date': evt.eventDate,
    'Start Time': evt.startDate,
    'End Time': evt.endDate,
    'Event URL': evt.eventUrl,
    'Description': evt.description,
    'Is Main Event': evt.isMainEvent ? 'Yes' : 'No',
    'Flyer URL': evt.flyerUrl,
    'Presenter': evt.presenter,
    'Event Type ID': evt.eventTypeId,
    'Ticket Type ID': evt.ticketTypeId,
    'Venue ID': evt.venueId,
    'Status Event': evt.statusEvent ?? ''
  }));

  exportToExcel(exportData, `eventos-${status}`);
}

  onView(row: Event) {
    this.router.navigate(['/dashboard/events/event-history/view', row.eventId]);
  }

  onEdit(row: Event): void {
    this.router.navigate(['/dashboard/events/event-history/edit', row.eventId]);
  }

  onDelete(row: Event): void {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }

  onCancelDelete(): void {
    this.showDeleteModal = false;
    this.selectedToDelete = null;
  }

  onConfirmDelete(): void {
    this.showDeleteModal = false;
    this.confirmDelete();
  }

  private confirmDelete(): void {
    if (!this.selectedToDelete) return;
    this.showLoadingModal();
    this.createEventService.delete(this.selectedToDelete.eventId)
      .pipe(finalize(() => this.hideLoadingModal()))
      .subscribe({
        next: () => {
          this.notifyType = 'success';
          this.notifyTitle = 'Eliminado';
          this.notifyMessage = `El evento "${this.selectedToDelete!.eventName}" ha sido eliminado.`;
          this.showNotify = true;
          this.loadEvents();
          this.cd.detectChanges();
        },
        error: (err) => {
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.showNotify = true;
          this.cd.detectChanges();
        }
      });
  }
}
