import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ITabs } from '../../interface';

@Component({
	selector: 'app-tab-profiles',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './tab-profiles.component.html',
	styleUrl: './tab-profiles.component.scss'
})
export default class TabProfilesComponent {
	@Input() tabs: Array<ITabs>;
	@Input() styleType: 'default' | 'outlined' = 'default';

	selectedProfile: string;

	constructor(private router: Router) {}


}
