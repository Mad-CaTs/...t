import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PeriodService } from 'src/app/profiles/pages/ambassador/commons/components/box-cycle-weekly/commons/services/period.service';
import { ModalAllnearExpirationComponent } from 'src/app/profiles/pages/ambassador/commons/components/modal-allnear-expiration/modal-allnear-expiration.component';
import { TreeService } from 'src/app/profiles/pages/ambassador/pages/tree/commons/services/tree.service';
import { PetResourceServerService } from '../../../../../services/pet-resource-server.service';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { InvestorPoints } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/interfaces/dashboard.interface';

@Component({
	selector: 'app-membership-status-card',
	standalone: true,
	imports: [CommonModule, ProgressSpinnerModule],
	providers: [DatePipe],
	templateUrl: './membership-status-card.component.html',
	styleUrl: './membership-status-card.component.scss'
})
export class MembershipStatusCardComponent {
	@Input() userStatus!: string;
	@Input() statusColor!: { textColor: string; backgroundColor: string };
	@Input() rangoPeriodo;
	@Output() isLoadingToPattern = new EventEmitter<boolean>();
	isLoading: boolean = false;
	endDate: string = '';
	result: any;
	product: any = null;
	initialDate: string = '';
	dateExpired: any = null;
	responsesReceived: number = 0;
	totalExpectedResponses: number = 2;
	pendingRequests: number = 0;
	userStates: any[] = [];
	userInfo: any = this.userInfoService.userInfo;
	investorPoints: InvestorPoints = null;
	statusColorOfMembership: { textColor: string; backgroundColor: string } = { textColor: '', backgroundColor: '' };


	constructor(private datePipe: DatePipe,
		private userInfoService: UserInfoService,
		private router: Router,
		private dialogService: DialogService,
		private petResourceServerService: PetResourceServerService,
		private productService: ProductService,
		private treeService: TreeService
	) { }

	ngOnInit(): void {
		this.loadAllData()
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['rangoPeriodo'] && this.rangoPeriodo?.data) {
			const { initialDate, endDate } = this.rangoPeriodo.data;
			this.initialDate = this.formatDate(initialDate);
			this.endDate = this.formatDate(endDate);
		}
	}

	private loadAllData(): void {
		this.isLoading = true;
		this.isLoadingToPattern.emit(this.isLoading);
		this.pendingRequests = 3;

		this.getProduct();
		this.getDateExpired();
		this.getListAllStates();
	}

	private decrementPendingRequests(): void {
		this.pendingRequests--;
		if (this.pendingRequests <= 0) {
			this.isLoading = false;
			this.isLoadingToPattern.emit(this.isLoading);
		}
	}

	private formatDate(dateArray: number[]): string {
		if (dateArray && dateArray.length >= 3) {
			const [year, month, day] = dateArray;
			const date = new Date(year, month - 1, day);
			return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
		}
		return '';
	}

	getDateExpired() {
		this.petResourceServerService.getExpirationDays(this.userInfo.id).subscribe({
			next: (response) => {
				if (response !== null) {
					this.dateExpired = response?.data
				}

				this.checkAndProcessExpiration()
				this.decrementPendingRequests();

			},
			error: (error) => {
				console.log('error al obtener el puntaje del usuario', error)
				this.investorPoints = null
				this.decrementPendingRequests();
			}
		})
	}

	getProduct() {
		this.productService.getProducts().subscribe({
			next: (response) => {
				if (response !== null) {
					this.product = response
				}
				this.decrementPendingRequests();

			},
			error: (error) => {
				console.log('error al obtener el puntaje del usuario', error)
				this.investorPoints = null
				this.decrementPendingRequests();
			}
		})
	}

	getListAllStates(): void {
		this.treeService.getListAllStates().subscribe({
			next: (states) => {
				this.userStates = states;
				this.setUserStatus();
				this.decrementPendingRequests();
			},
			error: (err) => {
				console.error('Error al obtener los estados:', err);
				this.decrementPendingRequests();
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

	checkAndProcessExpiration() {
		if (this.product && this.dateExpired) {
			this.findNearestExpiration();
		}
	}

	findNearestExpiration() {
		const allNearExpiration = this.dateExpired?.sort((a, b) => a.daysNextExpiration - b.daysNextExpiration);
		
		if (this.dateExpired.length === 0) {
			console.log("No hay suscripciones activas próximas a vencer");
			return null;
		}

		const nearestExpiry = this.dateExpired.reduce((closest, current) => {
			if (closest.dateExpired > 0 && current.dateExpired > 0) {
				return current.this.dateExpired < closest.dateExpired ? current : closest;
			}

			if (closest.dateExpired < 0 && current.dateExpired < 0) {
				return current.dateExpired > closest.dateExpired ? current : closest;
			}

			return closest.dateExpired > 0 ? closest : current;
		});

		const productDetails = this.product?.find(product => product.id === nearestExpiry.idSuscription);

		const result = {
			...productDetails,
			expirationDate: nearestExpiry.dateExpiration
		};

		if (result !== null) {
			this.result = {
				result,
				allNearExpiration,
				products: this.product
			};
		}
		return result;
	}

	openMembershipmodal() {
		const combineResuls = this.product.map(m => {
			const dateExpiration = this.dateExpired.find(d => m.id === d.idSuscription);
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
		return this.product?.some(near => near.status !== 'ACTIVO');
	}

	navigateToProductsById(id: any): void {
		this.router.navigate([`/profile/partner/my-products/details/${id}`]);
	}

	navigateToProducts(): void {
		this.router.navigate([`/profile/partner/my-products`]), {};
	}
}
