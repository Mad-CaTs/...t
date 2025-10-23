import { Component } from '@angular/core';

import type { INavigationTab } from '@interfaces/shared.interface';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
	selector: 'app-transfer-requests',
	standalone: true,
	imports: [CommonModule, RouterOutlet, NavigationComponent],
	templateUrl: './transfer-requests.component.html',
	styleUrls: ['./transfer-requests.component.scss']
})
export class TransferRequestsComponent {
	public readonly navigationData: INavigationTab[] = [
		{
			path: '/dashboard/requests/transfer',
			name: 'Billeteras electronicas'
		},
		{
			path: '/dashboard/requests/transfer/other-accounts',
			name: 'Otras cuentas'
		},
		{
			path: '/dashboard/requests/transfer/exclusive-brands',
			name: 'Marcas exclusivas'
		}
	];
}
