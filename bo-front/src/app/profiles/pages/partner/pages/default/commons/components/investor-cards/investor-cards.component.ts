import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MembershipStatusCardComponent } from './commons/components/membership-status-card/membership-status-card.component';
import { PointsProgressCardComponent } from './commons/components/points-progress-card/points-progress-card.component';

@Component({
	selector: 'app-investor-cards',
	standalone: true,
	imports: [CommonModule, MembershipStatusCardComponent, PointsProgressCardComponent],
	templateUrl: './investor-cards.component.html',
	styleUrl: './investor-cards.component.scss'
})
export class InvestorCardsComponent {
	@Input() investorPoints: any;
	@Input() isLoading: boolean = false;
	@Input() userStatus!: string;
	@Input() statusColor!: { textColor: string; backgroundColor: string };
	@Input() rangoPeriodo;
	isChildLoading: boolean = false;

	constructor(private cdr: ChangeDetectorRef) { }

	onLoadingChange(loading: boolean) {
		this.isChildLoading = loading;
		this.cdr.detectChanges();
	}
}