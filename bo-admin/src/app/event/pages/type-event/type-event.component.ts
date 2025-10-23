import { handleHttpError } from '../../utils/handle-http-error.util';
import { Component, ViewChild, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, finalize } from 'rxjs/operators';

import { ListToolbarComponent } from '../../components/shared/list-toolbar/list-toolbar.component';
import { EmptyStateComponent } from '../../components/shared/empty-state/empty-state.component';
import { ModalTypeFormComponent } from '../../components/modals/modal-type-form/modal-type-form.component';
import { TableGenericComponent } from '../../../shared/components/tables/table-generic/table-generic.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';
import { TablePaginatorComponent } from '../../../shared/components/tables/table-paginator/table-paginator.component';

import { EventType } from '../../models/event-type.model';
import { EventTypeService } from '../../services/event-type.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-type-event',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ListToolbarComponent,
    EmptyStateComponent,
    ModalTypeFormComponent,
    TableGenericComponent,
    ModalNotifyComponent,
    ModalConfirmDeleteComponent,
    TablePaginatorComponent
  ],
  templateUrl: './type-event.component.html',
  styleUrls: ['./type-event.component.scss']
})
export class TypeEventComponent implements OnInit, OnDestroy {
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

  allEventTypes: EventType[] = [];
  eventTypes: EventType[] = [];

  pageSize = 8;
  pageIndex = 1;

  selectedToDelete: EventType | null = null;
  selectedToEdit: EventType | null = null;
  editMode = false;

  clearCountdownText: string = '';
  isCountdownActive: boolean = false;

  constructor(
    private eventTypeService: EventTypeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.loadEventTypes();
    this.routerEventsSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(evt => {
      if (evt.urlAfterRedirects.includes('/type-event')) {
        this.loadEventTypes();
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
    this.routerEventsSub?.unsubscribe();
  }

  get pagedData(): EventType[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.eventTypes.slice(start, start + this.pageSize);
  }

  loadEventTypes() {
    this.loading = true;
    this.eventTypeService.getAll().subscribe({
      next: (data) => {
        this.allEventTypes = data;
        this.eventTypes = [...data];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        const handled = handleHttpError(err);
        this.notifyType = handled.notifyType;
        this.notifyTitle = handled.notifyTitle;
        this.notifyMessage = handled.notifyMessage;
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
      this.eventTypes = [...this.allEventTypes];
      this.pageIndex = 1;
      this.cdr.detectChanges();
      return;
    }

    this.eventTypes = this.allEventTypes.filter(type => {
      const nameText = normalize(type.eventTypeName);
      const statusText = normalize(type.status ? 'activo' : 'inactivo');
      return nameText.includes(query) || statusText.includes(query);
    });

    this.pageIndex = 1;

    if (this.eventTypes.length === 0) {
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

  onEdit(row: EventType) {
    this.editMode = true;
    this.selectedToEdit = { ...row };
    this.showModal = true;
  }

  onSaveModal(data: { name: string; status: boolean }) {
    const nameLower = data.name.trim().toLowerCase();

    const isDuplicateCreate = !this.editMode && this.allEventTypes.some(e =>
      e.eventTypeName.trim().toLowerCase() === nameLower
    );
    const isDuplicateEdit = this.editMode && this.allEventTypes.some(e =>
      e.eventTypeId !== this.selectedToEdit?.eventTypeId &&
      e.eventTypeName.trim().toLowerCase() === nameLower
    );

    if (isDuplicateCreate || isDuplicateEdit) {
      this.notifyType = 'error';
      this.notifyTitle = 'Duplicado';
      this.notifyMessage = `Ya existe un tipo con el nombre “${data.name}”.`;
      this.showNotify = true;
      return;
    }

    this.showLoadingModal();

    const request$ = this.editMode && this.selectedToEdit
      ? this.eventTypeService.update(this.selectedToEdit.eventTypeId, {
        eventTypeName: data.name,
        status: data.status
      })
      : this.eventTypeService.create({
        eventTypeName: data.name,
        status: data.status
      });

    request$.pipe(
      finalize(() => this.hideLoadingModal())
    ).subscribe({
      next: () => {
        this.onCloseModal();
        this.notifyType = 'success';
        this.notifyTitle = this.editMode ? 'Actualizado' : 'Registro exitoso';
        this.notifyMessage = this.editMode
          ? `El tipo “${data.name}” ha sido actualizado.`
          : 'El nuevo tipo de evento ha sido registrado.';
        this.loadEventTypes();
        this.showNotify = true;
      },
      error: (err) => {
        setTimeout(() => {
          this.finalizeRequest({ closeEditModal: true });
          const handled = handleHttpError(err);
          this.notifyType = handled.notifyType;
          this.notifyTitle = handled.notifyTitle;
          this.notifyMessage = handled.notifyMessage;
          this.cdr.detectChanges();
        }, 0); //FyK <3
      }
    });
  }

  onCloseModal() {
    this.editMode = false;
    this.selectedToEdit = null;
    this.showModal = false;
  }

  onDelete(row: EventType) {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }

  onConfirmDelete() {
    if (!this.selectedToDelete) return;

    const name = this.selectedToDelete.eventTypeName;
    this.showLoadingModal();

    this.eventTypeService.delete(this.selectedToDelete.eventTypeId).pipe(
      finalize(() => this.hideLoadingModal())
    ).subscribe({
      next: () => {
        this.notifyType = 'success';
        this.notifyTitle = 'Eliminado';
        this.notifyMessage = `El tipo “${name}” ha sido eliminado.`;
        this.loadEventTypes();
        this.onCancelDelete();
        this.showNotify = true;
      },
      error: (err) => {
        setTimeout(() => {
          this.finalizeRequest({ closeDeleteModal: true });
          const handled = handleHttpError(err);
          this.notifyType = handled.notifyType;
          this.notifyTitle = handled.notifyTitle;
          this.notifyMessage = handled.notifyMessage;
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
