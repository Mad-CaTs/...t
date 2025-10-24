// Se lleva bien con table-paginator :)
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  ViewChild,
  ElementRef,
  TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CheckboxMode = 'none' | 'select' | 'accordion';

@Component({
  selector: 'app-table-generic',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './table-generic.component.html',
  styleUrls: ['./table-generic.component.scss']
})
export class TableGenericComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() columns: string[] = [];
  @Input() keys: string[] = [];
  @Input() data: any[] = [];
  @Input() statusKey: string = 'status';
  @Input() columnWidths?: string[];
  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 10;

  @Input() showView = false;
  @Input() showEdit = true;
  @Input() showDelete = true;
  @Input() showDeny = false;
  @Input() showAccept = false;
  @Input() showActions = true;
  @Input() onlyViewLabel: string = 'Detalle del evento';

  @Input() imageKeys: string[] = [];
  @Input() actionsWidthPercentOverride?: number;
  @Input() showCheckboxes = false;
  @Input() checkboxMode: CheckboxMode = 'none';
  @Input() rowSelectable?: (row: any) => boolean;
  @Input() freezeOverflow = false;
  @Input() rowEditSwitchKey: string | null = null;
  @Input() editTrueIconClass: string = 'bi bi-person-fill';
  @Input() editFalseIconClass: string = 'bi bi-pencil-square';
  @Input() editTrueTooltip: string = 'Editar asignación';
  @Input() editFalseTooltip: string = 'Editar';
  @Input() rowDetailTemplate?: TemplateRef<any>;

  @Output() view = new EventEmitter<any>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() deny = new EventEmitter<any>();
  @Output() accept = new EventEmitter<any>();
  @Output() editAlt = new EventEmitter<any>();

  selectedIndex: number | null = null;
  expandedRowIndex: number | null = null;
  selectAll = false;

  get effectiveCheckboxMode(): CheckboxMode {
    if (this.checkboxMode !== 'none') return this.checkboxMode;
    return this.showCheckboxes ? 'select' : 'none';
  }

  // ====== Layout / anchos ======
  get hasColumnWidths(): boolean {
    return Array.isArray(this.columnWidths) && this.columnWidths.length > 0;
  }

  private parsePercent(value: string): number {
    if (!value) return 0;
    value = value.trim();
    if (!value.endsWith('%')) return 0;
    const n = parseFloat(value.slice(0, -1));
    return isNaN(n) ? 0 : n;
  }

  get widthsPercentSum(): number {
    if (!this.hasColumnWidths) return 0;
    return this.columnWidths!
      .map((w) => this.parsePercent(w))
      .reduce((a, b) => a + b, 0);
  }

  // Porcentaje fijo reservado para la columna Acciones (requerido: 6%)
  readonly actionsWidthPercent = 6;

  get totalPercentIncludingActions(): number {
    const actions = this.showActions
      ? (this.actionsWidthPercentOverride ?? this.actionsWidthPercent)
      : 0;
    return this.widthsPercentSum + actions;
  }

  get isScrollable(): boolean {
    return this.hasColumnWidths && this.totalPercentIncludingActions > 100;
  }

  get actionsColumnWidth(): string | null {
    if (!this.showActions) return null;
    // Si supera 100% igual fijamos 6% y el wrapper hará scroll
    return (this.actionsWidthPercentOverride ?? this.actionsWidthPercent) + '%';
  }

  // Ancho efectivo de la tabla: mínimo 100%, si se supera se expande para permitir scroll horizontal
  get tableWidthPercent(): number {
    if (!this.hasColumnWidths) return 100;
    const total = this.totalPercentIncludingActions;
    return total <= 100 ? 100 : total; // p.e. 150 => 150% ancho real
  }
  get tableWidthPercentStyle(): number {
    return this.tableWidthPercent;
  }

  @ViewChild('tableWrapper', { static: false }) tableWrapperRef?: ElementRef<HTMLDivElement>;
  frozenWidthPx: number | null = null;

  private computeFrozenWidthOnce(): void {
    if (!this.freezeOverflow) return;
    if (!this.isScrollable) {
      this.frozenWidthPx = null; // sin overflow, usar % normal
      return;
    }
    const wrapper = this.tableWrapperRef?.nativeElement;
    if (!wrapper) return;
    if (this.frozenWidthPx != null) return; // ya congelado
    const containerWidth = wrapper.clientWidth;
    const total = this.totalPercentIncludingActions;
    // Convertimos el % total a píxeles según el ancho visible actual
    this.frozenWidthPx = Math.max(1, Math.round(containerWidth * (total / 100)));
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => this.computeFrozenWidthOnce());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showActions']) {
      // no-op; solo recalcular
    }
    setTimeout(() => this.computeFrozenWidthOnce());
  }

  // ====== Selección (modo 'select') ======
  onRowSelect(row: any) {
    // Si todos seleccionables están seleccionados, marcar selectAll
    if (this.effectiveCheckboxMode !== 'select') return;
    const selectable = this.getSelectableRows();
    this.selectAll = selectable.length > 0 && selectable.every((r) => !!r.selected);
  }

  toggleSelectAll() {
    if (this.effectiveCheckboxMode !== 'select') return;
    const selectable = this.getSelectableRows();
    selectable.forEach((row) => (row.selected = this.selectAll));
  }

  get isIndeterminate(): boolean {
    if (this.effectiveCheckboxMode !== 'select') return false;
    const selectable = this.getSelectableRows();
    const total = selectable.length;
    const sel = selectable.filter(r => !!r?.selected).length;
    return total > 0 && sel > 0 && sel < total;
  }

  /** Filtra y devuelve filas seleccionables (no pagadas ni pendientes de validación) */
  private getSelectableRows(): any[] {
    if (!Array.isArray(this.data) || this.data.length === 0) return [];
    if (typeof this.rowSelectable === 'function') {
      return this.data.filter(r => !!this.rowSelectable!(r));
    }
    // Por defecto, todas las filas son seleccionables
    return [...this.data];
  }

  /** Determina si una fila puede ser seleccionada por checkbox */
  isRowSelectable(row: any): boolean {
    if (!row) return false;
    if (typeof this.rowSelectable === 'function') {
      return !!this.rowSelectable(row);
    }
    return true;
  }

  // ====== Acordeón (modo 'accordion') ======
  toggleExpand(index: number, expand: boolean) {
    if (this.effectiveCheckboxMode !== 'accordion') return;
    this.expandedRowIndex = expand ? index : null;
  }

  // ====== UX fila seleccionada (pintar) ======
  toggleSelect(index: number): void {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  // ====== Utilidades ======
  toDate(value: any): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;

    if (typeof value === 'string') {
      let v = value.trim();

      // Si viene con fracción > 3 dígitos, recorta a 3 (milisegundos)
      v = v.replace(/(\.\d{3})\d+$/, '$1');

      // Si no trae zona horaria al final, agrega 'Z' (UTC)
      if (!/[Zz]$|[+\-]\d{2}:\d{2}$/.test(v)) {
        v += 'Z';
      }

      const d = new Date(v);
      return isNaN(d.getTime()) ? null : d;
    }

    return null;
  }

  /** Acceso seguro por path con puntos (a.b.c) */
  private getByPath(obj: any, path: string): any {
    return path.split('.').reduce((acc: any, k) => (acc ?? {})[k], obj);
  }

  /** ¿Esta fila usa el modo alterno de editar? */
  private isEditAlt(row: any): boolean {
    if (!this.rowEditSwitchKey) return false;
    const v = this.getByPath(row, this.rowEditSwitchKey);
    return !!v;
  }

  /** Clase de icono a renderizar para editar en esta fila */
  editIcon(row: any): string {
    return this.isEditAlt(row) ? this.editTrueIconClass : this.editFalseIconClass;
  }

  /** Tooltip a mostrar en el botón de editar en esta fila */
  editTooltip(row: any): string {
    return this.isEditAlt(row) ? this.editTrueTooltip : this.editFalseTooltip;
  }

  /** Click en editar: decide si emite (edit) o (editAlt) */
  onEditClick(row: any): void {
    if (this.isEditAlt(row)) this.editAlt.emit(row);
    else this.edit.emit(row);
  }
}
