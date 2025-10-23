import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { EventZoneService } from '../../services/event-zone.service';
import { CreateEventService } from '../../services/create-event.service';
import { Event } from '../../models/event.model';
import { handleHttpError } from '@app/event/utils/handle-http-error.util';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { ListToolbarComponent } from '@app/event/components/shared/list-toolbar/list-toolbar.component';
import { GroupedTableComponent } from '@app/event/components/shared/grouped-table/grouped-table.component';
import { ModalZoneFormComponent } from '@app/event/components/modals/modal-zone-form/modal-zone-form.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { EntryTypeService } from '@app/event/services/entry-type.service';
import { SeatTypeService } from '@app/event/services/seat-type.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

@Component({  
  standalone: true,
  selector: 'app-create-zones-pricing',
  imports: [
    CommonModule,
    FormsModule,
    ListToolbarComponent,
    GroupedTableComponent,
    EmptyStateComponent,
    ModalZoneFormComponent,
    ModalNotifyComponent,
    ModalConfirmDeleteComponent
  ],
  templateUrl: './create-zones-pricing.component.html',
  styleUrls: ['./create-zones-pricing.component.scss']
})
export class CreateZonesPricingComponent implements OnInit {
  @ViewChild(ListToolbarComponent) toolbar!: ListToolbarComponent;
  private loadingModalRef: NgbModalRef | null = null;

  columnWidths: string[] = ['10%', '25%', '15%', '15%', '13%', '12%'];
  groupedZones: { title: string; data: any[] }[] = [];
  filteredZones: { title: string; data: any[] }[] = [];
  loading = false;
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';

  eventsList: Event[] = [];

  get modalEvents(): { id: number; name: string }[] {
    const usedTitles = new Set(this.groupedZones.map(g => g.title));
    return this.eventsList
      .filter(e => !usedTitles.has(e.eventName))
      .map(e => ({ id: e.eventId, name: e.eventName }));
  }

  tiposEntrada: { id: number; label: string }[] = [];

  tiposAsiento: { id: number; label: string }[] = [];

  clearCountdownText = '';
  isCountdownActive = false;
  private resetIntervalId: any;
  private resetTimeoutId: any;

  private isResettingSearch = false;

  showModal = false;
  showDeleteModal = false;
  selectedToDelete: any = null;

  constructor(
    private eventZoneService: EventZoneService,
    private createEventService: CreateEventService,
    private entryTypeService: EntryTypeService,
    private seatTypeService: SeatTypeService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadZones();
  }

  onSearch(value: string): void {
    if (this.isCountdownActive) return;
    if (this.isResettingSearch) {
      this.isResettingSearch = false;
      return;
    }
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = normalize(value.trim());
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);

    if (!query) {
      this.filteredZones = [...this.groupedZones];
      this.clearCountdownText = '';
      this.isCountdownActive = false;
      if (this.toolbar && this.toolbar.searchValue) {
        this.isResettingSearch = true;
        this.toolbar.clear();
      }
      this.cdr.detectChanges();
      return;
    }

    // Filtra solo por el título del grupo que contenga el texto buscado (like %texto%)
    this.filteredZones = this.groupedZones.filter(group => normalize(group.title).includes(query));

    if (this.filteredZones.length === 0) {
      this.isCountdownActive = true;
      let secondsLeft = 3;
      this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
      this.cdr.detectChanges();
      this.resetIntervalId = setInterval(() => {
        secondsLeft--;
        this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
        this.cdr.detectChanges();
      }, 1000);
      this.resetTimeoutId = setTimeout(() => {
        clearInterval(this.resetIntervalId);
        this.clearCountdownText = '';
        this.isCountdownActive = false;
        this.filteredZones = [...this.groupedZones];
        setTimeout(() => {
          this.isResettingSearch = true;
          this.toolbar.clear();
          this.cdr.detectChanges();
        }, 0);
      }, 3000);
    }
  }

  onAdd(): void {
    this.showModal = true;
  }

  onModalClose(): void {
    this.showModal = false;
  }

  onModalSave(value: any): void {
    // Mostrar modal de carga
    this.showLoadingModal();
    // Construir payload
    const zonesPayload = value.zonas.map((z: any) => ({
      seatTypeId: z.tipoAsientoId,
      zoneName: z.nombre,
      price: z.precioUsd,
      priceSoles: z.precio,
      capacity: z.aforo,
      seats: z.asientos
    }));
    this.eventZoneService.createEventZones(value.eventoId, value.tipoEntradaId, zonesPayload).pipe(
      finalize(() => {
        // Cerrar modal de carga
        this.hideLoadingModal();
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        // Mostrar notificación de éxito y recargar datos
        this.showModal = false;
        this.notifyType = 'success';
        this.notifyTitle = 'Éxito';
        this.notifyMessage = 'Zona y tarifa creada exitosamente';
        this.showNotify = true;
        this.loadZones();
      },
      error: (err: any) => {
        // Manejar error con utilidad común
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
      }
    });
  }

  onEdit(group: any): void {
    const eventId = group.data?.[0]?.eventId;
    if (eventId) {
      this.router.navigate([`/dashboard/events/zones-pricing/edit`, eventId]);
    }
  }

  onDelete(item: any): void {
    this.selectedToDelete = item;
    this.showDeleteModal = true;
  }

  onConfirmDelete(): void {
    if (!this.selectedToDelete) return;
    this.showLoadingModal();
    this.eventZoneService.delete(this.selectedToDelete.eventZoneId).pipe(
      finalize(() => {
        this.hideLoadingModal();
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.notifyType = 'success';
        this.notifyTitle = 'Éxito';
        this.notifyMessage = 'Zona eliminada exitosamente';
        this.showNotify = true;
        this.loadZones();
        this.onCancelDelete();
      },
      error: (err: any) => {
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
        this.onCancelDelete();
      }
    });
  }

  onCancelDelete(): void {
    this.selectedToDelete = null;
    this.showDeleteModal = false;
  }

  private showConfirmModal(message: string, title: string): Promise<boolean> {
    return new Promise(resolve => {
      const modalRef = this.modalService.open(ModalNotifyComponent, { centered: true });
      modalRef.componentInstance.title = title;
      modalRef.componentInstance.message = message;
      modalRef.componentInstance.type = 'warning';
      modalRef.componentInstance.confirm = true;
      modalRef.result.then((result: any) => {
        resolve(result === 'confirm');
      }, () => resolve(false));
    });
  }
  
  private loadZones(): void {
    this.loading = true;
    forkJoin({
      zones: this.eventZoneService.getAll(),
      events: this.createEventService.getAll(),
      entryTypes: this.entryTypeService.getAll(),
      seatTypes: this.seatTypeService.getAll()
    }).pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: ({ zones, events, entryTypes, seatTypes }) => {
        this.tiposEntrada = entryTypes.map(e => ({ id: e.ticketTypeId, label: e.ticketTypeName }));
        this.tiposAsiento = seatTypes.map(s => ({ id: s.seatTypeId, label: s.seatTypeName }));
        this.eventsList = events;
        const map = new Map<string, any[]>();
        let itemCounter = 1;
        zones.forEach(evtZone => {
          const ev = events.find(e => e.eventId === evtZone.eventId);
          const title = ev ? ev.eventName : evtZone.eventId.toString();
          evtZone.zones.forEach(detail => {
            const row = {
              item: itemCounter++,
              eventName: title,
              zoneName: detail.zoneName,
              capacity: `${detail.capacity} ${detail.capacity === 1 ? 'asiento' : 'asientos'}`,
              price: `$ ${detail.price.toFixed(2)}`,
              priceSoles: `S/ ${detail.priceSoles.toFixed(2)}`,
              eventId: evtZone.eventId,
              eventZoneId: evtZone.eventZoneId
            };
            if (!map.has(title)) {
              map.set(title, []);
            }
            map.get(title)!.push(row);
          });
        });
        this.groupedZones = Array.from(map.entries()).map(([title, data]) => {
          const event = events.find(e => e.eventName === title);
          return { 
            title, 
            imageUrl: event?.flyerUrl,
            data 
          };
        });
        this.filteredZones = [...this.groupedZones];
      },
      error: (err: any) => {
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
      }
    });
  }

  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(
      ModalLoadingComponentManageBusiness,
      { backdrop: 'static', keyboard: false, centered: true, size: 'sm' }
    );
  }

  private hideLoadingModal(): void {
    if (this.loadingModalRef) {
      this.loadingModalRef.close();
      this.loadingModalRef = null;
    }
  }
}
