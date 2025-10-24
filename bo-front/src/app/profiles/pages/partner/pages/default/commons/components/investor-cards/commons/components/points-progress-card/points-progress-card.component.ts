import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-points-progress-card',
	standalone: true,
	imports: [CommonModule, MatProgressBarModule, ProgressSpinnerModule],
	providers: [DatePipe],
	templateUrl: './points-progress-card.component.html',
	styleUrl: './points-progress-card.component.scss'
})
export class PointsProgressCardComponent implements OnChanges {
	@Input() investorPoints: any;
	@Input() isLoading: boolean = false;
	userIdStatus: number;
	@Input() userStatus!: string;
	@Input() statusColor!: { textColor: string; backgroundColor: string };
	@Input() rangoPeriodo;
	initialDate: string = ''
	endDate: string = ''


	constructor(private router: Router, private userInfoService: UserInfoService, private datePipe: DatePipe) {
		this.userIdStatus = this.userInfoService.userInfo.idState;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['rangoPeriodo'] && this.rangoPeriodo?.data) {
			const { initialDate, endDate } = this.rangoPeriodo.data;
			this.initialDate = this.formatDate(initialDate);
			this.endDate = this.formatDate(endDate);
		}
	}

	formatDate(dateArray: number[]): string {
		if (dateArray && dateArray.length >= 3) {
			const [year, month, day] = dateArray;
			const date = new Date(year, month - 1, day);
			return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
		}
		return '';
	}

	navigateToProducts(): void {
		this.router.navigate([`/profile/partner/my-products`]), {};
	}
}
