import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { getMedalImage } from '../../../../../constants';
import { Router } from '@angular/router';

@Component({
	selector: 'app-bonus-card',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './bonus-card.component.html',
	styleUrl: './bonus-card.component.scss'
})
export class BonusCardComponent {
	subscriptionId = 9958;
	medalImageUrl = getMedalImage('Esmeralda');

	constructor(private router: Router) {}

	onCronogramaClick() {
		this.router.navigate(['/profile/ambassador/auto-bonus-schedule']);
	}
}
