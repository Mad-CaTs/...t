import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { INavigationTab } from '@interfaces/shared.interface';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';

@Component({
  selector: 'app-qualification',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavigationComponent],
  templateUrl: './qualification.component.html',
  styleUrls: ['./qualification.component.scss']
})
export class QualificationComponent {
  	public readonly navigationData: INavigationTab[] = [
		{ path: '/dashboard/manage-prize/bonus-type/car/qualification/prequalified', name: 'Precalificados' },
		{ path: '/dashboard/manage-prize/bonus-type/car/qualification/qualified', name: 'Calificados' }
	];
}
