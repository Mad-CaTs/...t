import { CommonModule, Location } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TableComponent } from '@shared/components/table/table.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';

@Component({
	selector: 'app-exchange-history',
	standalone: true,
	imports: [BreadcrumbComponent, CommonModule, SelectComponent, TableComponent],
	templateUrl: './exchange-history.component.html',
	styleUrl: './exchange-history.component.scss'
})
export class ExchangeHistoryComponent {
	breadcrumbItems: BreadcrumbItem[] = [];
	currentView: 'points' | 'history' | 'exchange-history' = 'exchange-history';

	exchangeHistory = [
		{
			fechaUso: '15/10/2024',
			tipoCanje: 'Canje de puntos',
			codigoCanje: 'SILVER*10',
			servicio: 'Alojamiento',
			descripcion: 'Departamento estándar vista piscina',
			checkIn: '15/10/2024',
			checkOut: '16/10/2024',
			cantidadPuntos: '1500 rewards',
			puntosUsados: '450 pts'
		},
		{
			fechaUso: '12/09/2024',
			tipoCanje: 'Canje de puntos',
			codigoCanje: 'SILVER*10',
			servicio: 'Alojamiento',
			descripcion: 'Departamento estándar vista piscina',
			checkIn: '12/09/2024',
			checkOut: '14/09/2024',
			cantidadPuntos: '1500 rewards',
			puntosUsados: '1000 pts'
		},
		{
			fechaUso: '05/08/2024',
			tipoCanje: 'Canje de puntos',
			codigoCanje: 'SILVER*10',
			servicio: 'Alojamiento',
			descripcion: 'Desayuno + alojamiento',
			checkIn: '05/08/2024',
			checkOut: '05/08/2024',
			cantidadPuntos: '2400 rewards',
			puntosUsados: '1500 pts'
		}
	];

	constructor(private router: Router, private cdr: ChangeDetectorRef, private location: Location) {}

	ngOnInit(): void {
		this.setBreadcrumbItems();
	}

	goBack() {
		this.location.back();
	}

	goLiberarPuntos() {
		this.currentView = 'points';
		this.setBreadcrumbItems();
	}

	goHistorico() {
		this.currentView = 'history';
		this.setBreadcrumbItems();
	}

	ngOnChanges() {
		this.setBreadcrumbItems(); // Se ejecuta cada vez que cambia currentView
	}

	setBreadcrumbItems() {
		this.breadcrumbItems = [
			{ label: 'Mis productos', action: () => this.goBack() },
			{ label: 'Usar recompensas', action: () => this.goBack() },
			{ label: 'Histórico de canje', action: () => this.goHistorico() } // Última página sin `url`
		];

		if (this.currentView === 'history') {
			this.breadcrumbItems.push({
				label: 'Histórico',
				isActive: true,
				action: () => this.goHistorico()
			});
		}
	}
}
