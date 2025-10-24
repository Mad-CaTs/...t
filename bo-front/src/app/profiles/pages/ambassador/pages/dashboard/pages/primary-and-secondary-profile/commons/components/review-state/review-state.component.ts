import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ScoreDetailsComponent } from "../score-details/score-details.component";
import { InvestorPoints } from '../../interfaces/dashboard.interface';
import { Button } from "primeng/button";

@Component({
	selector: 'app-review-state',
	templateUrl: './review-state.component.html',
	standalone: true,
	imports: [CommonModule, MatIconModule, ProgressSpinnerModule, ScoreDetailsComponent, Button],
	styleUrls: ['./review-state.component.scss']
})
export class ReviewStateComponent implements OnInit {
	@Output() refreshPointsRequested = new EventEmitter<void>();
	@Output() refreshBonusRequested = new EventEmitter<void>();
	@Input() isRefreshingPoints: boolean;
	@Input() isRefreshingBonus: boolean;
	@Input() investorPoints: InvestorPoints;
	@Input() volTotal: number;
	@Input() puntajeDeLaMembresia: number;
	@Input() numberTotal: number;
	@Input() tipo: 'Compuesto' | 'Residual';
	@Input() isLoading: boolean = true;
	public currentDateTime: string;
	@Input() singleBonus: any;

	constructor() { }

	ngOnInit(): void {
		this.setCurrentDateTime();
	}
	private setCurrentDateTime() {
		const today = new Date();
		const dateOptions: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

		let datePart = today.toLocaleDateString('es-ES', dateOptions);
		const timePart = today.toLocaleTimeString('en-US', timeOptions);

		datePart = this.capitalizeFirstLetter(datePart).replace(' de ', ' de ');

		this.currentDateTime = `${datePart}, ${timePart}`;
	}

	private capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	public requestRefreshPoints(): void {
		this.refreshPointsRequested.emit();
	}

	public requestRefreshBonus(): void {
		this.refreshBonusRequested.emit();
	}
}
