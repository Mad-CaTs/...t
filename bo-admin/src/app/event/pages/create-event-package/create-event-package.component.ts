import { Component, ViewChild, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { ListToolbarComponent } from '@app/event/components/shared/list-toolbar/list-toolbar.component';
import { EmptyStateComponent } from '@app/event/components/shared/empty-state/empty-state.component';
import { GroupedTableComponent } from '@app/event/components/shared/grouped-table/grouped-table.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';
import { ModalConfirmDeleteComponent } from '@shared/components/modals/modal-confirm-delete/modal-confirm-delete.component';

import { EventPackageService } from '../../services/event-package.service';
import { handleHttpError } from '../../utils/handle-http-error.util';
import { CreateEventService } from '../../services/create-event.service';
import { EventZoneService } from '@app/event/services/event-zone.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';

import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

interface ApiGroupedItem {
  eventPackageItemId: number;
  eventZoneId: number;
  quantity: number;
  quantityFree: number;
}
interface ApiGroupedPackage {
  ticketPackageId: number;
  name: string;
  description: string;
  pricePen: number;
  priceUsd: number;
  expirationDate: string;
  items: ApiGroupedItem[];
}
interface ApiGroupedEvent {
  eventId: number;
  eventName: string;
  countPackages: number;
  packages: ApiGroupedPackage[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
interface ApiGroupedResponse {
  events: ApiGroupedEvent[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

@Component({
  selector: 'app-create-event-package',
  standalone: true,
  imports: [
    CommonModule,
    ListToolbarComponent,
    EmptyStateComponent,
    GroupedTableComponent,
    ModalNotifyComponent,
    ModalConfirmDeleteComponent
  ],
  templateUrl: './create-event-package.component.html',
  styleUrls: ['./create-event-package.component.scss']
})
export class CreateEventPackageComponent implements OnInit, OnDestroy {
  @ViewChild(ListToolbarComponent) toolbar!: ListToolbarComponent;

  constructor(
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly pkgService: EventPackageService,
    private readonly modalService: NgbModal,
    private readonly eventService: CreateEventService,
    private readonly zonesSvc: EventZoneService
  ) {}

  ngOnInit(): void {
    this.loadPackages();
  }
  ngOnDestroy(): void {
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
  }

  loading = false;
  private loadingModalRef: NgbModalRef | null = null;
  readonly columns: string[] = ['Item', 'Nombre del paquete', 'Zona', 'Vigencia', 'Cantidad por paquete', 'Unidades gratuitas'];
  readonly keys: string[] = ['item', 'packageName', 'zone', 'validity', 'packageQtyText', 'freeUnits'];
  readonly columnWidths: string[] = ['8%', '20%', '17%', '10%', '20%', '15%'];

  currentSearch = '';
  clearCountdownText = '';
  isCountdownActive = false;
  private resetTimeoutId: any;
  private resetIntervalId: any;

  private groups: GroupRow[] = [];
  filteredGroups: GroupRow[] = [];

  apiPageIndex = 1;
  apiPageSize = 10;
  apiTotalElements = 0;
  apiTotalPages = 1;

  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';

  showDeleteModal = false;
  selectedToDelete: PackageRow | null = null;

  zoneNames: Record<number, string> = {};

  private normalize(s: string): string {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  }
  private cloneGroups(src: GroupRow[]): GroupRow[] {
    return src.map(g => ({ title: g.title, imageUrl: g.imageUrl, data: g.data.map(r => ({ ...r })) }));
  }
  private formatDateDMY(dateLike?: string | Date | null): string {
    if (!dateLike) return '—';
    let d: Date;
    if (typeof dateLike === 'string') {
      const needsLocalMidnight = !/T|\d{2}:\d{2}|[Zz]|[+\-]\d{2}:?\d{2}/.test(dateLike);
      const isoLike = needsLocalMidnight ? `${dateLike}T00:00:00` : dateLike;
      d = new Date(isoLike);
    } else {
      d = dateLike;
    }
    if (isNaN(d.getTime())) return '—';
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  onSearch(term: string): void {
    if (this.isCountdownActive) return;
    this.currentSearch = term || '';

    const q = this.normalize((term || '').trim());
    if (!q) {
      this.filteredGroups = this.cloneGroups(this.groups);
      this.clearCountdown();
      this.cdr.detectChanges();
      return;
    }

    this.filteredGroups = this.groups
      .filter(g => this.normalize(g.title).includes(q))
      .map(g => ({ ...g, data: g.data.map(r => ({ ...r })) }));

    if (this.filteredGroups.length === 0) this.startCountdown();
    else this.clearCountdown();
  }

  onAdd(): void {
    this.router.navigate(['/dashboard/events/package-event/new']);
  }

  onEdit(row: PackageRow): void {
    this.router.navigate(['/dashboard/events/package-event/edit', row.id]);
  }

  onDelete(row: PackageRow): void {
    this.selectedToDelete = row;
    this.showDeleteModal = true;
  }
  onConfirmDelete(): void {
    if (!this.selectedToDelete) return;
    this.showLoadingModal();

    this.pkgService.delete(this.selectedToDelete.id).pipe(
      finalize(() => {
        this.hideLoadingModal();
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: () => {
        this.notifyType = 'success';
        this.notifyTitle = 'Éxito';
        this.notifyMessage = 'Paquete eliminado exitosamente';
        this.showNotify = true;

        const willReloadPrevPage = this.groups.length === 1 && this.apiPageIndex > 1;
        if (willReloadPrevPage) this.apiPageIndex -= 1;

        this.showDeleteModal = false;
        this.selectedToDelete = null;
        this.loadPackages();
      },
      error: (err: any) => {
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;

        this.showDeleteModal = false;
        this.selectedToDelete = null;
      }
    });
  }
  onCancelDelete(): void {
    this.selectedToDelete = null;
    this.showDeleteModal = false;
  }

  onApiPageChange(page: number): void {
    if (page === this.apiPageIndex) return;
    this.apiPageIndex = page;
    this.loadPackages();
  }
  onApiPageSizeChange(size: number): void {
    if (size === this.apiPageSize) return;
    this.apiPageSize = size;
    this.apiPageIndex = 1;
    this.loadPackages();
  }

  private startCountdown(): void {
    this.isCountdownActive = true;
    let secondsLeft = 3;
    this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;

    this.resetIntervalId = setInterval(() => {
      secondsLeft--;
      this.clearCountdownText = `No se encontraron resultados. Limpiando en ${secondsLeft}...`;
      this.cdr.detectChanges();
    }, 1000);

    this.resetTimeoutId = setTimeout(() => {
      this.clearCountdown();
      this.filteredGroups = this.cloneGroups(this.groups);
      this.toolbar?.clear();
      this.cdr.detectChanges();
    }, 3000);
  }
  private clearCountdown(): void {
    this.isCountdownActive = false;
    this.clearCountdownText = '';
    clearTimeout(this.resetTimeoutId);
    clearInterval(this.resetIntervalId);
  }

  private loadPackages(): void {
    this.loading = true;

    const page0 = this.apiPageIndex - 1;
    const size = this.apiPageSize;

    forkJoin({
      resp: this.pkgService.getGrouped(page0, size),
      zones: this.zonesSvc.getAll()
    }).pipe(
      finalize(() => {
        // Las promesas aún pueden estar ejecutándose
        // this.loading = false;
        // this.cdr.detectChanges();
      })
    ).subscribe({
      next: ({ resp, zones }: { resp: ApiGroupedResponse; zones: any[] }) => {
        // Crear map de zoneNames
        this.zoneNames = {};
        zones.forEach((ez: any) => {
          ez.zones?.forEach((z: any) => {
            if (ez.eventZoneId) {
              this.zoneNames[ez.eventZoneId] = z.zoneName;
            }
          });
        });

        this.apiPageIndex = (resp.currentPage ?? 0) + 1;
        this.apiPageSize = resp.pageSize ?? size;
        this.apiTotalElements = resp.totalElements ?? 0;
        this.apiTotalPages = resp.totalPages ?? 1;

        const byEvent: GroupRow[] = [];
        let itemCounter = 1;

        const eventPromises = (resp.events ?? []).map(async (ev: ApiGroupedEvent) => {
          let flyerUrl: string | undefined;

          try {
            const eventDetails = await this.eventService.getById(ev.eventId).toPromise();
            flyerUrl = eventDetails?.flyerUrl;
          } catch (error) {
            console.warn(`No se pudo obtener flyerUrl para evento ${ev.eventId}:`, error);
            flyerUrl = undefined;
          }

          const rows: PackageRow[] = [];

          (ev.packages ?? []).forEach((p: ApiGroupedPackage) => {
            const qty = (p.items ?? []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
            const free = (p.items ?? []).reduce((acc, it) => acc + (Number(it.quantityFree) || 0), 0);
            const zonesText = p.items?.length
              ? p.items.map(it => {
                  const name = this.zoneNames[it.eventZoneId];
                  return name || `Zona ${it.eventZoneId}`;
                }).join(', ')
              : '—';

            rows.push({
              item: itemCounter++,
              id: Number(p.ticketPackageId),
              packageName: p.name || '—',
              zone: zonesText,
              validity: this.formatDateDMY(p.expirationDate),
              packageQtyText: `${qty} ${qty === 1 ? 'entrada' : 'entradas'}`,
              freeUnits: free
            });
          });

          return {
            title: ev.eventName || String(ev.eventId ?? 'Evento'),
            imageUrl: flyerUrl,
            data: rows
          };
        });

        Promise.all(eventPromises).then((groups) => {
          this.groups = groups;
          this.filteredGroups = this.cloneGroups(this.groups);
          this.loading = false;
          this.cdr.detectChanges();
        }).catch((error) => {
          console.error('Error obteniendo flyerUrls:', error);
          const fallbackGroups: GroupRow[] = (resp.events ?? []).map((ev: ApiGroupedEvent) => {
            const rows: PackageRow[] = [];
            (ev.packages ?? []).forEach((p: ApiGroupedPackage) => {
              const qty = (p.items ?? []).reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);
              const free = (p.items ?? []).reduce((acc, it) => acc + (Number(it.quantityFree) || 0), 0);
              const zonesText = p.items?.length
                ? p.items.map(it => {
                    const name = this.zoneNames[it.eventZoneId];
                    return name || `Zona ${it.eventZoneId}`;
                  }).join(', ')
                : '—';

              rows.push({
                item: itemCounter++,
                id: Number(p.ticketPackageId),
                packageName: p.name || '—',
                zone: zonesText,
                validity: this.formatDateDMY(p.expirationDate),
                packageQtyText: `${qty} ${qty === 1 ? 'entrada' : 'entradas'}`,
                freeUnits: free
              });
            });

            return {
              title: ev.eventName || String(ev.eventId ?? 'Evento'),
              imageUrl: undefined,
              data: rows
            };
          });

          this.groups = fallbackGroups;
          this.filteredGroups = this.cloneGroups(this.groups);
          this.loading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err: any) => {
        this.loading = false;
        this.cdr.detectChanges();
        const notify = handleHttpError(err);
        this.notifyType = notify.notifyType;
        this.notifyTitle = notify.notifyTitle;
        this.notifyMessage = notify.notifyMessage;
        this.showNotify = true;
      }
    });
  }

  private showLoadingModal(): void {
    this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
      backdrop: 'static',
      keyboard: false,
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
}

interface PackageRow {
  item?: number;
  id: number;
  packageName: string;
  zone: string;
  validity: string;
  packageQtyText: string;
  freeUnits: number;
}
interface GroupRow {
  title: string;
  imageUrl?: string;
  data: PackageRow[];
}
