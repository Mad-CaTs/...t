import {
  Component, EventEmitter, HostListener, Input, Output, ChangeDetectorRef,
  OnDestroy, ElementRef, ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeKind = 'neutral' | 'info' | 'success' | 'warning' | 'danger';
export type DetailAppearance = 'lines' | 'pills';

export interface DetailItem {
  label: string;
  value?: string | number | null;
  copy?: boolean;
  hint?: string;
  badge?: BadgeKind;
}

@Component({
  selector: 'app-modal-detail-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-detail-preview.component.html',
  styleUrls: ['./modal-detail-preview.component.scss']
})
export class ModalDetailPreviewComponent implements OnDestroy {
  /* Shell */
  @Input() show = true;

  /* Header */
  @Input() icon = 'bi bi-receipt';
  @Input() title = 'Detalle';
  @Input() subtitle = '';

  /* Apariencia */
  @Input() appearance: DetailAppearance = 'lines';
  @Input() columns: 1 | 2 | 3 = 1;
  @Input() tightValues = false;

  /* Items */
  @Input() items: DetailItem[] = [];

  /* Preview */
  @Input() showPreview = true;
  @Input() previewTitle = 'Imagen del voucher o evidencia bancaria';
  @Input() previewSrc: string | null | undefined = null;
  @Input() previewAlt = 'preview';
  @Input() previewEmptyText = 'Sin imagen';

  /* Footer */
  @Input() primaryLabel = 'Aceptar';
  @Input() primaryDisabled = false;
  @Input() primaryLoading = false;
  @Input() secondaryLabel = 'Rechazar';
  @Input() secondaryDisabled = false;

  @Output() primary = new EventEmitter<void>();
  @Output() secondary = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  /* Refs para medir */
  @ViewChild('canvas') canvasRef?: ElementRef<HTMLDivElement>;
  @ViewChild('imgEl') imgRef?: ElementRef<HTMLImageElement>;

  copyNoticeIndex: number | null = null;
  private copyNoticeTimer: any;

  /* Zoom & Pan */
  zoom = 1;
  translateX = 0;
  translateY = 0;
  isPanning = false;
  startX = 0;
  startY = 0;
  lastX = 0;
  lastY = 0;

  /* Medidas */
  private containerW = 0;
  private containerH = 0;
  private baseImgW = 0;
  private baseImgH = 0;

  constructor(private cdr: ChangeDetectorRef) { }

  formatValue(v: string | number | null | undefined): string {
    if (v === null || v === undefined) return '-';
    return typeof v === 'number' ? String(v) : v;
  }

  copy(text: string) { try { navigator.clipboard?.writeText(text); } catch { } }

  onCopyIndex(index: number, text: string) {
    this.copy(text);
    this.copyNoticeIndex = index;
    this.cdr.detectChanges();
    if (this.copyNoticeTimer) clearTimeout(this.copyNoticeTimer);
    this.copyNoticeTimer = setTimeout(() => {
      this.copyNoticeIndex = null;
      this.cdr.detectChanges();
    }, 2000);
  }

  /* Medición */
  onImgLoad() { this.measureAll(); }

  @HostListener('window:resize')
  onResize() { this.measureAll(); }

  private measureAll() {
    if (this.canvasRef) {
      const r = this.canvasRef.nativeElement.getBoundingClientRect();
      this.containerW = r.width;
      this.containerH = r.height;
    }
    if (this.imgRef?.nativeElement) {
      const natW = this.imgRef.nativeElement.naturalWidth || 0;
      const natH = this.imgRef.nativeElement.naturalHeight || 0;
      if (natW && natH && this.containerW && this.containerH) {
        const fit = Math.min(this.containerW / natW, this.containerH / natH, 1);
        this.baseImgW = natW * fit;
        this.baseImgH = natH * fit;
      }
    }
    this.clampPan();
    this.cdr.detectChanges();
  }

  private clampPan() {
    if (!this.containerW || !this.containerH || !this.baseImgW || !this.baseImgH) {
      this.translateX = this.translateY = this.lastX = this.lastY = 0;
      return;
    }
    const overflowX = Math.max(0, this.baseImgW * this.zoom - this.containerW);
    const overflowY = Math.max(0, this.baseImgH * this.zoom - this.containerH);

    const limitX = overflowX / 2;
    const limitY = overflowY / 2;

    this.translateX = Math.max(-limitX, Math.min(limitX, this.translateX));
    this.translateY = Math.max(-limitY, Math.min(limitY, this.translateY));
  }

  /* Zoom */
  zoomIn() {
    if (this.zoom < 2) {
      this.zoom = +(this.zoom + 0.25).toFixed(2);
      this.clampPan();
      this.cdr.detectChanges();
    }
  }

  zoomOut() {
    if (this.zoom > 1) {
      this.zoom = +(this.zoom - 0.25).toFixed(2);
      if (this.zoom <= 1) {
        this.zoom = 1;
        this.translateX = this.translateY = this.lastX = this.lastY = 0;
      } else {
        this.clampPan();
      }
      this.cdr.detectChanges();
    }
  }

  /* Pan */
  startPan(event: MouseEvent) {
    if (this.zoom <= 1) return;
    this.isPanning = true;
    this.startX = event.clientX - this.lastX;
    this.startY = event.clientY - this.lastY;
  }

  onPan(event: MouseEvent) {
    if (!this.isPanning) return;
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
    this.clampPan();
  }

  endPan() {
    if (!this.isPanning) return;
    this.isPanning = false;
    this.lastX = this.translateX;
    this.lastY = this.translateY;
  }

  ngOnDestroy(): void { if (this.copyNoticeTimer) clearTimeout(this.copyNoticeTimer); }

  onPrimary() { this.primary.emit(); }
  onSecondary() { this.secondary.emit(); }
  onClose() { this.close.emit(); }

  @HostListener('document:keydown.escape') onEsc() { this.onClose(); }

  trackByIndex = (i: number) => i;
}
