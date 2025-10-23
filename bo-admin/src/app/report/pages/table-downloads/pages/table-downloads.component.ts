import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadCardComponent, type DownloadCardData } from '../components/download-card/download-card.component';

@Component({
	selector: 'app-table-downloads',
	templateUrl: './table-downloads.component.html',
	styleUrls: ['./table-downloads.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		DownloadCardComponent
	]
})
export class TableDownloadsComponent {
	
	downloadCards: DownloadCardData[] = [
		{
			id: 'suscripcion',
			title: 'Suscripción',
			description: 'Descargar tabla de suscripción',
			icon: 'table_chart',
			filterType: 'date',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'user',
			title: 'User',
			description: 'Descargar tabla de usuarios',
			icon: 'person',
			filterType: 'date',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'afiliado',
			title: 'Afiliado',
			description: 'Descargar listado de afiliaciones',
			icon: 'group',
			filterType: 'date',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'cierre-residual',
			title: 'Cierre residual',
			description: 'Descargar tabla de cierre residual',
			icon: 'bar_chart',
			filterType: 'date',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'cierre-compuesto',
			title: 'Cierre compuesto',
			description: 'Descargar tabla de cierre compuesto',
			icon: 'pie_chart',
			filterType: 'date',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'codigos-paises',
			title: 'Códigos de los países',
			description: 'Descargar tabla de códigos',
			icon: 'public',
			filterType: 'none',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'estados',
			title: 'Estados',
			description: 'Descargar tabla de estados',
			icon: 'info',
			filterType: 'none',
			isDownloading: false,
			startDate: null,
			endDate: null
		},
		{
			id: 'rangos',
			title: 'Rangos',
			description: 'Descargar listado de rangos',
			icon: 'star',
			filterType: 'none',
			isDownloading: false,
			startDate: null,
			endDate: null
		}
	];

	constructor() {}
}