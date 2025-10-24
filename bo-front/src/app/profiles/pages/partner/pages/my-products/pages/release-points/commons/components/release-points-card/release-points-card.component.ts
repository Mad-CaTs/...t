import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import HistoricalRewardsComponent from './components/historical-rewards/historical-rewards.component';
import { notFoundComponent } from '@shared/components/not-found/not-found';

@Component({
	selector: 'app-release-points-card',
	standalone: true,
	imports: [CommonModule, notFoundComponent, HistoricalRewardsComponent],
	templateUrl: './release-points-card.component.html',
	styleUrl: './release-points-card.component.scss'
})
export default class ReleasePointsCardComponent {
	@Input() type: 'rewards' | 'exchanges' = 'rewards';
}
