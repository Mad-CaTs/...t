import { Component } from '@angular/core';

import type { INavigationTab } from '@interfaces/shared.interface';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-create-prize-page',
	standalone: true,
	imports: [CommonModule, RouterOutlet, NavigationComponent],
	templateUrl: './create-prize-page.component.html',
	styleUrls: ['./create-prize-page.component.scss']
})
export class CreatePrizePageContainerComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/manage-prize/create-prize', name: 'Creación de Premios' },
		{ path: '/dashboard/manage-prize/create-prize/bonus-type', name: 'Tipo de Bonos'},
		{ path: '/dashboard/manage-prize/create-prize/attendance-control', name: 'Control de Asistencia' }
	];
}
