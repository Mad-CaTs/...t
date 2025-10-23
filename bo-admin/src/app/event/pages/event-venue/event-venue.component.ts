import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';

import { ListToolbarComponent } from '../../components/shared/list-toolbar/list-toolbar.component';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state.component';
import { ModalVenueFormComponent } from '../../components/modals/modal-venue-form/modal-venue-form.component';
import { TableGenericComponent } from '../../../shared/components/tables/table-generic/table-generic.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { TablePaginatorComponent } from '../../../shared/components/tables/table-paginator/table-paginator.component';

import { EventVenue } from '../../models/event-venue.model';
import { EventVenueService } from '../../services/event-venue.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { handleHttpError } from '../../utils/handle-http-error.util';

@Component({
  selector: 'app-event-venue',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListToolbarComponent,
    EmptyStateComponent,
    ModalVenueFormComponent,
    TableGenericComponent,
    ModalNotifyComponent,
    ModalConfirmDeleteComponent,
    TablePaginatorComponent
  ],
  templateUrl: './event-venue.component.html',
  styleUrls: ['./event-venue.component.scss']
})
export class EventVenueComponent implements OnInit, OnDestroy {
  @ViewChild(ListToolbarComponent) toolbar!: ListToolbarComponent;
  private loadingModalRef: NgbModalRef | null = null;

  loading = true;
  showModal = false;
  showNotify = false;
  showDeleteModal = false;

  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  notifyLoading = false;

  private resetTimeoutId: any;
  private resetIntervalId: any;
  private routerEventsSub?: Subscription;

  allVenues: EventVenue[] = [];
  venues: EventVenue[] = [];

  pageSize = 8;
  pageIndex = 1;

  selectedToDelete: EventVenue | null = null;
  selectedToEdit: EventVenue | null = null;
  editMode = false;

  clearCountdownText: string = '';
  isCountdownActive: boolean = false;

  constructor(
    private venueService: EventVenueService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.loadVenues();
    this.routerEventsSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(evt => {
      if (evt.urlAfterRedirects.includes('/event-venue')) {
        this.loadVenues();
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
    this.routerEventsSub?.unsubscribe();
  }

  get pagedData(): EventVenue[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.venues.slice(start, start + this.pageSize);
  }

  loadVenues() {
    this.loading = true;
    this.venueService.getAll().subscribe({
      next: (data) => {
        this.allVenues = data;
        this.venues = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
        this.cdr.detectChanges();
      }
    });
  }

  onPageChange(newPage: number) {
    this.pageIndex = newPage;
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.pageIndex = 1;
  }

  onSearch(value: string) {
    if (this.isCountdownActive) return;
    const normalize = (str: string) =>
      str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    const query = normalize(value.trim());
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);

    if (!query) {
      this.venues = [...this.allVenues];
      this.pageIndex = 1;
      this.cdr.detectChanges();
      return;
    }

    this.venues = this.allVenues.filter(venue => {
      const nameText = normalize(venue.nameVenue);
      return nameText.includes(query);
    });

    this.pageIndex = 1;

    if (this.venues.length === 0) {
      this.isCountdownActive = true;
      let secondsLeft = 3;
      this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
      this.resetIntervalId = setInterval(() => {
        secondsLeft--;
        this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
        this.cdr.detectChanges();
      }, 1000);
      this.resetTimeoutId = setTimeout(() => {
        clearInterval(this.resetIntervalId);
        this.clearCountdownText = '';
        this.isCountdownActive = false;
        this.toolbar.clear();
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  onAdd() {
    this.editMode = false;
    this.selectedToEdit = null;
    this.showModal = true;
  }

  onEdit(row: EventVenue) {
    this.editMode = true;
    this.selectedToEdit = { ...row };
    this.showModal = true;
  }

  onSaveModal(data: { country: string; city: string; nameVenue: string; address: string; latitude: number; longitude: number; status: boolean }) {
    const nameLower = data.nameVenue.trim().toLowerCase();

    const isDuplicateCreate = !this.editMode && this.allVenues.some(e =>
      e.nameVenue.trim().toLowerCase() === nameLower
    );
    const isDuplicateEdit = this.editMode && this.allVenues.some(e =>
      e.venueId !== this.selectedToEdit?.venueId &&
      e.nameVenue.trim().toLowerCase() === nameLower
    );

    if (isDuplicateCreate || isDuplicateEdit) {
      this.notifyType = 'error';
      this.notifyTitle = 'Duplicado';
      this.notifyMessage = `Ya existe un lugar con el nombre “${data.nameVenue}”.`;
      this.showNotify = true;
      return;
    }

    this.showLoadingModal();

    const payload = {
      country: data.country,
      city: data.city,
      nameVenue: data.nameVenue,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      status: data.status
    };
    const request$ = this.editMode && this.selectedToEdit
      ? this.venueService.update(this.selectedToEdit.venueId, payload)
      : this.venueService.create(payload);

    request$.pipe(
      finalize(() => this.hideLoadingModal())
    ).subscribe({
      next: () => {
        this.onCloseModal();
        this.notifyType = 'success';
        this.notifyTitle = this.editMode ? 'Actualizado' : 'Registro exitoso';
        this.notifyMessage = this.editMode
          ? `El lugar “${data.nameVenue}” ha sido actualizado.`
          : 'El nuevo lugar de evento ha sido registrado.';
        this.loadVenues();
        this.showNotify = true;
      },
      error: (err) => {
        setTimeout(() => {
          this.finalizeRequest({ closeEditModal: true });
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  onCloseModal() {
    this.editMode = false;
    this.selectedToEdit = null;
    this.showModal = false;
  }

  onDelete(row: EventVenue) {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }

  onConfirmDelete() {
    if (!this.selectedToDelete) return;

    const name = this.selectedToDelete.nameVenue;
    this.showLoadingModal();

    this.venueService.delete(this.selectedToDelete.venueId).pipe(
      finalize(() => this.hideLoadingModal())
    ).subscribe({
      next: () => {
        this.notifyType = 'success';
        this.notifyTitle = 'Eliminado';
        this.notifyMessage = `El lugar “${name}” ha sido eliminado.`;
        this.loadVenues();
        this.onCancelDelete();
        this.showNotify = true;
      },
      error: (err) => {
        setTimeout(() => {
          this.finalizeRequest({ closeDeleteModal: true });
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.cdr.detectChanges();
        }, 0);
      }
    });
  }

  onCancelDelete() {
    this.selectedToDelete = null;
    this.showDeleteModal = false;
  }

  onNotifyClose() {
    this.showNotify = false;
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

  private finalizeRequest(options: {
    closeEditModal?: boolean;
    closeDeleteModal?: boolean;
  }) {
    this.hideLoadingModal();
    if (options.closeEditModal) {
      this.showModal = false;
      this.editMode = false;
      this.selectedToEdit = null;
    }
    if (options.closeDeleteModal) {
      this.showDeleteModal = false;
      this.selectedToDelete = null;
    }
    this.showNotify = true;
  }
}
