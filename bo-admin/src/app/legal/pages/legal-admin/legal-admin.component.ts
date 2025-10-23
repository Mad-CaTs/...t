import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-legal-admin',
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet],
	templateUrl: './legal-admin.component.html',
	styleUrls: ['./legal-admin.component.scss']
})
export class LegalAdminComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/legal/legal-administrator/states-legalization', name: 'Estados Legalización' },
		{ path: '/dashboard/legal/legal-administrator/timeline-legalization', name: 'Cronograma' }
	];
}
