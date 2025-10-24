import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type FilterType = 'search' | 'select' | 'date';

export interface FilterBase {
  type: FilterType;
  key: string;
  label: string;
  placeholder?: string;
  order?: number;
  className?: string;      // opcional: 'col-3', 'col-4', etc.
  showAllOption?: boolean; // si false, no renderiza 'Todos'
}

export interface SearchFilter extends FilterBase {
  type: 'search';
  debounceMs?: number;
  preventLeadingSpace?: boolean;
  iconClass?: string; // default 'bi bi-search'
}

/** Opción de select con 'disabled' opcional */
export interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export interface SelectFilter<T = any> extends FilterBase {
  type: 'select';
  options: Array<T extends object ? SelectOption : string>;
}

export interface DateFilter extends FilterBase {
  type: 'date';
  min?: string; // yyyy-MM-dd
  max?: string; // yyyy-MM-dd
}

export type FilterGenericConfig = SearchFilter | SelectFilter | DateFilter;

export interface FilterExtraButton {
  key: string;                 // identificador para el evento
  label: string;               // texto del botón
  variant?: 'primary' | 'ghost' | 'secondary' | 'danger' | 'link';
  iconClass?: string;          // ej: 'bi bi-plus'
  tooltip?: string;            // título/hover
  disabled?: boolean;          // deshabilitado
  show?: boolean;              // si false, no se muestra
}

@Component({
  selector: 'filter-generic',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './filter-generic.component.html',
  styleUrls: ['./filter-generic.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterGenericComponent implements OnDestroy {
  @Input({ required: true }) filters: FilterGenericConfig[] = [];
  @Input() values: Record<string, any> = {};

  /** Botones */
  @Input() showActionButton = true;
  @Input() actionText = 'Agregar';
  @Input() showClearButton = true;
  @Input() clearLabel = 'Limpiar';
  @Input() extraButtons: FilterExtraButton[] = [];

  /** Layout: 3 o 4 columnas en desktop */
  @Input() columnsDesktop: 3 | 4 = 3;

  @Output() valuesChange = new EventEmitter<Record<string, any>>();
  @Output() search = new EventEmitter<string>();
  @Output() action = new EventEmitter<void>();
  @Output() extraAction = new EventEmitter<FilterExtraButton>();

  private debounceRefs = new Map<string, any>();

  get ordered() {
    return [...this.filters].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  // helpers
  asOptions(f: FilterGenericConfig): SelectOption[] {
    if (f.type !== 'select') return [];
    return (f.options as any[]).map(o =>
      typeof o === 'string' ? ({ label: o, value: o }) : o
    );
  }
  iconOf(f: FilterGenericConfig): string {
    return f.type === 'search' && (f as SearchFilter).iconClass
      ? (f as SearchFilter).iconClass as string
      : 'bi bi-search';
  }
  minOf(f: FilterGenericConfig): string | null { return f.type === 'date' ? (f.min ?? null) : null; }
  maxOf(f: FilterGenericConfig): string | null { return f.type === 'date' ? (f.max ?? null) : null; }

  // interacción
  onFieldChange(f: FilterGenericConfig, raw: any) {
    const val = this.cleanSpacesIfNeeded(f, raw);
    this.values = { ...this.values, [f.key]: val };

    if (f.type === 'search') {
      const ms = (f as SearchFilter).debounceMs ?? 500;
      clearTimeout(this.debounceRefs.get(f.key));
      const ref = setTimeout(() => this.emitValues(), ms);
      this.debounceRefs.set(f.key, ref);
    } else {
      this.emitValues();
    }
  }

  onSearchClick() {
    const s = this.ordered.find(f => f.type === 'search') as SearchFilter | undefined;
    const v = (s ? this.values[s.key] : '') ?? '';
    this.search.emit(this.cleanSpacesIfNeeded(s, String(v)).trim());
  }

  preventLeadingSpace(event: KeyboardEvent, f: FilterGenericConfig) {
    if (f.type !== 'search') return;
    if (!(f as SearchFilter).preventLeadingSpace) return;
    const el = event.target as HTMLInputElement;
    if (event.key === ' ' && el.selectionStart === 0) event.preventDefault();
  }

  onActionClick() { this.action.emit(); }

  onExtraClick(btn: FilterExtraButton) {
    if (btn.disabled) return;
    this.extraAction.emit(btn);
  }

  onClear() {
    const cleared: Record<string, any> = {};
    for (const f of this.ordered) cleared[f.key] = '';
    this.values = cleared;
    this.emitValues();
    const s = this.ordered.find(x => x.type === 'search') as SearchFilter | undefined;
    if (s) this.search.emit('');
  }

  private emitValues() {
    const out: Record<string, any> = {};
    const current = this.values ?? {};
    for (const f of this.ordered) {
      const v = (current as any)[f.key];
      if (f.type === 'select') {
        // Para selects, emitimos también '' para representar 'Todos'
        out[f.key] = v ?? '';
      } else {
        if (v === '' || v == null) continue;
        out[f.key] = v;
      }
    }
    this.valuesChange.emit(out);
  }

  private cleanSpacesIfNeeded(f: FilterGenericConfig | undefined, val: any) {
    if (!f || f.type !== 'search' || typeof val !== 'string') return val;
    return val.replace(/\s{2,}/g, ' ');
  }

  trackByKey = (_: number, f: FilterGenericConfig) => f.key;
  trackByOpt = (_: number, o: SelectOption) => o.value;

  ngOnDestroy(): void { this.debounceRefs.forEach(clearTimeout); this.debounceRefs.clear(); }
}
