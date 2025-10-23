import { Component } from '@angular/core';

import type { INavigationTab } from '@interfaces/shared.interface';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-events',
	standalone: true,
	imports: [CommonModule, RouterOutlet, NavigationComponent],
	templateUrl: './events.component.html',
	styleUrls: ['./events.component.scss']
})
export class EventsContainerComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/manage-home/events/payments', name: 'Pago de eventos' },
		{ path: '/dashboard/manage-home/events/list', name: 'Eventos' },
		{ path: '/dashboard/manage-home/events/event-types', name: 'Tipo de eventos' },
		{ path: '/dashboard/manage-home/events/event-subtypes', name: 'Subtipo' },
		{ path: '/dashboard/manage-home/events/links', name: 'Links' },
		{ path: '/dashboard/manage-home/events/landing', name: 'Landing' },
		{ path: '/dashboard/manage-home/events/travels', name: 'Viajes' },
		{ path: '/dashboard/manage-home/events/partners-list', name: 'Lista de socios' },
		//{ path: '/dashboard/manage-home/events/partners-list', name: 'Gestión de patrocinio'}
	];
}
