import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-status-progress-circle',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './status-progress-circle.component.html',
	styleUrl: './status-progress-circle.component.scss'
})
export class StatusProgressCircleComponent {
	@Input() data: any = {};

ngOnInit(): void {
}

	private getRingColor(p: number): string {
		if (p <= 20) return '#d1d1d1';
		if (p <= 40) return '#6bbac4';
		return '#19809e';
	}

	getProgressCircle(p: number): string {
		return `conic-gradient(${this.getRingColor(p)} ${p * 3.6}deg, transparent 0deg)`;
	}
}
