import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { BonusCardComponent } from '../../commons/components/bonus-card/bonus-card.component';

@Component({
	selector: 'app-car-bonus-view',
	standalone: true,
	imports: [CommonModule, MatIconModule,BonusCardComponent],
	templateUrl: './car-bonus-view.component.html',
	styleUrl: './car-bonus-view.component.scss'
})
export class CarBonusViewComponent {
	constructor(private location: Location) {}

	goBack(): void {
		this.location.back();
	}
}
