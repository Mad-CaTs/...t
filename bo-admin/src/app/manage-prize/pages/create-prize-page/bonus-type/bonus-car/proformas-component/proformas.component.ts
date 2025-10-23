import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-proformas-component',
  standalone: true,
  imports: [CommonModule, NavigationComponent, RouterOutlet],
  templateUrl: './proformas.component.html',
  styleUrls: ['./proformas.component.scss']
})
export class ProformasComponent {
	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/manage-prize/bonus-type/car/proformas/list', name: 'Lista de Proformas' },
		{ path: '/dashboard/manage-prize/bonus-type/car/proformas/selected', name: 'Proformas Seleccionadas' }
	];
}
