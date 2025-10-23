import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ITableBeneficiary } from '@interfaces/beneficiary';


@Component({
  selector: 'app-table-manager-beneficiaries',
  templateUrl: './table-manager-beneficiaries.component.html',
  styleUrls: ['./table-manager-beneficiaries.component.scss'],

})
export class TableManagerBeneficiariesComponent {

  @Input() dataBody: ITableBeneficiary[] = [];
  @Input() totalRecords: number = 0;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() refresh: EventEmitter<any> = new EventEmitter();
  @Input() pageIndex = 1;
  @Input() pageSize = 10;
  @Input() length = 0;
  isLoading = true;
  renderedRows: ITableBeneficiary[] = [];
  rows: ITableBeneficiary[] = [];
  @Output() edit = new EventEmitter<ITableBeneficiary>();
  @Output() remove = new EventEmitter<ITableBeneficiary>();

  constructor(private cdr: ChangeDetectorRef) { }

  get headers(): string[] {
    return [
      'N°', 'Fecha de registro', 'Nombre', 'Apellidos', 'N° de doc.',
      'Fecha de nac.', 'Email', 'N° de visitas', 'Fecha editable', 'Acciones'
    ];
  }

  get minWidthHeader(): number[] {
    return [40, 130, 120, 120, 110, 130, 220, 120, 130, 120];
  }

  format(value: any): string {
    if (!value) return '—';
    const d = new Date(value);
    return isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  }

  trackById = (_: number, row: ITableBeneficiary) => row.id ?? _;


}
