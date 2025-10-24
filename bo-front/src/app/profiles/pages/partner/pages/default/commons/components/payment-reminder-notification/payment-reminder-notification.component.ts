import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-payment-reminder-notification',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './payment-reminder-notification.component.html',
	styleUrl: './payment-reminder-notification.component.scss'
})
export class PaymentReminderNotificationComponent {
	@Input() daysLeft!: number;
	@Input() isExpired: boolean = false;
	@Input() expiredCount: number = 0;
	@Input() expiringSoonCount: number = 0;
	@Input() subscriptionId!: number; 
	@Input() notificationDate: number[] = []; 


	userId: any;

	constructor(private router: Router, private userInfoService: UserInfoService) {
		this.userId = this.userInfoService.userInfo.id;
		console.log('User ID obtenidoen dashboard:', this.userId);
	}
	getFormattedDate(): string {
		if (!this.notificationDate || this.notificationDate.length !== 3) return '';
		const [year, month, day] = this.notificationDate;
		// Asegúrate de agregar el 0 delante si el día o mes es menor a 10
		const dayStr = day.toString().padStart(2, '0');
		const monthStr = month.toString().padStart(2, '0');
		return `${dayStr}/${monthStr}/${year}`;
	}
	


	onCronogramaClick() {
		this.router.navigate([`/profile/partner/my-products/details/${this.subscriptionId}`]);
	}


}
