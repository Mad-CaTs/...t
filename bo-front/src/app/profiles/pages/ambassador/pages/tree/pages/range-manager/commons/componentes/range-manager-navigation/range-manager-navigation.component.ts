import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-range-manager-navigation',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './range-manager-navigation.component.html',
	styleUrl: './range-manager-navigation.component.scss'
})
export class RangeManagerNavigationComponent {
	@Output() tabChange = new EventEmitter<string>();
	activeTab: string = 'state';

	get navPosition() {
		switch (this.activeTab) {
			case 'state':
				return 'translateX(0%)';
			case 'score':
				return 'translateX(100%)';
			case 'range':
				return 'translateX(200%)';
			default:
				return 'translateX(0%)';
		}
	}

	setActiveTab(tab: string) {
		this.activeTab = tab;
		this.tabChange.emit(tab);
	}
}
