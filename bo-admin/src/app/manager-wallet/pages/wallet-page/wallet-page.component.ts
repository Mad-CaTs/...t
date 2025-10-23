import { Component } from '@angular/core';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
	selector: 'app-wallet-page',
	templateUrl: './wallet-page.component.html',
	styleUrls: ['./wallet-page.component.scss'],
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet]
})
export class WalletPageComponent {
	public readonly navigationData = [
		{ path: '/dashboard/manager-wallet/wallet', name: 'Wallet' },
		/* { path: '/dashboard/manage-business/wallet/consilations', name: 'Conciliaciones' } */
	];
}
