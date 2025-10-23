import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-rate-manager',
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet],
	templateUrl: './rate-manager.component.html',
	styleUrls: ['./rate-manager.component.scss']
})
export class RateManagerComponent {
	public readonly navigationData: INavigationTab[] = [
		//{ path: '/dashboard/legal/rate-manager/penalty', name: 'Tarifa de penalidad' },
		{ path: '/dashboard/legal/rate-manager/legalization', name: 'Tarifa de legalizacion' }
	];
}
