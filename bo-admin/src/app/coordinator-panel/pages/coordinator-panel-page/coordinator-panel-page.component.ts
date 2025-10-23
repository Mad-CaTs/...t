import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-coordinator-panel-page',
	templateUrl: './coordinator-panel-page.component.html',
	styleUrls: ['./coordinator-panel-page.component.scss'],
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet]
})
export class CoordinatorPanelPageComponent {
	public readonly navigationData = [
		{ path: '/dashboard/coordinator-panel/general', name: 'Panel de Coordinador' },
		{
			path: '/dashboard/coordinator-panel/request-desplacement',
			name: 'Solicitud de Desposicionamiento'
		}
	];
}
