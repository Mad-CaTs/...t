import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { FilterGenericComponent, FilterGenericConfig, FilterExtraButton } from '@shared/components/filters/filter-generic/filter-generic.component';
import { TableGenericComponent } from '@shared/components/tables/table-generic/table-generic.component';
import { PAGOS_AUTOS_MOCK } from './mock';


@Component({
  selector: 'app-socio-assignment',
  standalone: true,
  imports: [CommonModule, FilterGenericComponent, TableGenericComponent],
  templateUrl: './socio-assignment.component.html',
  styleUrls: ['./socio-assignment.component.scss']
})
export class SocioAssignmentComponent {
  constructor(private location: Location, private router: Router) {}
  @Input() socioId: number | null = null;
  @Output() close = new EventEmitter<void>();

  genericFilters: FilterGenericConfig[] = [
    { type: 'select', key: 'numeroDeCuotas', label: 'Número de Cuotas', order: 1, options: ['30', '40', '60'] },
    { type: 'select', key: 'status', label: 'Estado', order: 2, options: [{ label: 'Asignado', value: 'Asignado' }, { label: 'Sin asignar', value: 'Sin asignar' }] }
  ];

  filterValues: Record<string, any> = { numeroDeCuotas: '', status: '' };
  extraButtons: FilterExtraButton[] = [
    { key: 'export', label: 'Exportar', variant: 'primary', iconClass: 'bi bi-download' },
    { key: 'edit-insurance', label: 'Editar Seguro Vehicular', variant: 'primary', iconClass: 'bi bi-shield-check' },
    { key: 'send-initial-schedule', label: 'Enviar Cronograma Inicial', variant: 'primary', iconClass: 'bi bi-send' },
    { key: 'send-general-schedule', label: 'Enviar Cronograma general', variant: 'primary', iconClass: 'bi bi-send' },
  ];

  pagosColumns: string[] = [
    'Fecha Registro',
    'Concepto',
    'Valor Cuota (USD)',
    'Seguro (USD)',
    'Inicial Fraccionada (USD)',
    'Inicial Empresa (USD)',
    'GPS (USD)',
    'Bono Rango (USD)',
    'Pago Socio (USD)',
    'Fecha Límite',
    'Estado'
  ];
  pagosKeys: string[] = [
    'fechaRegistro',
    'concepto',
    'valorCuota',
    'seguro',
    'inicialFraccionada',
    'inicialEmpresa',
    'gps',
    'bonoRango',
    'pagoSocio',
    'fechaLimite',
    'estado'
  ];
  // Porcentajes alineados al total 100% (sin columna de acciones)
  pagosColumnWidths: string[] = [
    '8%',   // Fecha Registro
    '18%',  // Concepto
    '9%',   // Valor Cuota
    '7%',   // Seguro
    '11%',  // Inicial Fraccionada
    '10%',  // Inicial Empresa
    '6%',   // GPS
    '9%',   // Bono Rango
    '9%',   // Pago Socio
    '7%',   // Fecha Límite
    '6%'    // Estado
  ];
  pagosData = PAGOS_AUTOS_MOCK;

  back(): void {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }
    this.router.navigate(['/dashboard/manage-prize/bonus-type/car/car-assignment']);
  }

  onExtraAction(btn: FilterExtraButton): void {
    alert(`Botón: ${btn.label}`);
  }

}
