import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RangeComponent } from './commons/components/range/range.component';
import { MainAmbassadorComponent } from './commons/components/main-ambassador/main-ambassador.component';
import { ActivatedRoute, Route } from '@angular/router';
import { ProfileRouteData } from '../../commons/interface';
import { SubProfile } from 'src/app/profiles/commons/enums';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DashboardService } from './commons/services/dashboard.service';
import { TabsProfiles } from 'src/app/profiles/commons/constants/tabs-profiles.constant';
import { Profile } from 'src/app/authentication/commons/enums';
import { ITabs } from 'src/app/profiles/commons/interface';
import { ProfileDashboardHeaderComponent } from "../../commons/component/profile-dashboard-header/profile-dashboard-header.component";
import { Colors, InvestorPoints } from './commons/interfaces/dashboard.interface';
import { PetResourceServerService } from 'src/app/profiles/pages/partner/pages/default/commons/services/pet-resource-server.service';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { PointRangesData } from '../../../tree/pages/range-manager/commons/interfaces';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
	selector: 'app-primary-and-secondary-profile',
	templateUrl: './primary-and-secondary-profile.component.html',
	standalone: true,
	imports: [CommonModule, MainAmbassadorComponent, ProfileDashboardHeaderComponent, MatProgressBarModule, ProgressSpinnerModule],
	styleUrls: ['./primary-and-secondary-profile.scss']
})
export default class PrimaryAndSecondaryComponent implements OnInit {
	private profileType: SubProfile;
	public userId: number = this.userInfoService.userInfo.id;
	public rangeData: any;
	public nextRangeData: any;
	public pointRangesDataToChild: PointRangesData[] = [];
	public investorPoints: InvestorPoints = null;
	public product: any = null;
	public isLoading: boolean = false;
	private pendingRequests: number = 0;
	public result: any = null;
	public dateExpired: any = null;
	public colors: Colors[] = null;
	public compuestoRama1: number;
	public compuestoRama2: number;
	public compuestoRama3: number;
	public residualRama1: number;
	public residualRama2: number;
	public residualRama3: number;
	public cTotal: number;
	public rTotal: number;
	public volCtotal: number;
	public volRTotal: number;
	public numberOfUsers: number;
	public puntajeDeLaMembresia: number;
	public puntajeDeLaMembresiaResidual: number;
	public averagePercentage: number | null = null;


	constructor(
		private route: ActivatedRoute,
		public userInfoService: UserInfoService,
		private dashboardService: DashboardService,
		private petResourceServerService: PetResourceServerService,
		private productService: ProductService
	) { }

	ngOnInit(): void {
		this.route.data.subscribe((data: ProfileRouteData) => {
			this.profileType = data.subProfile;
		});
		this.loadAllData()
	}

	private loadAllData(): void {
		this.isLoading = true;
		this.pendingRequests = 8;

		this.getRangeData();
		this.getNextRangeData();
		this.getPointRanges();
		this.getInvestorPointsOfAmbassador();
		this.getProduct();
		this.getDateExpired();
		this.getColors();
		this.getPoints();
	}

	private decrementPendingRequests(): void {
		this.pendingRequests--;
		if (this.pendingRequests <= 0) {
			this.isLoading = false;
		}
	}

	public tabs: Array<ITabs> = TabsProfiles(Profile.AMBASSADOR);


	getRangeData(): void {
		this.dashboardService.getRange(this.userId).subscribe({
			next: (response) => {
				this.rangeData = response.data;
				this.decrementPendingRequests();
			},
			error: (err) => {
				console.error('Error al obtener el rango:', err);
				this.decrementPendingRequests();
			}
		});
	}

	getNextRangeData(): void {
		this.dashboardService.getNextRanges(this.userId).subscribe({
			next: (response) => {
				if (response.data !== null) {
					this.nextRangeData = response?.data;
				}
				this.decrementPendingRequests();
			},
			error: (err) => {
				console.error('Error al obtener el próximo rango:', err);
				this.decrementPendingRequests();
			}
		});
	}

	getPointRanges(): void {
		this.dashboardService.getPointRangesPercentages(this.userId).subscribe({
			next: (response) => {
				if (response.data) {
					this.pointRangesDataToChild = [response.data]
					this.setPointsRangeData();
				} else {
					this.pointRangesDataToChild = [];
				}
				this.decrementPendingRequests();
			},
			error: (error) => {
				console.error('Error al consumir la API:', error);
				this.decrementPendingRequests();
			}
		});
	}

	public get getProfileTitle(): string {
		let profileTitle: string;

		switch (this.profileType) {
			case SubProfile.PRIMARY:
				profileTitle = 'Principal';
				break;

			case SubProfile.SECONDARY:
				profileTitle = 'Secundario';
				break;

			default:
				profileTitle = '';
				break;
		}

		return profileTitle;
	}

	getInvestorPointsOfAmbassador(): void {
		this.petResourceServerService.getInvestorPoints(this.userId).subscribe({
			next: (response) => {
				if (response.data !== null) {
					this.investorPoints = response.data
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

	getPoints() {
		this.dashboardService.getPoints(this.userId).subscribe({
			next: (response) => {
				if (response.data === null) {
					this.compuestoRama1 = 0;
					this.compuestoRama2 = 0;
					this.compuestoRama3 = 0;
					this.residualRama1 = 0;
					this.residualRama2 = 0;
					this.residualRama3 = 0;
					this.cTotal = 0;
					this.rTotal = 0;
					this.volCtotal = 0;
					this.volRTotal = 0;
					this.numberOfUsers = 0;
					this.puntajeDeLaMembresia = 0;
					this.puntajeDeLaMembresiaResidual = 0;

				} else {
					this.compuestoRama1 = response.data.compuestoRama1;
					this.compuestoRama2 = response.data.compuestoRama2;
					this.compuestoRama3 = response.data.compuestoRama3;
					this.residualRama1 = response.data.residualRama1;
					this.residualRama2 = response.data.residualRama2;
					this.residualRama3 = response.data.residualRama3;
					this.cTotal = response.data.directoCTotal;
					this.rTotal = response.data.directoRTotal;
					this.volCtotal = response.data.compuestoTotal;
					this.volRTotal = response.data.residualTotal;
					this.numberOfUsers = response.data.numberOfUsers;
					this.puntajeDeLaMembresia = response.data.puntajeDeLaMembresia;
					this.puntajeDeLaMembresiaResidual = response.data.puntajeDeLaMembresiaResidual;
				}
				this.decrementPendingRequests();
			},
			error: (err) => {
				console.error('Error occurred:', err);
				this.decrementPendingRequests();
			}
		});
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

	getColors() {
		this.dashboardService.getColors().subscribe({
			next: (response) => {
				if (response.data !== null) {
					this.colors = response.data
				}
				this.decrementPendingRequests();

			},
			error: (error) => {
				console.log('error al obtener los colores', error)
				this.investorPoints = null
				this.decrementPendingRequests();
			}
		})
	}

	getDateExpired() {
		this.petResourceServerService.getExpirationDays(this.userId).subscribe({
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

	checkAndProcessExpiration() {
		if (this.product && this.dateExpired) {
			this.findNearestExpiration();
		}
	}

	findNearestExpiration() {
		const activeSuscriptions = this.dateExpired?.filter(item => item.daysNextExpiration > 0);
		const allNearExpiration = this.dateExpired?.sort((a, b) => a.daysNextExpiration - b.daysNextExpiration);

		if (activeSuscriptions.length === 0) {
			console.log("No hay suscripciones activas próximas a vencer");
			return null;
		}

		const nearestExpiry = activeSuscriptions.reduce((closest, current) => {
			return current.daysNextExpiration < closest.daysNextExpiration ? current : closest;
		});

		const productDetails = this.product.find(product => product.id === nearestExpiry.idSuscription);

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

	formatRangeName(rangeName: string): string {
		if (!rangeName) {
			return '';
		}
		if (rangeName === 'DOBLE DIAMANTE') {
			return 'DobleDiamante';
		}
		if (rangeName === 'TRIPLE DIAMANTE') {
			return 'TripleDiamante';
		}
		if (rangeName === 'Embajador de Marca') {
			return 'EmbajadordeMarca';
		}
		return rangeName.toLowerCase();
	}

	getColorByRangeId(rangeId: number): string {
		const colorObject = this.colors?.find(color => color.idRange === rangeId);
		return colorObject ? colorObject.color : '#FFFFFF';
	}

	getTextColorByRangeId(rangeId: number) {
		const textColor = this.colors?.find(color => color.idRange === rangeId);
		return textColor ? textColor.textColor : '#0000'
	}

	getGradientColor(rangeId: number): string {
		const color = this.getColorByRangeId(rangeId);
		return `linear-gradient(to bottom, #FFFFFF, ${color})`;
	}

	onPointsUpdated(pointsData: any): void {
		this.compuestoRama1 = pointsData.compuestoRama1;
		this.compuestoRama2 = pointsData.compuestoRama2;
		this.compuestoRama3 = pointsData.compuestoRama3;
		this.residualRama1 = pointsData.residualRama1;
		this.residualRama2 = pointsData.residualRama2;
		this.residualRama3 = pointsData.residualRama3;
		this.cTotal = pointsData.cTotal;
		this.rTotal = pointsData.rTotal;
		this.volCtotal = pointsData.volCtotal;
		this.volRTotal = pointsData.volRTotal;
		this.numberOfUsers = pointsData.numberOfUsers;
		this.puntajeDeLaMembresia = pointsData.puntajeDeLaMembresia;
		this.puntajeDeLaMembresiaResidual = pointsData.puntajeDeLaMembresiaResidual;
		// Recalcular el porcentaje cuando se actualizan los puntos
		this.setPointsRangeData();
	}

	setPointsRangeData(): void {
		if (this.pointRangesDataToChild && this.nextRangeData) {
			const data = Array.isArray(this.pointRangesDataToChild) ? this.pointRangesDataToChild[0] : this.pointRangesDataToChild;
			const percentagesNextRange = data?.percentagesNextRange;

			if (!percentagesNextRange) {
				this.averagePercentage = null;
				return;
			}

			let totalPuntosActuales: number = 0;
			let volumenRangoSiguiente: number = 0;

			if (this.currentTabState) {
				// Usar los puntos comparados con el SIGUIENTE RANGO (percentagesNextRange)
				const rama1 = percentagesNextRange.pointsRama1CompundRange || 0;
				const rama2 = percentagesNextRange.pointsRama2CompundRange || 0;
				const rama3 = percentagesNextRange.pointsRama3CompundRange || 0;
				// const directo = percentagesNextRange.volumeDirectCompoundRange || 0; // Se elimina del cálculo
				
				totalPuntosActuales = rama1 + rama2 + rama3; // Se elimina 'directo'
				volumenRangoSiguiente = this.nextRangeData.volumenRangoCompound || 0;
			} else {
				// Usar los puntos comparados con el SIGUIENTE RANGO (percentagesNextRange)
				const rama1 = percentagesNextRange.pointsRama1ResidualRange || 0;
				const rama2 = percentagesNextRange.pointsRama2ResidualRange || 0;
				const rama3 = percentagesNextRange.pointsRama3ResidualRange || 0;
				// const directo = percentagesNextRange.volumeDirectResidualRange || 0; // Se elimina del cálculo
				
				totalPuntosActuales = rama1 + rama2 + rama3; // Se elimina 'directo'
				volumenRangoSiguiente = this.nextRangeData.volumenRangoResidual || 0;
			}

			// Calcular porcentaje: (puntos actuales / volumen rango siguiente) * 100
			if (volumenRangoSiguiente > 0) {
				const porcentaje = (totalPuntosActuales / volumenRangoSiguiente) * 100;
				this.averagePercentage = parseFloat(porcentaje.toFixed(2));
			} else {
				this.averagePercentage = 0;
			}
		} else {
			this.averagePercentage = null;
		}
	}

	public currentTabState: boolean = true;

	onTabChanged(isCompuesto: boolean): void {
		this.currentTabState = isCompuesto;
		this.setPointsRangeData();
	}
}
