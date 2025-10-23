import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import {
  PackageDetailFormComponent,
  PackageFormData,
  IdName
} from './components/package-detail-form/package-detail-form.component';
import { PackageImagePreviewComponent } from '@app/event/pages/create-event-package/form-event-package/components';
import { PackageSummaryCardComponent } from '@app/event/pages/create-event-package/form-event-package/components';
import { PackageEventInfoComponent } from '@app/event/pages/create-event-package/form-event-package/components';

import { CreateEventService } from '@app/event/services/create-event.service';
import { Event } from '@app/event/models/event.model';
import { EventZoneService } from '@app/event/services/event-zone.service';
import { EventZone, EventZoneDetail } from '@app/event/models/event-zone.model';
import { EventVenueService } from '@app/event/services/event-venue.service';
import { EventVenue } from '@app/event/models/event-venue.model';
import { EntryTypeService } from '@app/event/services/entry-type.service';
import { EntryType } from '@app/event/models/entry-type.model';

import { EventPackageService } from '@app/event/services/event-package.service';
import { CreateUpdatePackagePayload, GroupedPackage } from '@app/event/models/event-package.model';

import { handleHttpError } from '@app/event/utils/handle-http-error.util';
import { LogoSpinnerComponent } from '@shared/components/logo-spinner/logo-spinner.component';
import { ModalNotifyComponent } from '@shared/components/modals/modal-notify/modal-notify.component';

type PackageEventInfo = {
  zone: string;
  date: string;
  venue: string;
  country: string;
  city: string;
  ticketType: string;
};

@Component({
  selector: 'app-form-event-package',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    PackageDetailFormComponent,
    PackageImagePreviewComponent,
    PackageSummaryCardComponent,
    PackageEventInfoComponent,
    LogoSpinnerComponent,
    ModalNotifyComponent
  ],
  templateUrl: './form-event-package.component.html',
  styleUrls: ['./form-event-package.component.scss']
})
export class FormEventPackageComponent implements OnInit {
  mode: 'create' | 'edit' = 'create';
  packageId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private eventsSvc: CreateEventService,
    private zonesSvc: EventZoneService,
    private venueSvc: EventVenueService,
    private entryTypeSvc: EntryTypeService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private pkgSvc: EventPackageService
  ) {}

  // estado del formulario
  formData: PackageFormData = {
    eventId: '',
    eventName: '',
    zoneId: '',
    zoneName: '',
    quantity: 0,
    freeUnits: 0,
    packageName: '',
    description: '',
    validUntil: '',
    promoPricePen: null,
    promoPriceUsd: null
  };

  // panel inferior izquierdo
  eventInfo: PackageEventInfo = {
    zone: '-',
    date: '-',
    venue: '-',
    country: '-',
    city: '-',
    ticketType: '-'
  };

  events: (IdName & { date?: string; flyerUrl?: string; ticketTypeId?: number; venueId?: number })[] = [];
  private zonesIndex: Record<string, IdName[]> = {};
  private minPriceByEventId: Record<string, number> = {};
  private eventZoneIdByEventAndZoneName: Record<string, number> = {};
  private byEventZoneId: Record<number, { eventId: string; zoneName: string }> = {};
  lowestPricePen: number | null = null;

  venues: EventVenue[] = [];
  private venuesIndex: Record<number, EventVenue> = {};

  entryTypes: EntryType[] = [];
  private entryTypesIndex: Record<number, string> = {};

  zonesForSelected: IdName[] = [];
  flyerPreview: { isUrl: true; url: string } | null = null;

  // UI
  loading = true;
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  private redirectOnNotifyClose = false;

  ngOnInit() {
    this.packageId = this.route.snapshot.paramMap.get('packageId');
    this.mode = this.packageId ? 'edit' : 'create';
    this.loadInitialData();
  }

  private loadInitialData() {
    this.loading = true;

    forkJoin({
      events: this.eventsSvc.getAll(),
      zones: this.zonesSvc.getAll(),
      venues: this.venueSvc.getAll(),
      entryTypes: this.entryTypeSvc.getAll()
    })
      .pipe(
        finalize(() => {
          setTimeout(() => {
            this.ngZone.run(() => {
              this.loading = false;
              this.cdr.detectChanges();
            });
          }, 500);
        })
      )
      .subscribe({
        next: ({ events, zones, venues, entryTypes }) => {
          this.buildZonesIndex(zones || []);

          const zoneEventIds = Object.keys(this.zonesIndex);
          this.events = (events || [])
            .filter((e: Event) => zoneEventIds.includes(String(e.eventId)))
            .map((e: Event) => ({
              id: String(e.eventId),
              name: e.eventName,
              date: e.eventDate,
              flyerUrl: e.flyerUrl,
              ticketTypeId: e.ticketTypeId,
              venueId: e.venueId
            }));

          if (this.events.length === 0) {
            this.notifyType = 'info';
            this.notifyTitle = 'Sin eventos disponibles';
            this.notifyMessage = 'No hay eventos con zonas disponibles para asignar paquetes.';
            this.showNotify = true;
            this.redirectOnNotifyClose = true;
            this.cdr.detectChanges();
            return;
          }

          this.venues = venues || [];
          this.venuesIndex = {};
          for (const v of this.venues) this.venuesIndex[(v as any).venueId] = v;

          this.entryTypes = entryTypes || [];
          this.entryTypesIndex = {};
          for (const et of this.entryTypes) this.entryTypesIndex[et.ticketTypeId] = et.ticketTypeName;

          if (this.mode === 'edit' && this.packageId) {
            this.fetchAndFillForEdit(+this.packageId);
          } else {
            // create
            this.zonesForSelected = [];
            this.lowestPricePen = null;
            this.eventInfo = { zone: '-', date: '-', venue: '-', country: '-', city: '-', ticketType: '-' };
            this.flyerPreview = null;
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          // limpia estado
          this.events = [];
          this.zonesIndex = {};
          this.eventZoneIdByEventAndZoneName = {};
          this.byEventZoneId = {};
          this.zonesForSelected = [];
          this.venues = [];
          this.venuesIndex = {};
          this.entryTypes = [];
          this.entryTypesIndex = {};
          this.minPriceByEventId = {};
          this.lowestPricePen = null;

          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.showNotify = true;
          this.redirectOnNotifyClose = true;
          this.cdr.detectChanges();
        }
      });
  }

  // índices: eventId->zonas, (eventId+zona)->eventZoneId y eventZoneId->(eventId,zona) 
  private buildZonesIndex(eventZones: EventZone[]) {
    const index: Record<string, IdName[]> = {};
    const minIndex: Record<string, number> = {};
    this.eventZoneIdByEventAndZoneName = {};
    this.byEventZoneId = {};

    for (const ez of eventZones) {
      const keyEvent = String(ez.eventId);
      const list: EventZoneDetail[] = ez?.zones ?? [];

      const mapped: IdName[] = list.map(z => {
        const name = (z.zoneName || '').trim();
        return { id: String(ez.eventZoneId), name };
      });

      if (!index[keyEvent]) index[keyEvent] = [];
      index[keyEvent].push(...mapped);

      for (const z of list) {
        const candidate = Number((z as any).priceSoles ?? (z as any).price ?? Number.NaN);
        if (Number.isFinite(candidate)) {
          if (!(keyEvent in minIndex) || candidate < minIndex[keyEvent]) {
            minIndex[keyEvent] = candidate;
          }
        }

        const zoneName = (z.zoneName || '').trim().toLowerCase();
        const resolved = Number(ez.eventZoneId);
        if (Number.isFinite(resolved) && resolved > 0) {
          const mapKey = `${keyEvent}::${String(ez.eventZoneId)}`;
          this.eventZoneIdByEventAndZoneName[mapKey] = resolved;
          this.byEventZoneId[resolved] = { eventId: keyEvent, zoneName: (z.zoneName || '').trim() };
        }
      }
    }

    // dedupe por nombre
    Object.keys(index).forEach(k => {
      const dedup = Array.from(new Map(index[k].map(z => [z.name.toLowerCase(), z])).values());
      index[k] = dedup;
    });

    this.zonesIndex = index;
    this.minPriceByEventId = minIndex;
  }

  private updateZonesForSelected(eventId: string) {
    this.zonesForSelected = this.zonesIndex[eventId] || [];
  }

  private applyEventSideEffects(
    ev: (IdName & { date?: string; flyerUrl?: string; ticketTypeId?: number; venueId?: number }) | null
  ) {
    const venue = ev?.venueId != null ? this.venuesIndex[Number(ev.venueId)] : undefined;
    const vAny = venue as any;
    const eventIdStr = (ev?.['id'] as string) || '';

    this.eventInfo = {
      zone: this.formData.zoneName || '-',
      date: ev?.date || '-',
      venue: vAny?.nameVenue ?? vAny?.name ?? '-',
      country: vAny?.country ?? '-',
      city: vAny?.city ?? '-',
      ticketType: ev?.ticketTypeId != null ? this.entryTypesIndex[ev.ticketTypeId] || '-' : '-'
    };
    this.flyerPreview = ev?.flyerUrl ? { isUrl: true, url: ev.flyerUrl } : null;
    this.lowestPricePen = eventIdStr ? this.minPriceByEventId[eventIdStr] ?? null : null;
  }

  // BINDINGS DEL HIJO
  onFormChange(data: PackageFormData) {
    const prevEventId = this.formData.eventId;
    this.formData = { ...data };

    if (this.formData.eventId && this.formData.eventId !== prevEventId) {
      const ev = this.events.find(e => e.id === this.formData.eventId) || null;
      this.applyEventSideEffects(ev);

      // reset zona + filtrar por el nuevo evento
      this.formData = { ...this.formData, zoneId: '', zoneName: '' };
      this.updateZonesForSelected(this.formData.eventId);
      this.lowestPricePen = this.minPriceByEventId[this.formData.eventId] ?? null;
    } else if (!this.formData.eventId && prevEventId) {
      this.zonesForSelected = [];
      this.lowestPricePen = null;
      this.eventInfo = { zone: '-', date: '-', venue: '-', country: '-', city: '-', ticketType: '-' };
      this.flyerPreview = null;
      this.formData = { ...this.formData, zoneId: '', zoneName: '' };
    } else {
      const ev = this.events.find(e => e.id === this.formData.eventId) || null;
      this.applyEventSideEffects(ev);
      if (this.formData.eventId) this.updateZonesForSelected(this.formData.eventId);
    }

    this.cdr.detectChanges();
  }

  get isSaveDisabled(): boolean {
    const f = this.formData;
    const hasPrice = ((f.promoPricePen ?? 0) > 0) || ((f.promoPriceUsd ?? 0) > 0);
    const nameOk = !!f.packageName?.trim();
    return !(f.eventId && f.zoneId && f.quantity > 0 && nameOk && !!f.description?.trim() && !!f.validUntil && hasPrice);
  }

  // === EDITAR: traer por ID y precargar ===
  private fetchAndFillForEdit(id: number) {
    this.loading = true;
    this.cdr.detectChanges();

    this.pkgSvc.getDetail(id)
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: (pkg: GroupedPackage) => {
          const item = pkg.items?.[0];
          if (!item) {
            this.notifyType = 'error';
            this.notifyTitle = 'Paquete sin items';
            this.notifyMessage = 'El paquete no contiene items para editar.';
            this.showNotify = true;
            return;
          }

          const ezInfo = this.byEventZoneId[item.eventZoneId];
          if (!ezInfo) {
            this.notifyType = 'error';
            this.notifyTitle = 'Zona no encontrada';
            this.notifyMessage = 'No se pudo mapear la zona del paquete con las zonas del evento.';
            this.showNotify = true;
            return;
          }

          // Precargar selects y campos
          const ev = this.events.find(e => e.id === ezInfo.eventId) || null;
          this.formData = {
            eventId: ezInfo.eventId,
            eventName: ev?.name || '',
            zoneId: String(item.eventZoneId),
            zoneName: ezInfo.zoneName,
            quantity: item.quantity,
            freeUnits: item.quantityFree,
            packageName: pkg.name,
            description: pkg.description,
            validUntil: pkg.expirationDate,
            promoPricePen: pkg.pricePen,
            promoPriceUsd: pkg.priceUsd
          };

          // efectos visuales
          if (ev) {
            this.applyEventSideEffects(ev);
            this.updateZonesForSelected(ezInfo.eventId);
            this.lowestPricePen = this.minPriceByEventId[ezInfo.eventId] ?? null;
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.showNotify = true;
        }
      });
  }

  // ACCIONES
  onBack() {
    this.router.navigate(['/dashboard/events/package-event']);
  }

  onSave() {
    this.loading = true;
    this.cdr.detectChanges();

    const f = this.formData;
    const mapKey = `${f.eventId}::${f.zoneId}`;
    const eventZoneId = this.eventZoneIdByEventAndZoneName[mapKey];

    if (!eventZoneId) {
      this.loading = false;
      this.notifyType = 'error';
      this.notifyTitle = 'Zona inválida';
      this.notifyMessage = 'No se pudo resolver el ID de la zona seleccionada. Vuelve a elegir la zona.';
      this.showNotify = true;
      this.cdr.detectChanges();
      return;
    }

    const payload: CreateUpdatePackagePayload = {
      eventId: Number(f.eventId),
      name: f.packageName.trim(),
      description: f.description.trim(),
      pricePen: Number(f.promoPricePen ?? 0),
      priceUsd: Number(f.promoPriceUsd ?? 0),
      expirationDate: f.validUntil,
      statusId: 1,
      changedBy: 9999,
      items: [{ eventZoneId, quantity: f.quantity, quantityFree: f.freeUnits }]
    };

    const req$ = this.mode === 'edit' && this.packageId
      ? this.pkgSvc.updatePackage(+this.packageId, payload)
      : this.pkgSvc.createPackage(payload);

    req$
      .pipe(finalize(() => { this.loading = false; this.cdr.detectChanges(); }))
      .subscribe({
        next: () => {
          this.notifyType = 'success';
          this.notifyTitle = this.mode === 'edit' ? 'Paquete actualizado' : 'Paquete creado';
          this.notifyMessage = this.mode === 'edit'
            ? 'Los cambios del paquete se guardaron correctamente.'
            : 'El paquete se creó correctamente.';
          this.showNotify = true;
          this.redirectOnNotifyClose = true;
        },
        error: (err) => {
          const notify = handleHttpError(err);
          this.notifyType = notify.notifyType;
          this.notifyTitle = notify.notifyTitle;
          this.notifyMessage = notify.notifyMessage;
          this.showNotify = true;
        }
      });
  }

  onNotifyClose() {
    this.showNotify = false;
    if (this.redirectOnNotifyClose) {
      this.onBack();
    }
  }
}
