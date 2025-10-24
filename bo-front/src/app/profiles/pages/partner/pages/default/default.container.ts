import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import DesktopComponent from './default.component';
import { PetResourceServerService } from './commons/services/pet-resource-server.service';
import { CardProyectComponent } from 'src/app/profiles/commons/components/card-proyect/card-proyect.component';
import { MyBriefcaseComponent } from './commons/components/my-resume/my-briefcase.component';
import { MyWalletDetailComponent } from './commons/components/my-wallet-detail/my-wallet-detail.component';
import { PaymentReminderNotificationComponent } from './commons/components/payment-reminder-notification/payment-reminder-notification.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { CommonModule } from '@angular/common';
//import { WalletService } from '../../../ambassador/pages/payments-and-comissions/pages/wallet/commons/services/wallet.service';
import { TreeService } from '../../../ambassador/pages/tree/commons/services/tree.service';
import { PeriodService } from '../../../ambassador/commons/components/box-cycle-weekly/commons/services/period.service';
import { ActivatedRoute } from '@angular/router';
import { SharedDataService } from '@shared/services/sharedData/shared-data.service';
import { PopupModalComponent } from 'src/app/profiles/commons/components/popup-modal/popup-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { WalletService } from '../../../ambassador/pages/wallet/commons/services/wallet.service';

@Component({
	selector: 'app-default',
	templateUrl: './default.container.html',
	styleUrls: ['./default.container.scss'],
	standalone: true,
	imports: [
		DesktopComponent,
		MatDividerModule,
		MatProgressBarModule,
		CardProyectComponent,
		MyBriefcaseComponent,
		MyWalletDetailComponent,
		PaymentReminderNotificationComponent,
		CommonModule
	]
})
export default class DesktopContainer {
	investorPoints: any;
	userId: number;
	daysLeft: number | null = null;
	showReminder: boolean = false;
	isExpired: boolean = false;
	nearestSubscriptionId: number | null = null;
	walletData: any;
	isLoading: boolean = false;
	expiredSubscriptions: any[] = [];
	expiringSoonSubscriptions: any[] = [];
	intervalId: any;
	nearestDateNotification!: number[];
	userStatus: string = '';
	userStates: any[] = [];
	statusColor: { textColor: string; backgroundColor: string } = { textColor: '', backgroundColor: '' };
	rangoPeriodo: any;
	responsesReceived: number = 0;
	totalExpectedResponses: number = 3;
	constructor(
		private readonly petResourceServerService: PetResourceServerService,
		private userInfoService: UserInfoService,
		private walletService: WalletService,
		private treeService: TreeService,
		private periodService: PeriodService,
		private route: ActivatedRoute,
		private sharedDataService: SharedDataService,
		private dialogService: DialogService
	) {
		this.userId = this.userInfoService.userInfo.id;
	}

	ngOnInit(): void {
		this.loadInvestorPoints();
		this.getExpiringSubscription();
		this.getWalletData();
		this.getListAllStates();
		this.obtenerRangoPeriodo();
	}

	/* checkLoginAndOpenModal() {
		if (this.sharedDataService.getFromLogin()) {
			this.openWelcomeModal();
			this.sharedDataService.setFromLogin(false);
		}
	} */

	openWelcomeModal() {
		const modalWidth = window.innerWidth < 768 ? '80vw' : '35vw';
		this.dialogService.open(PopupModalComponent, {
			width: modalWidth
		});
	}

	getNearestExpiringSubscription(subscriptions: any[]): any | null {
		const filtered = subscriptions.filter(
			(item) =>
				item.daysNextExpiration !== -999999 &&
				([11, 3, 0].includes(item.daysNextExpiration) || item.daysNextExpiration < 0)
		);

		if (filtered.length) {
			filtered.sort((a, b) => a.daysNextExpiration - b.daysNextExpiration);
			return filtered[0];
		}
		return null;
	}

	getData() {
		this.petResourceServerService.breeds().subscribe();
	}

	getExpiringSubscription(): void {
		this.petResourceServerService.getExpirationDays(this.userId).subscribe({
			next: (response) => {
				if (response?.data?.length) {
					const allData = response.data.filter((item) => item.daysNextExpiration !== -999999);

					this.expiredSubscriptions = allData.filter((item) => item.daysNextExpiration < 0);
					this.expiringSoonSubscriptions = allData.filter((item) =>
						[7, 3, 0].includes(item.daysNextExpiration)
					);

					const nearest = this.getNearestExpiringSubscription([
						...this.expiredSubscriptions,
						...this.expiringSoonSubscriptions
					]);

					if (nearest) {
						this.daysLeft = nearest.daysNextExpiration;
						this.nearestSubscriptionId = nearest.idSuscription;
						this.isExpired = this.daysLeft < 0;
						this.nearestDateNotification = nearest.dateExpiration;
						console.log('fecha', this.nearestDateNotification);
						this.showReminder = true;
						setTimeout(() => {
							this.showReminder = false;
						}, 3000);
					} else {
						this.showReminder = false;
					}
				}
			},
			error: (err) => {
				console.error('Error al obtener días de expiración:', err);
			}
		});
	}

	private loadInvestorPoints(): void {
		this.isLoading = true;
		this.petResourceServerService.getInvestorPoints(this.userId).subscribe({
			next: (response) => {
				this.investorPoints = response?.data ?? '';
				this.checkIfDone();
			},
			error: (err) => {
				console.error('Error al obtener los puntos del inversor:', err);
				this.checkIfDone();
			}
		});
	}

	getWalletData() {
		this.walletService.getWalletById(this.userId).subscribe({
			next: (data) => {
				this.walletData = data;
			},
			error: (error) => {
				console.error('Error al obtener datos del wallet', error);
			}
		});
	}

	checkIfDone(): void {
		this.responsesReceived++;
		if (this.responsesReceived >= this.totalExpectedResponses) {
			this.isLoading = false;
		}
	}

	getListAllStates(): void {
		this.treeService.getListAllStates().subscribe({
			next: (states) => {
				this.userStates = states;

				this.setUserStatus();
				this.checkIfDone();
			},
			error: (err) => {
				console.error('Error al obtener los estados:', err);
				this.checkIfDone();
			}
		});
	}

	setUserStatus(): void {
		const userIdStatus = this.userInfoService.userInfo.idState;
		if (this.userStates && this.userStates.length > 0) {
			const userState = this.userStates.find((state) => state.idState === userIdStatus);

			if (userState) {
				this.userStatus = userState.nameState;
				this.statusColor = this.getStatusColor(userState.colorRGB);
			} else {
				this.userStatus = 'Estado desconocido';
				this.statusColor = { textColor: '', backgroundColor: '' };
			}
		} else {
			this.userStatus = 'Estado desconocido';
			this.statusColor = { textColor: '', backgroundColor: '' };
		}
	}

	getStatusColor(colorRGB: string): { textColor: string; backgroundColor: string } {
		if (colorRGB) {
			return {
				textColor: colorRGB,
				backgroundColor: this.hexToRgba(colorRGB, 0.2)
			};
		}

		return { textColor: '', backgroundColor: '' };
	}

	private hexToRgba(hex: string, alpha: number): string {
		let r = parseInt(hex.slice(1, 3), 16);
		let g = parseInt(hex.slice(3, 5), 16);
		let b = parseInt(hex.slice(5, 7), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	obtenerRangoPeriodo(): void {
		this.periodService.getRangeBetween().subscribe({
			next: (data) => {
				console.log('Respuestafecha:', data);
				this.rangoPeriodo = data;
				this.checkIfDone();
			},
			error: (error) => {
				console.error('Error al obtener el rango:', error);
				this.checkIfDone();
			}
		});
	}
}
