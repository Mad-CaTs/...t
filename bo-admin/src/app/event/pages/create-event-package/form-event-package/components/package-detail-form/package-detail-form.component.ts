import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type IdName = { id: string; name: string };

export interface PackageFormData {
  eventId: string;
  eventName: string;
  zoneId: string;
  zoneName: string;
  quantity: number;
  freeUnits: number;

  packageName: string;

  description: string;
  validUntil: string;
  promoPricePen: number | null;
  promoPriceUsd: number | null;
}

@Component({
  selector: 'app-package-detail-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
  templateUrl: './package-detail-form.component.html',
  styleUrls: ['./package-detail-form.component.scss']
})
export class PackageDetailFormComponent implements OnChanges {
  @Input() value: PackageFormData = {
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

  @Input() events: IdName[] = [];
  @Input() zones: IdName[] = [];
  @Output() formChange = new EventEmitter<PackageFormData>();
  ngOnChanges(changes: SimpleChanges) {
    if (changes['zones'] && this.zones.length > 0) {
      const currentZoneValid = this.zones.some(z => z.id === this.model.zoneId);
      if (!currentZoneValid) {
        this.value.zoneId = '';
        this.value.zoneName = '';
        this.emit();
      }
    }

    if (changes['value'] && this.value) {
      if (this.value.promoPricePen !== null && this.value.promoPricePen !== undefined) {
        this.pricePenStr = this.value.promoPricePen.toFixed(2);
      } else {
        this.pricePenStr = '';
      }

      if (this.value.promoPriceUsd !== null && this.value.promoPriceUsd !== undefined) {
        this.priceUsdStr = this.value.promoPriceUsd.toFixed(2);
      } else {
        this.priceUsdStr = '';
      }
    }
  }

  pricePenStr = '';
  priceUsdStr = '';

  get model(): PackageFormData { return this.value; }
  emit() { this.formChange.emit({ ...this.model }); }

  /* ---------- HABILITACIÓN DE BOTONES ---------- */
  get canIncQty(): boolean { return true; }
  get canDecQty(): boolean { return this.model.quantity > 0; }
  get canIncFreeUnits(): boolean { return this.model.freeUnits < this.model.quantity; }
  get canDecFreeUnits(): boolean { return this.model.freeUnits > 0; }

  /* ---------- NUMÉRICOS ENTEROS (cantidad / gratuitas) ---------- */
  private toInt(v: unknown): number {
    const n = Math.floor(Number(String(v).replace(/[^\d]/g, '')));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  }

  // Bloquea +, -, ., e/E y todo lo que no sea dígito ni teclas de edición
  blockNonInteger(e: KeyboardEvent) {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    if (/^\d$/.test(e.key)) return; // solo 0-9
    e.preventDefault();
  }

  onQuantityChange(val: any) {
    this.model.quantity = this.toInt(val);
    if (this.model.freeUnits > this.model.quantity) {
      this.model.freeUnits = this.model.quantity;
    }
    this.emit();
  }

  onFreeUnitsChange(val: any) {
    this.model.freeUnits = this.toInt(val);
    if (this.model.freeUnits > this.model.quantity) {
      this.model.freeUnits = this.model.quantity;
    }
    this.emit();
  }

  increment(key: 'quantity' | 'freeUnits') {
    if (key === 'quantity') {
      if (!this.canIncQty) return;
      this.model.quantity = this.toInt(this.model.quantity) + 1;
      if (this.model.freeUnits > this.model.quantity) {
        this.model.freeUnits = this.model.quantity;
      }
    } else {
      if (!this.canIncFreeUnits) return;
      this.model.freeUnits = this.toInt(this.model.freeUnits) + 1;
    }
    this.emit();
  }

  decrement(key: 'quantity' | 'freeUnits') {
    if (key === 'quantity') {
      if (!this.canDecQty) return;
      this.model.quantity = Math.max(0, this.toInt(this.model.quantity) - 1);
      if (this.model.freeUnits > this.model.quantity) {
        this.model.freeUnits = this.model.quantity;
      }
    } else {
      if (!this.canDecFreeUnits) return;
      this.model.freeUnits = Math.max(0, this.toInt(this.model.freeUnits) - 1);
    }
    this.emit();
  }

  /* ---------- NORMALIZACIÓN DE TEXTOS (nombre/descr) ---------- */
  private normalizeText(s: unknown, max = 150): string {
    if (typeof s !== 'string') return '';
    const lines = s
      .split(/\r?\n/)
      .map(l => l.replace(/\s+/g, ' ').trim());
    let out = lines.join('\n');
    if (out.length > max) out = out.slice(0, max);
    return out;
  }

  emitNormalized() {
    this.model.packageName = this.normalizeText(this.model.packageName, 150);
    this.model.description = this.normalizeText(this.model.description, 150);
    this.emit();
  }
  private normalizeName(): void {
    if (typeof this.model.packageName !== 'string') return;
    let s = this.model.packageName.replace(/\s+/g, ' ').trim();
    if (s.length > 60) s = s.slice(0, 60);
    this.model.packageName = s;
  }

  emitNameNormalized(): void {
    this.normalizeName();
    this.emit();
  }

  preventLeadingSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    if (event.key === ' ' && (input.selectionStart ?? 0) === 0) event.preventDefault();
  }
  preventDoubleSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const pos = input.selectionStart ?? 0;
    if (event.key === ' ' && pos > 0 && input.value.charAt(pos - 1) === ' ') event.preventDefault();
  }
  preventLongSegmentOnType(event: KeyboardEvent): void {
    const key = event.key;
    if (key.length !== 1) return;
    if (/[\s\/:]/.test(key)) return;
    const input = event.target as HTMLTextAreaElement;
    const pos = input.selectionStart ?? 0;
    const end = input.selectionEnd ?? pos;
    const next = (input.value || '').slice(0, pos) + key + (input.value || '').slice(end);
    if (next.split(/[\s\/:]+/).some(seg => seg.length >= 30)) event.preventDefault();
  }
  preventLongSegmentOnPaste(event: ClipboardEvent): void {
    const paste = event.clipboardData?.getData('text') || '';
    if (paste.split(/[\s\/:]+/).some(seg => seg.length >= 30)) event.preventDefault();
  }

  /* ---------- PRECIOS (decimales) ---------- */
  blockInvalidPriceKeys(e: KeyboardEvent) {
    const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (allowed.includes(e.key)) return;
    if (/^\d$/.test(e.key)) return;
    if (e.key === '.' || e.key === ',') return;
    e.preventDefault();
  }

  onPriceInput(field: 'promoPricePen' | 'promoPriceUsd', raw: string) {
    let s = (raw ?? '').toString();
    s = s.replace(',', '.').replace(/[^\d.]/g, '');
    const firstDot = s.indexOf('.');
    if (firstDot !== -1) {
      const head = s.slice(0, firstDot + 1);
      const tail = s.slice(firstDot + 1).replace(/\./g, '');
      s = head + tail;
    }
    if (s.includes('.')) {
      const [intPart, decPart = ''] = s.split('.');
      s = intPart + '.' + decPart.slice(0, 2);
    }
    if (field === 'promoPricePen') this.pricePenStr = s;
    else this.priceUsdStr = s;
  }

  onPriceBlur(field: 'promoPricePen' | 'promoPriceUsd') {
    const str = field === 'promoPricePen' ? this.pricePenStr : this.priceUsdStr;
    const n = parseFloat((str || '').replace(',', '.'));
    if (!isFinite(n)) {
      if (field === 'promoPricePen') { this.model.promoPricePen = null; this.pricePenStr = ''; }
      else { this.model.promoPriceUsd = null; this.priceUsdStr = ''; }
      this.emit();
      return;
    }
    const roundedTenth = Math.round(n * 10) / 10;
    const fixed2 = roundedTenth.toFixed(2);
    if (field === 'promoPricePen') {
      this.model.promoPricePen = parseFloat(fixed2);
      this.pricePenStr = fixed2;
    } else {
      this.model.promoPriceUsd = parseFloat(fixed2);
      this.priceUsdStr = fixed2;
    }
    this.emit();
  }

  /* ---------- Selects ---------- */
  onEventChange(id: string) {
    const sel = this.events.find(e => e.id === id);
    this.model.eventId = id;
    this.model.eventName = sel?.name || '';
    this.emit();
  }
  onZoneChange(id: string) {
    const sel = this.zones.find(z => z.id === id);
    this.model.zoneId = id;
    this.model.zoneName = sel?.name || '';
    this.emit();
  }
}
