import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';

@Component({
	selector: 'app-packages',
	standalone: true,
	imports: [CommonModule, NavigationComponent, RouterOutlet],
	templateUrl: './packages.component.html',
	styleUrls: ['./packages.component.scss']
})
export class PackagesComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/manage-business/packages/families', name: 'Familia' },
		{ path: '/dashboard/manage-business/packages/packages', name: 'Paquete' },
		{ path: '/dashboard/manage-business/packages/detail', name: 'Detalle' },
		{ path: '/dashboard/manage-business/packages/historical', name: 'Histórico' },
		{ path: '/dashboard/manage-business/packages/codes', name: 'Código promocional' }
	];
}
