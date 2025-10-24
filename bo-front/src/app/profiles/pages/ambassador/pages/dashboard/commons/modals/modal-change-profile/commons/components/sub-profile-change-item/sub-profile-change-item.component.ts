import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProfileRouteData } from '../../../../../interface';

@Component({
	selector: 'app-sub-profile-change-item',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './sub-profile-change-item.component.html',
	styleUrl: './sub-profile-change-item.component.scss'
})
export class SubProfileChangeItemComponent {
	@Input() public profile : ProfileRouteData;
	@Output() selectSubProfile = new EventEmitter<string>();

	constructor() {}

	onSelectSubProfile() {
		this.selectSubProfile.emit(this.profile.user.username);
	}
}
