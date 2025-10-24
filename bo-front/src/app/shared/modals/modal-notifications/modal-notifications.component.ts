import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
	selector: 'app-modal-notifications',
	standalone: true,
	templateUrl: './modal-notifications.component.html',
	imports: [CommonModule]
})
export class ModalNotificationsComponent {
	expiredSubscriptions: any[] = [];
	expiringSoonSubscriptions: any[] = [];

	// Annual liquidation
	expiredAnnualLiquidations: any[] = [];
	upcomingAnnualLiquidations: any[] = [];

	cuotasVencidas: any[] = [];
	cuotasVencenHoy: any[] = [];

	constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private router: Router) {
		this.expiredSubscriptions = config.data?.expiredSubscriptions ?? [];
		this.expiringSoonSubscriptions = config.data?.expiringSoonSubscriptions ?? [];
		this.expiredAnnualLiquidations = config.data?.expiredAnnualLiquidations ?? [];
		this.upcomingAnnualLiquidations = config.data?.upcomingAnnualLiquidations ?? [];
	}

	closeModal(): void {
		this.ref.close();
	}

	markAllAsRead(): void {
		this.expiredSubscriptions.forEach((item) => (item.read = true));
		this.expiringSoonSubscriptions.forEach((item) => (item.read = true));
	}

	onCronogramaClick(item: any): void {
		this.ref.close(item.idSuscription);
		this.router.navigate([`/profile/partner/my-products/details/${item.idSuscription}`]);
	}

	calculateExpirationDate(daysToAnnualLiquidation: number): Date {
		const date = new Date();
		date.setDate(date.getDate() + (364 - daysToAnnualLiquidation));
		return date;
	}
}
