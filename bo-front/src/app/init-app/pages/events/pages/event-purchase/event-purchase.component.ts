import { Component } from '@angular/core';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DiscountCodeModalComponent } from '@shared/components/modal/discount-code-modal/discount-code-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MapContainer as MapComponent } from '@shared/components/map/map.container';
import { MapType } from '@shared/enums/map-type';
import { PublicEventService } from '../../services/public-event.service';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';
import { handleHttpError } from '@shared/utils/handle-http-error.util';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { PendingPurchaseService } from '@shared/services/pending-purchase.service';
import { EventPackageService } from 'src/app/init-app/pages/events/services/event-package.service';
import { GroupedResponse } from '../../models/event-package.model';
import { EventDiscountService } from '../../services/event-discount.service';
import { PublicAuthService } from '../../../public-access/auth/services/public-auth.service';
import { DiscountConfirmationModalComponent } from '@shared/components/modal/discount-confirmation-modal/discount-confirmation-modal.component';

@Component({
  selector: 'app-event-purchase',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent, LogoSpinnerComponent, ModalNotifyComponent, DynamicDialogModule],
  templateUrl: './event-purchase.component.html',
  styleUrls: ['./event-purchase.component.scss'],
  providers: [DialogService]
})
export class EventPurchaseComponent {
  /** Controla spinner de carga */
  isLoading = false;
  /** Controla modal de error */
  showNotify = false;
  notifyTitle = '';
  notifyMessage = '';
  notifyType: 'success' | 'error' | 'info' = 'info';
  acceptedTerms = false;
  private holdInterval: any;

  startHold(action: 'increase' | 'decrease', index: number, type: 'zone' | 'package' = 'zone') {
    this.stopHold();
    this.holdInterval = setInterval(() => {
      if (type === 'package') {
        if (action === 'increase') {
          this.increasePackage(index);
        } else {
          this.decreasePackage(index);
        }
      } else {
        if (action === 'increase') {
          this.increase(index);
        } else {
          this.decrease(index);
        }
      }
    }, 120);
  }

  stopHold() {
    if (this.holdInterval) {
      clearInterval(this.holdInterval);
      this.holdInterval = null;
    }
  }

  discountToasts: { id: number }[] = [];
  discountToastId = 0;

  discountCode: string = '';
  // Mostrar/ocultar banner de pack promocional
  showPackPromo = false;
  // Visibilidad del input de código de descuento
  showDiscountInput = false;
  private dialogRef?: DynamicDialogRef;

  // Estado de descuento aplicado
  appliedDiscountCode: string | null = null;
  appliedDiscountPercent: number = 0; // 0-100

  toggleDiscount() {
    this.showDiscountInput = !this.showDiscountInput;
  }

  showDiscountToast() {
    // Mostrar toast inmediatamente, sin spinner ni demora
    if (this.discountToasts.length >= 5) {
      this.discountToasts.shift();
    }
    const id = ++this.discountToastId;
    this.discountToasts.push({ id });
    this.discountCode = '';
    setTimeout(() => {
      this.discountToasts = this.discountToasts.filter(t => t.id !== id);
    }, 1800);
  }

  // Utilidad para transformar startDate si es string tipo 'hh:mm:ss'
  private parseStartDate(mock: any) {
    const val = mock.startDate;
    if (typeof val === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(val)) {
      const today = new Date();
      const [h, m, s] = val.split(':').map(Number);
      today.setHours(h, m, s, 0);
      return { ...mock, startDate: today };
    }
    return mock;
  }

  // Id del evento y datos base
  eventMock: any = null;

  // Paquetes del evento
  eventPackages: any[] = [];
  packageQuantities: number[] = [];

  id: string | null = null;
  shareUrl: string = window.location.href;
  MapType = MapType;

  constructor(
    private route: ActivatedRoute,
    private publicEventService: PublicEventService,
    private router: Router,
    private pending: PendingPurchaseService,
    private eventPackageService: EventPackageService,
    private dialogService: DialogService,
    private eventDiscounts: EventDiscountService,
    private publicAuth: PublicAuthService
  ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      window.scrollTo(0, 0);
      if (this.id) {
        this.loadEvent(+this.id);
      }
    });
  }

  /** Cierra el modal de notificación */
  onNotifyClose(): void {
    this.showNotify = false;
    this.router.navigate(['/home/events']);
  }

  /** Carga evento desde API */
  private loadEvent(id: number): void {
    this.isLoading = true;
    this.publicEventService.getById(id).subscribe({
      next: evt => {
        // Filtro: zonas inexistentes
        if (!evt.zones || evt.zones.length === 0) {
          this.isLoading = false;
          this.notifyType = 'error';
          this.notifyTitle = 'Evento no disponible';
          this.notifyMessage = 'Este evento no tiene zonas habilitadas para la venta.';
          this.showNotify = true;
          return;
        }
        // Filtro: evento pasado
        const [h, m] = (evt.startDate || '00:00:00').split(':');
        const eventDateTime = new Date(`${evt.eventDate}T${h.padStart(2,'0')}:${m}:00`);
        const now = new Date();
        if (eventDateTime < now) {
          this.isLoading = false;
          this.notifyType = 'error';
          this.notifyTitle = 'Evento expirado';
          this.notifyMessage = 'Este evento ya ha ocurrido. No es posible comprar entradas.';
          this.showNotify = true;
          return;
        }
        // Si pasa los filtros, muestra el evento
        this.eventMock = this.parseStartDate(evt);
        this.quantities = this.eventMock.zones.map(() => 0);
        this.packageQuantities = [];
        this.isLoading = false;

        // Cargar paquetes del evento
        this.loadEventPackages(id);
      },
      error: err => {
        this.isLoading = false;
        const info = handleHttpError(err);
        this.notifyType = info.notifyType;
        this.notifyTitle = info.notifyTitle;
        this.notifyMessage = info.notifyMessage;
        this.showNotify = true;
      }
    });
  }

  /** Carga paquetes del evento */
  private loadEventPackages(eventId: number): void {
    this.eventPackageService.getGrouped(0, 10).subscribe({
      next: (response: GroupedResponse) => {
        const event = response.events.find(e => e.eventId === eventId);
        this.eventPackages = event ? event.packages : [];
        this.packageQuantities = this.eventPackages.map(() => 0);
      },
      error: (err) => {
        this.eventPackages = [];
        this.packageQuantities = [];
      }
    });
  }

  get latitude(): number {
    return Number(this.eventMock?.venue?.latitude ?? 0);
  }
  get longitude(): number {
    return Number(this.eventMock?.venue?.longitude ?? 0);
  }
  /** Coords listas y válidas (evita 0,0 y NaN) */
  get hasValidCoords(): boolean {
    const lat = this.latitude;
    const lng = this.longitude;
    return Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
  }
  get mapCoordinates(): [number, number] {
    return [this.longitude, this.latitude];
  }
  get mapKey(): string {
    return `${this.longitude},${this.latitude}`;
  }
  get googleMapsUrl(): string {
    return `https://www.google.com/maps/place/${this.latitude},${this.longitude}/@${this.latitude},${this.longitude},17z`;
  }
  openInGoogleMaps(): void {
    window.open(this.googleMapsUrl, '_blank');
  }

  get isVirtual(): boolean {
    return this.eventMock?.eventType?.eventTypeName === 'Virtual';
  }

  /** Cantidades por zona (se inicializa tras cargar el evento) */
  quantities: number[] = [];

  /** Índice de la zona actualmente seleccionada en la tabla */
  selectedZone = 0;

  pillColors: string[] = [
    '#023959', // dark navy
    '#045077', // medium navy
    '#066895', // mid blue
    '#087cb3', // lighter blue
    '#0a9ac0'  // light blue
  ];

  selectZone(i: number): void {
    this.selectedZone = i;
  }

  public openDiscountModal = (): void => {
    if (!this.eventMock) return;
    // Bloquea aplicar descuento si no hay monto/entradas seleccionadas
    const noEntries = this.totalEntriesSelected <= 0;
    const noAmount = this.originalSubtotal <= 0;
    if (noEntries || noAmount) {
      this.dialogService.open(DiscountConfirmationModalComponent, {
        closable: false,
        width: '480px',
        styleClass: 'discount-confirmation-dialog',
        dismissableMask: false,
        closeOnEscape: false,
        data: {
          title: 'Selecciona entradas',
          message: 'Para aplicar un descuento, primero selecciona al menos una entrada con monto.',
          primaryText: 'Entendido',
          showIcon: true,
          iconSrc: '/assets/icons/events/evento_pasado.svg',
          iconBg: '#FEE2E2',
          iconSize: 56
        }
      });
      return;
    }
    this.dialogRef = this.dialogService.open(DiscountCodeModalComponent, {
      closable: false,
      width: '760px',
      style: { 'max-width': '95vw' },
      styleClass: 'discount-dialog',
      dismissableMask: true,
      data: {
        flyerUrl: this.eventMock?.flyerUrl ?? null,
        eventName: this.eventMock?.eventName ?? null
      }
    });

    this.dialogRef.onClose.subscribe((result: any) => {
      if (!result) return;
      if (result.couponCode) {
        const coupon = String(result.couponCode).trim();
        if (!coupon) return;

        this.isLoading = false;
        if (result.checkResult) {
          const check = result.checkResult;
          const isValid = check.valid === true || check.status === 'exists' || (typeof check.discountPercentage === 'number' && check.discountPercentage > 0);
          if (isValid) {
            try {
              const current = this.pending.get() || {};
              const selectedType = (result.type === 'promoter' || result.type === 'general') ? result.type : null;
              const apiType = selectedType === 'promoter' ? 'PROMOTER' : (selectedType === 'general' ? 'GENERAL' : null);
              if (apiType) {
                try { localStorage.setItem('discountType', apiType); } catch { /* no-op */ }
              }
              const merged = { ...current, coupon: coupon, couponCheck: check, discountType: apiType };
              this.pending.set(merged);
            } catch (e) { /* ignore */ }

            this.dialogService.open(DiscountConfirmationModalComponent, {
              closable: false,
              width: '480px',
              styleClass: 'discount-confirmation-dialog',
              dismissableMask: false,
              closeOnEscape: false,
              data: {
                title: 'Código correcto',
                message: check.message || '¡Listo! Se ha aplicado correctamente el descuento en tu compra.',
                showIcon: true,
                iconSrc: '/assets/icons/events/evento_favorito.svg',
                iconBg: '#e6f4ea',
                iconSize: 56
              }
            });

            this.discountCode = coupon;
            // Aplicar en estado local para recalcular totales
            const pct = Number(check?.discountPercentage ?? check?.data?.discountPercentage ?? check?.data?.percentage ?? 0);
            this.appliedDiscountCode = coupon;
            this.appliedDiscountPercent = Number.isFinite(pct) && pct > 0 ? pct : 0;
          } else {
            this.dialogService.open(DiscountConfirmationModalComponent, {
              closable: false,
              width: '480px',
              styleClass: 'discount-confirmation-dialog',
              dismissableMask: false,
              closeOnEscape: false,
              data: {
                title: 'Código inválido',
                message: check.message || 'El código no es válido para este evento.',
                primaryText: 'Entendido',
                showIcon: true,
                iconSrc: '/assets/icons/events/evento_pasado.svg',
                iconBg: '#FEE2E2',
                iconSize: 56
              }
            });
            this.showNotify = false;
          }
        } else {
        }

        return;
      }

      if (result.type === 'general' || result.type === 'promoter') {
      }
    });
  }
  /**
   * Indices de zonas ordenados por precio (de menor a mayor).
   * No muta el arreglo original `eventMock.zones` para no romper los índices
   * usados en la lógica de cantidades/capacidades. Se usa solo para renderizar.
   */
  get sortedZoneIndices(): number[] {
    const zones = this.eventMock?.zones ?? [];
    if (!Array.isArray(zones) || zones.length === 0) return [];
    return zones
      .map((z: any, idx: number) => ({
        idx,
        price: Number(z?.priceSoles ?? z?.price ?? Number.MAX_VALUE)
      }))
      .sort((a, b) => b.price - a.price)
      .map(x => x.idx);
  }

  getCapacity(z: any): number {
    const cap = Number(z?.capacity ?? z?.seats ?? 0);
    return Number.isFinite(cap) ? cap : 0;
  }

  getRemainingCapacityForZone(zoneId: number): number {
    const zone = this.eventMock?.zones?.find(z => z.eventZoneId === zoneId);
    if (!zone) return 0;
    const totalCapacity = this.getCapacity(zone);
    const totalSelected = this.getTotalEntriesForZone(zoneId);
    return Math.max(0, totalCapacity - totalSelected);
  }

  getMaxIndividualForZone(zoneId: number): number {
    const zone = this.eventMock?.zones?.find(z => z.eventZoneId === zoneId);
    if (!zone) return 0;
    const totalCapacity = this.getCapacity(zone);
    const packageEntries = this.eventPackages.reduce((sum, pkg, idx) => {
      const pkgZoneId = pkg.items?.[0]?.eventZoneId;
      if (pkgZoneId === zoneId) {
        const qty = this.packageQuantities[idx] ?? 0;
        return sum + qty * this.getPackageTotalEntries(pkg);
      }
      return sum;
    }, 0);
    return Math.max(0, totalCapacity - packageEntries);
  }

  getRemainingCapacityForIndividualTickets(zoneId: number): number {
    const max = this.getMaxIndividualForZone(zoneId);
    const zoneIndex = this.eventMock?.zones?.findIndex(z => z.eventZoneId === zoneId) ?? -1;
    const current = zoneIndex >= 0 ? this.quantities[zoneIndex] ?? 0 : 0;
    return Math.max(0, max - current);
  }

  isSoldOut(z: any): boolean {
    return this.getRemainingCapacityForIndividualTickets(z.eventZoneId) <= 0;
  }

  increase(i: number): void {
    const zone = this.eventMock.zones[i];
    const max = this.getMaxIndividualForZone(zone.eventZoneId);
    const current = this.quantities[i] ?? 0;
    if (current < max) {
      this.quantities[i] = current + 1;
    }
  }

  decrease(i: number): void {
    const current = this.quantities[i] ?? 0;
    if (current > 0) {
      this.quantities[i] = current - 1;
    }
  }

  increasePackage(i: number): void {
    const current = this.packageQuantities[i] ?? 0;
    const max = this.getMaxPackagesForPackage(i);
    if (current < max) {
      this.packageQuantities[i] = current + 1;
    }
  }

  decreasePackage(i: number): void {
    const current = this.packageQuantities[i] ?? 0;
    if (current > 0) {
      this.packageQuantities[i] = current - 1;
    }
  }

  /** Obtiene el nombre de la zona por eventZoneId */
  getZoneNameById(eventZoneId: number): string {
    const zone = this.eventMock?.zones?.find(z => z.eventZoneId === eventZoneId);
    return zone?.zoneName || 'Zona desconocida';
  }

  /** Obtiene la información de cantidad para un paquete */
  getPackageQuantityInfo(pkg: any): string {
    const totalQuantity = pkg.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
    const totalFree = pkg.items?.reduce((sum: number, item: any) => sum + (item.quantityFree || 0), 0) || 0;
    return `${totalQuantity} entradas + ${totalFree} entradas gratis`;
  }

  /** Obtiene el total de entradas que aporta un paquete */
  getPackageTotalEntries(pkg: any): number {
    const totalQuantity = pkg.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
    const totalFree = pkg.items?.reduce((sum: number, item: any) => sum + (item.quantityFree || 0), 0) || 0;
    return totalQuantity + totalFree;
  }

  /** Obtiene el total de entradas ya seleccionadas para una zona (tickets individuales + paquetes) */
  getTotalEntriesForZone(zoneId: number): number {
    // Entradas de tickets individuales
    const zoneIndex = this.eventMock?.zones?.findIndex(z => z.eventZoneId === zoneId) ?? -1;
    const individualEntries = zoneIndex >= 0 ? this.quantities[zoneIndex] ?? 0 : 0;

    // Entradas de paquetes que afectan esta zona
    const packageEntries = this.eventPackages.reduce((sum, pkg, idx) => {
      const pkgZoneId = pkg.items?.[0]?.eventZoneId;
      if (pkgZoneId === zoneId) {
        const qty = this.packageQuantities[idx] ?? 0;
        return sum + qty * this.getPackageTotalEntries(pkg);
      }
      return sum;
    }, 0);

    return individualEntries + packageEntries;
  }

  /** Obtiene el máximo de paquetes que se pueden seleccionar para un paquete específico */
  getMaxPackagesForPackage(i: number): number {
    const pkg = this.eventPackages[i];
    if (!pkg) return 0;

    const zoneId = pkg.items?.[0]?.eventZoneId;
    if (!zoneId) return 0;

    const remaining = this.getRemainingCapacityForIndividualTickets(zoneId);
    const currentPkgEntries = (this.packageQuantities[i] ?? 0) * this.getPackageTotalEntries(pkg);
    const effectiveRemaining = remaining + currentPkgEntries;
    const packageEntries = this.getPackageTotalEntries(pkg);

    if (packageEntries === 0) return 0;

    return Math.floor(effectiveRemaining / packageEntries);
  }

  get totalPrice(): number {
    const zonesTotal = this.eventMock?.zones?.reduce(
      (acc: number, z: any, idx: number) => acc + (z.priceSoles ?? 0) * (this.quantities[idx] ?? 0),
      0
    ) ?? 0;

    const packagesTotal = this.eventPackages?.reduce(
      (acc: number, pkg: any, idx: number) => acc + (pkg.pricePen ?? 0) * (this.packageQuantities[idx] ?? 0),
      0
    ) ?? 0;

    const base = zonesTotal + packagesTotal;
    // aplicar descuento porcentual si existe
    const discount = this.discountAmount(base);
    return Math.max(0, base - discount);
  }

  /** Subtotal antes de aplicar descuento (para mostrar precio original) */
  get originalSubtotal(): number {
    const zonesTotal = this.eventMock?.zones?.reduce(
      (acc: number, z: any, idx: number) => acc + (z.priceSoles ?? 0) * (this.quantities[idx] ?? 0),
      0
    ) ?? 0;
    const packagesTotal = this.eventPackages?.reduce(
      (acc: number, pkg: any, idx: number) => acc + (pkg.pricePen ?? 0) * (this.packageQuantities[idx] ?? 0),
      0
    ) ?? 0;
    return zonesTotal + packagesTotal;
  }

  /** Monto de descuento en soles a partir del subtotal */
  discountAmount(subtotal?: number): number {
    const base = typeof subtotal === 'number' ? subtotal : this.originalSubtotal;
    const pct = Number(this.appliedDiscountPercent || 0);
    if (!Number.isFinite(base) || !Number.isFinite(pct) || pct <= 0) return 0;
    return +(base * (pct / 100)).toFixed(2);
  }

  /** Cantidad total de entradas seleccionadas (para mensajes) */
  get totalEntriesSelected(): number {
    const zoneEntries = this.quantities.reduce((a, b) => a + (b || 0), 0);
    const packageEntries = this.eventPackages.reduce((sum, pkg, idx) => {
      const qty = this.packageQuantities[idx] ?? 0;
      return sum + qty * this.getPackageTotalEntries(pkg);
    }, 0);
    return zoneEntries + packageEntries;
  }

  /** Subtotal en dólares antes de aplicar descuento */
  get originalSubtotalUSD(): number {
    const zonesTotal = this.eventMock?.zones?.reduce(
      (acc: number, z: any, idx: number) => acc + (z.price ?? 0) * (this.quantities[idx] ?? 0),
      0
    ) ?? 0;
    const packagesTotal = this.eventPackages?.reduce(
      (acc: number, pkg: any, idx: number) => acc + (pkg.priceUsd ?? 0) * (this.packageQuantities[idx] ?? 0),
      0
    ) ?? 0;
    return zonesTotal + packagesTotal;
  }

  /** Monto de descuento en USD a partir del subtotal en USD */
  discountAmountUSD(subtotal?: number): number {
    const base = typeof subtotal === 'number' ? subtotal : this.originalSubtotalUSD;
    const pct = Number(this.appliedDiscountPercent || 0);
    if (!Number.isFinite(base) || !Number.isFinite(pct) || pct <= 0) return 0;
    return +(base * (pct / 100)).toFixed(2);
  }

  /** Total en dólares (aplicando descuento si corresponde) */
  get totalPriceUSD(): number {
    const baseUSD = this.originalSubtotalUSD;
    const discount = this.discountAmountUSD(baseUSD);
    return Math.max(0, baseUSD - discount);
  }

  onBuyTickets(): void {
    const eventId = this.id;
    const eventType = this.eventMock?.eventType?.eventTypeName;
    const eventName = this.eventMock?.eventName;

    // Construye detalle de compra por zona seleccionada
    const zonePurchases = this.quantities
      .map((qty, idx) => {
        if (qty > 0) {
          const zone = this.eventMock.zones[idx];
          const unitPriceSoles = zone.priceSoles ?? 0;
          const unitPriceUSD = zone.price ?? 0;
          return {
            zoneId: zone.eventZoneId ?? zone.id ?? idx,
            zoneName: zone.zoneName,
            quantity: qty,
            unitPrice: unitPriceSoles,          // soles (compat retro)
            subtotal: unitPriceSoles * qty,     // soles (compat retro)
            unitPriceUSD: unitPriceUSD,         // nuevo campo USD
            subtotalUSD: unitPriceUSD * qty     // nuevo campo USD
          };
        }
        return null;
      })
      .filter((x) => x);

    // Construye detalle de compra por paquete seleccionado
    const packagePurchases = this.packageQuantities
      .map((qty, idx) => {
        if (qty > 0) {
          const pkg = this.eventPackages[idx];
          const unitPriceSoles = pkg.pricePen ?? 0;
          const unitPriceUSD = pkg.priceUsd ?? 0;
          const totalQuantity = pkg.items?.reduce((sum: number, item: any) => sum + (item.quantity || 0), 0) || 0;
          const totalFree = pkg.items?.reduce((sum: number, item: any) => sum + (item.quantityFree || 0), 0) || 0;
          const description = `${totalQuantity} entradas + ${totalFree} entradas gratis`;
          return {
            packageId: pkg.ticketPackageId,
            packageName: pkg.name,
            zoneId: pkg.items[0]?.eventZoneId,
            zoneName: this.getZoneNameById(pkg.items[0]?.eventZoneId),
            entriesPerPackage: this.getPackageTotalEntries(pkg),
            description,
            quantity: qty,
            unitPrice: unitPriceSoles,          // soles (compat retro)
            subtotal: unitPriceSoles * qty,     // soles (compat retro)
            unitPriceUSD: unitPriceUSD,         // nuevo campo USD
            subtotalUSD: unitPriceUSD * qty     // nuevo campo USD
          };
        }
        return null;
      })
      .filter((x) => x);

    const purchases = [...zonePurchases, ...packagePurchases];

    // Construye lista de attendees basada en purchases
    const attendees: any[] = [];
    purchases.forEach(purchase => {
      if ((purchase as any).packageId) {
        // Paquete: expandir a (cantidad de paquetes * entradas por paquete)
        const entriesPer = Number((purchase as any).entriesPerPackage) || 1;
        const totalEntries = (Number(purchase.quantity) || 0) * entriesPer;
        for (let i = 0; i < totalEntries; i++) {
          const pkgName = (purchase as any).packageName ? String((purchase as any).packageName) : '';
          const displayName = pkgName ? `${purchase.zoneName} - ${pkgName}` : purchase.zoneName;
          attendees.push({
            entryType: displayName, // 'Zona X - Paquete Y' cuando viene de paquete
            docType: '',
            docNumber: '',
            firstName: '',
            lastName: ''
          });
        }
      } else if ((purchase as any).zoneId) {
        // Para zonas individuales
        for (let i = 0; i < (purchase as any).quantity; i++) {
          attendees.push({
            entryType: (purchase as any).zoneName,
            docType: '',
            docNumber: '',
            firstName: '',
            lastName: ''
          });
        }
      }
    });

    const payload = {
      eventId,
      eventName,
      eventType,
      purchases,
      totalSoles: this.totalPrice,
      totalUSD: this.totalPriceUSD,
      discount: this.appliedDiscountPercent > 0 ? {
        code: this.appliedDiscountCode,
        percentage: this.appliedDiscountPercent,
        amountSoles: this.discountAmount(),
        originalSubtotalSoles: this.originalSubtotal,
        amountUSD: this.discountAmountUSD(),
        originalSubtotalUSD: this.originalSubtotalUSD,
        type: (localStorage.getItem('discountType') as any) || null
      } : null,
      timestamp: new Date().toISOString(),
      user: null,
      attendees
    };
    // Persistir intención de compra para retomarla tras el login
    //console.log('Compra (payload):', payload);
    //console.log('Compra (JSON):', JSON.stringify(payload, null, 2));

    try {
      this.pending.set(payload);
      //console.log('[PendingPurchase] Guardado desde EventPurchase:', payload);
    } catch (e) {
      console.warn('[PendingPurchase] No se pudo guardar en sessionStorage:', e);
    }
    // Redirigir a la ruta solicitada (sin prefijo, el <base href> maneja /backoffice)
    this.router.navigate(['/login-selection']);
  }
}
