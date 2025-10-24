import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-progress-icon',
	standalone: true,
	imports: [],
	templateUrl: './progress-icon.component.html',
	styleUrl: './progress-icon.component.scss'
})
export default class ProgressIconComponent {
	@Input() percentage: number = 0;

	circleLength: number = 2 * Math.PI * 45;

	get formattedPercentage(): string {
		return this.percentage % 1 === 0 ? `${this.percentage}%` : `${this.percentage.toFixed(2)}%`;
	}

	getOffset(percentage: number): number {
		return this.circleLength - this.circleLength * (percentage / 100);
	}
}
