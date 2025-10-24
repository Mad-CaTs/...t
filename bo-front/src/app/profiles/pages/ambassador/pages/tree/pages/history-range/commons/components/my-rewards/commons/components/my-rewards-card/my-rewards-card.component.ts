import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-my-rewards-card',
	standalone: true,
	imports: [CommonModule, MatIconModule, MyRewardsCardComponent],
	templateUrl: './my-rewards-card.component.html',
	styleUrl: './my-rewards-card.component.scss'
})
export class MyRewardsCardComponent {
	@Input() title = '';
	@Input() description = '';
	@Input() icon = 'bi-gift';
	@Input() helpText = '';
	@Input() id = 0;
	@Output() viewClicked = new EventEmitter<number>();

	onViewClick() {
    this.viewClicked.emit(this.id);
	}
}
