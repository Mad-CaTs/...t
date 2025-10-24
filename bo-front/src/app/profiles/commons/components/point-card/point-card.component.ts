import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-point-card',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './point-card.component.html',
	styleUrl: './point-card.component.scss'
})
export class PointCardComponent {
	@Input() cardData: {
		value: string;
		image?: string;
		description: string;
		subDescription?: string;
		initialsName?: string;
    labelTop?: string;

	};

	@Input() borderless: boolean = false;
	@Input() selected: boolean = false;

	
}
