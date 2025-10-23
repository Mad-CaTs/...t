import { Component, EventEmitter, Input, Output } from '@angular/core';

type Row = { id: number; idPackage: number; portfolio: string; packageName: string; beneficiaries: number; rangeId: number | null; rangeText: string; };

@Component({
  selector: 'app-table-administrator-beneficiaries',
  templateUrl: './table-administrator-beneficiaries.component.html',
  styleUrls: ['./table-administrator-beneficiaries.component.scss']
})
export class TableAdministratorBeneficiariesComponent {

  @Input() rows: Row[] = [];
  @Input() loading = false;
  @Output() saveBeneficiaries = new EventEmitter<{ id: number; value: number }>();

  editing: Record<number, boolean> = {};
  buffer: Record<number, number> = {};

  get headers(): string[] {
    return ['Portafolio', 'Membresia', 'Rango', 'Beneficiarios', 'Acciones']
  }

  isEditing(id: number): boolean {
    return !!this.editing[id];
  }

  startEdit(r: Row) {
    this.editing[r.id] = true;
    this.buffer[r.id] = r.beneficiaries;
  }

  cancel(r: Row) {
    delete this.editing[r.id];
    delete this.buffer[r.id];
  }
  save(r: Row) {
    const val = Number(this.buffer[r.id]);
    if (isNaN(val) || val < 0) return;
    this.saveBeneficiaries.emit({ id: r.id, value: val });
    this.cancel(r);
  }

  badgeClass(id: number | null | undefined): string {
    switch (id) {
      case 1: return 'badge-basic';
      case 2: return 'badge-inter';
      case 3: return 'badge-top';
      default: return 'badge-neutral';
    }
  }

}
