import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class DetailScheduleMockService {
	public cardsData = [
		{
			title: 'Detalle del cronograma',
			iconSvg: 'assets/icons/chart.svg',
			items: [
				{ value: '$13000', label: 'Precio' },
				{ value: 'Auto', label: 'Bono' },
				{ value: 24, label: 'Cuotas' }
			]
		},
		{
			title: 'Fechas',
			iconSvg: 'assets/icons/Calendar_24px.svg',
			items: [
				{ value: '23/04/2025', label: 'Fecha de Asignación' },
				{ value: '23/11/2027', label: 'Fecha de Finalización' }
			]
		}
	];
}
