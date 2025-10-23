import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-retiros-page',
  templateUrl: './retiros-page.component.html',
  styleUrls: ['./retiros-page.component.scss'],
    standalone: true,
    imports: [CommonModule, NavigationComponent, RouterOutlet]
  
})
export class RetirosPageComponent {
	public readonly navigationData = [
		{ path: '/dashboard/manager-wallet/retiros', name: 'Retiros' },
	];
}
