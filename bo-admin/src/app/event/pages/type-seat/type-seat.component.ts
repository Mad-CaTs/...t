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


import { SeatType } from '../../models/seat-type.module';
import { SeatTypeService } from '../../services/seat-type.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { handleHttpError } from '../../utils/handle-http-error.util';

@Component({
  selector: 'app-type-seat',
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
  templateUrl: './type-seat.component.html',
  styleUrls: ['./type-seat.component.scss']
})
export class TypeSeatComponent implements OnInit, OnDestroy {
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

  allSeatTypes: SeatType[] = [];
  seatTypes: SeatType[] = [];

  pageSize = 8;
  pageIndex = 1;

  selectedToDelete: SeatType | null = null;
  selectedToEdit: SeatType | null = null;
  editMode = false;

  clearCountdownText: string = '';
  isCountdownActive: boolean = false;

  constructor(
    private seatTypeService: SeatTypeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public modalService: NgbModal,
  ) { }

  ngOnInit() {
    this.loadSeatTypes();
    this.routerEventsSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(evt => {
      if (evt.urlAfterRedirects.includes('/type-seat')) {
        this.loadSeatTypes();
      }
    });
  }

  ngOnDestroy() {
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
    this.routerEventsSub?.unsubscribe();
  }

  get pagedData(): SeatType[] {
    const start = (this.pageIndex - 1) * this.pageSize;
    return this.seatTypes.slice(start, start + this.pageSize);
  }

  loadSeatTypes() {
    this.loading = true;
    this.seatTypeService.getAll().subscribe({
      next: (data) => {
        this.allSeatTypes = data;
        this.seatTypes = [...data];
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
      this.seatTypes = [...this.allSeatTypes];
      this.pageIndex = 1;
      this.cdr.detectChanges();
      return;
    }

    this.seatTypes = this.allSeatTypes.filter(type => {
      const nameText = normalize(type.seatTypeName);
      const statusText = normalize(type.status ? 'activo' : 'inactivo');
      return nameText.includes(query) || statusText.includes(query);
    });

    this.pageIndex = 1;

    if (this.seatTypes.length === 0) {
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

  onEdit(row: SeatType) {
    this.editMode = true;
    this.selectedToEdit = { ...row };
    this.showModal = true;
  }

  onSaveModal(data: { name: string; status: boolean }) {
    const nameLower = data.name.trim().toLowerCase();

    const isDuplicateCreate = !this.editMode && this.allSeatTypes.some(e =>
      e.seatTypeName.trim().toLowerCase() === nameLower
    );
    const isDuplicateEdit = this.editMode && this.allSeatTypes.some(e =>
      e.seatTypeId !== this.selectedToEdit?.seatTypeId &&
      e.seatTypeName.trim().toLowerCase() === nameLower
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
      ? this.seatTypeService.update(this.selectedToEdit.seatTypeId, {
        seatTypeName: data.name,
        status: data.status
      })
      : this.seatTypeService.create({
        seatTypeName: data.name,
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
          : 'El nuevo tipo de asiento ha sido registrado.';
        this.loadSeatTypes();
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

  onDelete(row: SeatType) {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }

  onConfirmDelete() {
    if (!this.selectedToDelete) return;

    const name = this.selectedToDelete.seatTypeName;
    this.showLoadingModal();

    this.seatTypeService.delete(this.selectedToDelete.seatTypeId).pipe(
      finalize(() => this.hideLoadingModal())
    ).subscribe({
      next: () => {
        this.notifyType = 'success';
        this.notifyTitle = 'Eliminado';
        this.notifyMessage = `El tipo “${name}” ha sido eliminado.`;
        this.loadSeatTypes();
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
