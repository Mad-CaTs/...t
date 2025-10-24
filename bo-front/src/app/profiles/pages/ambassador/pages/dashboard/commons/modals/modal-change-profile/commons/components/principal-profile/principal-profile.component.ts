import { Component, Input } from '@angular/core';
import { ProfileRouteData } from '../../../../../interface';

@Component({
	selector: 'app-principal-profile',
	standalone: true,
	imports: [],
	templateUrl: './principal-profile.component.html',
	styleUrl: './principal-profile.component.scss'
})
export class PrincipalProfileComponent {
	@Input() public profile: ProfileRouteData;
}
