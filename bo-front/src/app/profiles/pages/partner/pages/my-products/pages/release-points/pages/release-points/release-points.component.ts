import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormReleasePointsComponent } from '../../commons/components/form-release-points/form-release-points.component';
import { HistoricReleasedPointComponent } from '../../commons/components/historic-released-point/historic-released-point.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import ReleasePointsCardComponent from '../../commons/components/release-points-card/release-points-card.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { RewardsPointsService } from '../../commons/services/rewards-points.service';

@Component({
	selector: 'app-release-points',
	standalone: true,
	imports: [
		FormReleasePointsComponent,
		HistoricReleasedPointComponent,
		CommonModule,
		MatIconModule,
		ReleasePointsCardComponent,
		ProgressSpinnerModule,
		BreadcrumbComponent
	],
	templateUrl: './release-points.component.html',
	styleUrl: './release-points.component.scss'
})
export class ReleasePointsComponent {
	@Input() id: number;
	currentView: 'points' | 'history' = 'points';
	idUsuario: number;
	idSuscription: number;
	cards: { points: number; title: string; iconSvg: string }[] = [];
	isLoading: boolean = false;
	portfolio: string = '';
	breadcrumbItems: BreadcrumbItem[] = [];
	constructor(
		private router: Router,
		private cdr: ChangeDetectorRef,
		private location: Location,
		private rewardPointsService: RewardsPointsService,
		private userInfoService: UserInfoService,
		private route: ActivatedRoute,
		private dialogService: DialogService
	) {}

	ngOnInit(): void {
		this.setBreadcrumbItems();
		this.idSuscription = Number(this.route.snapshot.paramMap.get('id'));
		this.idUsuario = this.userInfoService.userInfo?.id;
		if (this.idUsuario && this.idSuscription) {
			this.releasePoints(this.idUsuario, this.idSuscription);
		}
	}
	ngOnChanges() {
		this.setBreadcrumbItems();
	}

	releasePoints(idUsuario: number, idSus: number) {
		this.isLoading = true;
		this.rewardPointsService.releasePoints(idSus).subscribe({
			next: (response) => {
				if (response) {
					const data = response;
					this.portfolio = data?.familyPackageName;
					this.cards = [
						{ points: data?.totalRewardsToUse, title: data?.packageName, iconSvg: 'Coins' },
						{ points: data?.timeInterval, title: 'Intervalo a liberar', iconSvg: 'note_gray' },
						{
							points: data?.availableRewards,
							title: 'Recompensas',
							iconSvg: 'receipt-search_gray'
						},
						{
							points: data?.totalPaidQuotas,
							title: 'Cuotas pagadas',
							iconSvg: 'wallet-money__gray'
						}
					];
					this.isLoading = false;
					this.cdr.detectChanges();
				}
			},
			error: (error) => {
				console.error('Error al obtener los puntos:', error);
				this.isLoading = false;
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'Error al obtener los puntos.',
						title: '¡Error!',
						icon: 'pi pi-times-circle'
					}
				});
			}
		});
	}

	goBack() {
		this.location.back();
	}
	goHistorico() {
		this.currentView = 'history';
		this.setBreadcrumbItems();
	}
	goLiberarPuntos() {
		this.currentView = 'points';
		this.setBreadcrumbItems();
	}

	setBreadcrumbItems() {
		this.breadcrumbItems = [
			{ label: 'Mis productos', action: () => this.goBack() },
			{ label: 'Usar recompensas', action: () => this.goLiberarPuntos() }
		];

		if (this.currentView === 'history') {
			this.breadcrumbItems.push({
				label: 'Histórico de recompensas',
				isActive: true,
				action: () => this.goHistorico()
			});
		}
	}

	onExchangeHistoryClick(): void {
		this.router.navigate(['/profile/partner/my-products/exchange-history'], {});
	}
}
