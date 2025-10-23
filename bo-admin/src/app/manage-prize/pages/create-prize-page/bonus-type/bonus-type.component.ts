import { Component } from '@angular/core';

import type { INavigationTab } from '@interfaces/shared.interface';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-bonus-type',
	standalone: true,
	imports: [CommonModule, RouterOutlet, NavigationComponent],
	templateUrl: './bonus-type.component.html',
	styleUrls: ['./bonus-type.component.scss']
})
export class BonusTypeComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/manage-prize/bonus-type/course', name: 'Bono Curso' },
		{ path: '/dashboard/manage-prize/bonus-type/travels', name: 'Bono Viajes' },
		{ path: '/dashboard/manage-prize/bonus-type/car', name: 'Bono Auto' },
		{ path: '/dashboard/manage-prize/bonus-type/estate', name: 'Bono Inmueble' }
	];
}
