import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-historical',
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet],
	templateUrl: './historical.component.html',
	styleUrls: ['./historical.component.scss']
})
export class HistoricalComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/commission-manager/historical/commissions', name: 'Comisiones' },
		{ path: '/dashboard/commission-manager/historical/sponsors', name: 'Padrinos' }
	];
}
