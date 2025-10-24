import { Component } from '@angular/core';
import { LanguajesService } from '@init-app/services';


@Component({
	selector: 'home-last-updates',
	templateUrl: './last-updates.component.html',
  standalone: true,
	styleUrls: ['./last-updates.component.scss']
})
export class LastUpdatesComponent {
	constructor(private language: LanguajesService) {}

	get lang() {
		return this.language.languageSelected.home.lastUpdates;
	}
}
