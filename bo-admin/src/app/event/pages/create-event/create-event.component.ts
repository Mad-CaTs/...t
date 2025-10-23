import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { ListToolbarComponent } from '../../components/shared/list-toolbar/list-toolbar.component';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { TablePaginatorComponent } from '../../../shared/components/tables/table-paginator/table-paginator.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EventTypeService } from '../../services/event-type.service';
import { CreateEventService } from '../../services/create-event.service';
import { Event } from '../../models/event.model';
import { EventType } from '../../models/event-type.model';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { handleHttpError } from '../../utils/handle-http-error.util';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListToolbarComponent,
    EmptyStateComponent,
    TableGenericComponent,
    TablePaginatorComponent,
    ModalConfirmDeleteComponent,
    ModalNotifyComponent
  ],
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss']
})
export class CreateEventComponent implements OnInit, OnDestroy {
  @ViewChild(ListToolbarComponent) toolbar!: ListToolbarComponent;

  allEvents: Event[] = [];
  events: Event[] = [];

  pageSize = 8;
  pageIndex = 1;

  currentSearch: string = '';
  currentType: string = '';

  typeOptions: string[] = [];
  eventTypes: EventType[] = [];

  private resetTimeoutId: any;
  private resetIntervalId: any;
  private loadingModalRef: NgbModalRef | null = null;

  loading: boolean = true;
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' = 'success';
  selectedToDelete: Event | null = null;
  showDeleteModal: boolean = false;
  eventData: Event | null = null;
  editMode = false;

  constructor(
    private createEventService: CreateEventService,
    private eventTypeService: EventTypeService,
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.eventTypeService.getAll().subscribe({
      next: (types: EventType[]) => {
        this.eventTypes = types;
        this.typeOptions = types.map(t => t.eventTypeName);
        this.cd.detectChanges();

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.editMode = true;
          this.createEventService.getById(+id).subscribe({
            next: (event) => {
              this.eventData = event;
              this.cd.detectChanges();
            },
            error: () => {
              this.notifyType = 'error';
              this.notifyTitle = 'Error al cargar evento';
              this.notifyMessage = 'No se pudo cargar el evento para editar.';
              this.showNotify = true;
              this.cd.detectChanges();
            }
          });
        } else {
          this.editMode = false;
          this.eventData = null;
        }
        this.loadEvents();
      },
      error: (err) => {
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }

  private loadEvents(): void {
    this.loading = true;
    this.createEventService.getAll()
      .pipe(finalize(() => { this.loading = false; this.cd.detectChanges(); }))
      .subscribe(
        (events: Event[]) => {
          this.allEvents = events.map(evt => ({
            ...evt,
            eventTypeName: this.getEventTypeName(evt.eventTypeId),
            isMainEventText: evt.isMainEvent ? 'Destacado' : 'Secundario',
            eventDay: this.formatDate(evt.eventDate)
          }));
          this.events = [...this.allEvents];
          this.cd.detectChanges();
        },
        (err) => {
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.showNotify = true;
          this.cd.detectChanges();
        }
      );
  }

  getEventTypeName(eventTypeId: number): string {
    const found = this.eventTypes.find(t => t.eventTypeId === eventTypeId);
    return found ? found.eventTypeName : '';
  }

  private formatDate(dateString: string): string {
    if (!dateString) return '';
    const isoLike = /T|\d{2}:\d{2}/.test(dateString)
      ? dateString
      : `${dateString}T00:00:00`;
    const date = new Date(isoLike);
    if (isNaN(date.getTime())) return String(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  }

  get pagedData(): Event[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.events.slice(start, start + this.pageSize);
  }


  get visibleColumns(): string[] {
    return this.currentType && this.currentType !== 'Todos'
      ? [
        'Item',
        'Nombre del evento',
        'Fecha del evento',
        'Estado',
        'Flyer',
        'Destacado'
      ]
      : [
        'Item',
        'Nombre del evento',
        'Fecha del evento',
        'Tipo de evento',
        'Estado',
        'Flyer',
        'Destacado'
      ];
  }

  get visibleKeys(): string[] {
    return this.currentType && this.currentType !== 'Todos'
      ? ['item', 'eventName', 'eventDay', 'statusEvent', 'flyerUrl', 'isMainEventText']
      : ['item', 'eventName', 'eventDay', 'eventTypeName', 'statusEvent', 'flyerUrl', 'isMainEventText'];
  }

  get visibleWidths(): string[] {
    return this.currentType && this.currentType !== 'Todos'
      ? ['8%', '18%', '25%', '12%', '13%', '13%']
      : ['8%', '18%', '15%', '10%', '12%', '13%', '13%'];
  }

  onPageChange(newPage: number) {
    this.pageIndex = newPage;
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 1;
  }

  onSearch(value: string) {
    this.currentSearch = value.trim();
    this.applyFilters();
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

      const typeObj = this.eventTypes.find(t => t.eventTypeName === this.currentType);
      if (typeObj) {
        filtered = filtered.filter(evt => evt.eventTypeId === typeObj.eventTypeId);
      }
    }

    this.events = filtered;
    this.pageIndex = 1;

    if (this.events.length === 0) {
      clearInterval(this.resetIntervalId);
      clearTimeout(this.resetTimeoutId);
      let secondsLeft = 3;
      this.resetIntervalId = setInterval(() => secondsLeft--, 1000);
      this.resetTimeoutId = setTimeout(() => {
        clearInterval(this.resetIntervalId);
        this.toolbar.clear();
      }, 3000);
    }
  }

  onAdd() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }


  onView(row: Event) {
    this.router.navigate(['detail', row.eventId], {
      relativeTo: this.route,
      state: { from: 'create-event' }
    });
  }

  onEdit(row: Event) {
    this.router.navigate(['edit', row.eventId], { relativeTo: this.route });
  }

  onDelete(row: Event): void {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }

  private confirmDelete(): void {
    if (!this.selectedToDelete) return;
    this.showLoadingModal();
    this.createEventService.delete(this.selectedToDelete.eventId)
      .pipe(finalize(() => this.hideLoadingModal()))
      .subscribe(
        () => {
          this.notifyType = 'success';
          this.notifyTitle = 'Eliminado';
          this.notifyMessage = `El evento "${this.selectedToDelete!.eventName}" ha sido eliminado.`;
          this.showNotify = true;
          this.loadEvents();
          this.cd.detectChanges();
        },
        (err) => {
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.showNotify = true;
          this.cd.detectChanges();
        }
      );
  }
  onConfirmDelete(): void {
    this.showDeleteModal = false;
    this.confirmDelete();
  }
  onCancelDelete(): void {
    this.showDeleteModal = false;
  }

  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
  }

  private hideLoadingModal(): void {
    this.loadingModalRef?.close();
    this.loadingModalRef = null;
  }

  onNotifyClose(): void {
    this.showNotify = false;
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
  }
}
