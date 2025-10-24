import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { Product } from 'src/app/profiles/pages/partner/pages/my-products/pages/product/commons/interfaces/products.interface';
import { TreeService } from '../../../pages/tree/commons/services/tree.service';
import { PeriodService } from './commons/services/period.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { InvestorPoints } from '../../../pages/dashboard/pages/primary-and-secondary-profile/commons/interfaces/dashboard.interface';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DialogService } from 'primeng/dynamicdialog';
import { ModalAllnearExpirationComponent } from '../modal-allnear-expiration/modal-allnear-expiration.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-box-cycle-weekly',
	providers: [DatePipe],
	templateUrl: './box-cycle-weekly.component.html',
	standalone: true,
	imports: [MatIconModule, CommonModule, MatProgressBarModule, ProgressSpinnerModule],
	styleUrls: ['./box-cycle-weekly.component.scss']
})
export default class BoxCycleWeeklyComponent implements OnInit {
	@Input() isLoading: boolean;
	@Input() memberships: any;
	@Input() result: any;
	@Input() investorPoints: InvestorPoints;
	@Input() withoutBox: boolean = false;
	@Input() allNearExpiration: any;
	filteredProducts: Product[] = [];
	userStatus: string = '';
	products: Product[] = [];
	rangoPeriodo: any;
	userStates: any[] = [];
	statusColor: { textColor: string; backgroundColor: string } = { textColor: '', backgroundColor: '' };
	statusColorOfMembership: { textColor: string; backgroundColor: string } = { textColor: '', backgroundColor: '' };
	initialDate: string = '';
	endDate: string = '';
	payMultiple: boolean = false;
	userInfo: any = this.userInfoService.userInfo;

	constructor(
		private userInfoService: UserInfoService,
		private treeService: TreeService,
		private periodService: PeriodService,
		private datePipe: DatePipe,
		private router: Router,
		private dialogService: DialogService,
	) { }

	ngOnInit(): void {
		this.getListAllStates();
		this.getPeriodRange();
	}

	getListAllStates(): void {
		this.treeService.getListAllStates().subscribe({
			next: (states) => {
				this.userStates = states;
				this.setUserStatus();
			},
			error: (err) => {
				console.error('Error al obtener los estados:', err);
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

	getPeriodRange(): void {
		this.periodService.getRangeBetween().subscribe({
			next: (data) => {
				this.rangoPeriodo = data;
				this.initialDate = this.formatDate(this.rangoPeriodo.data.initialDate);
				this.endDate = this.formatDate(this.rangoPeriodo.data.endDate);
			},
			error: (error) => {
				console.error('Error al obtener el rango:', error);
			}
		});
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

	openMembershipmodal() {
		const combineResuls = this.memberships.map(m => {
			const dateExpiration = this.allNearExpiration.find(d => m.id === d.idSuscription);
			const colorStates = this.userStates.find(c => c.idState === m.idStatus);
			this.statusColorOfMembership = this.getStatusColor(colorStates.colorRGB);
			const combine = {
				...m,
				dateExpire: dateExpiration?.dateExpiration,
				dayExpire: dateExpiration?.daysNextExpiration,
				statusColorOfMembership: this.statusColorOfMembership
			}
			return combine
		})

		this.dialogService.open(ModalAllnearExpirationComponent, {
			width: '490px',
			breakpoints: {
				'460px': '90vw',
				'320px': '95vw'
			},
			data: {
				allNearExpiration: combineResuls
			}
		})
	}

	isPaymentUpToDate(): boolean {
		return this.allNearExpiration?.some(near => near.status !== 'ACTIVO');
	}

	navigateToProductsById(id: any): void {
		this.router.navigate([`/profile/partner/my-products/details/${id}`]);
	}

}
