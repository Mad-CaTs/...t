import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MY_REWARDS } from './commons/contants';
import { Router } from '@angular/router';
import { MyRewardsCardComponent } from './commons/components/my-rewards-card/my-rewards-card.component';

@Component({
	selector: 'app-my-rewards',
	standalone: true,
	imports: [CommonModule, MyRewardsCardComponent],
	templateUrl: './my-rewards.component.html',
	styleUrl: './my-rewards.component.scss'
})
export class MyRewardsComponent {
	myRerwarsCards = MY_REWARDS;

	constructor(private router: Router) {}

	onViewClicked(id: number) {
		if (id === 3) {
			this.router.navigate(['/profile/ambassador/car-bonus-view']);
		}
	}
}
