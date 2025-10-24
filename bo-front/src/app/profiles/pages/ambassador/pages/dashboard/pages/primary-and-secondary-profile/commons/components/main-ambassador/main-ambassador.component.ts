import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ReviewStateComponent } from '../review-state/review-state.component';
import { DashboardService } from '../../services/dashboard.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PetResourceServerService } from 'src/app/profiles/pages/partner/pages/default/commons/services/pet-resource-server.service';
import { Colors, InvestorPoints } from '../../interfaces/dashboard.interface';
import { ScoreDetailsComponent } from "../score-details/score-details.component";
import { RangeManagerService } from 'src/app/profiles/pages/ambassador/pages/tree/pages/range-manager/commons/service/range-manager.service';
import { Router } from '@angular/router';
import { mockNavigationUris } from 'src/app/profiles/pages/ambassador/pages/tree/commons/mocks/mock';

@Component({
	selector: 'app-main-ambassador',
	templateUrl: './main-ambassador.component.html',
	standalone: true,
	styleUrls: ['./main-ambassador.component.scss'],
	imports: [
		CommonModule,
		MatIconModule,
		ReviewStateComponent,
		ProgressSpinnerModule,
		ScoreDetailsComponent
	]
})
export class MainAmbassadorComponent implements OnInit, OnChanges {
	// @Input() profileTitle: string;
	@Input() resR1?: number
	@Input() resR2?: number
	@Input() resR3?: number
	@Input() rTotal?: number
	@Input() formatRangeName?: (rangeName: string) => string;
	@Input() getColorByRangeId?: (rangeId: number) => string;
	@Input() getTextColorByRangeId?: (rangeId: number) => string;
	@Input() getGradientColor?: (rangeId: number) => string;
	@Input() colors: Colors[] = []
	@Input() pointRangesDataToChild: any;
	@Input() rangeData: any;
	@Input() nextRangeData: any;
	@Input() isDataLoaded: boolean = false;
	@Input() cardLoading: boolean;
	@Input() numberTotal: number;
	@Input() puntajeDeLaMembresia: number;
	@Input() volTotal: number;
	@Input() typePosition?: boolean = false;
	@Output() pointsUpdated = new EventEmitter<any>();
	@Output() updateTab = new EventEmitter<boolean>();
	id: number;

	public isResidual: boolean = false;
	public isLoading: boolean = true;
	public isRefreshingBonus: boolean = false;
	public isRefreshingPoints: boolean = false;
	public rangoActual: any[] = [];
	public singleBonus: any = null;
	public investorPoints: InvestorPoints = null;
	private _isState: boolean = true;

	public get isState(): boolean {
		return this._isState;
	}

	public set isState(value: boolean) {
		if (this._isState !== value) {
			this._isState = value;
			this.currenTab(value); // Llama a la función cuando cambia
		}
	}

	constructor(
		private dashboardService: DashboardService,
		public userInfoService: UserInfoService,
		public petResourceServerService: PetResourceServerService,
		private _rangeManagerService: RangeManagerService,
		private router: Router
	) { 	this.getUser(); }

	ngOnInit(): void {
		this.getSingleBonus();
	
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['pointRangesDataToChild'] && changes['pointRangesDataToChild'].currentValue) {
			console.log('pointRangesDataToChild recibido en hijo:', this.pointRangesDataToChild);
		}
	}

	get navPosition() {
		const percentaje = this.isState ? '0%' : '100%';
		return `translateX(${percentaje})`;
	}

	getUser() {
		const urlObj = mockNavigationUris.find((m) => m.url === this.router.url);
		if (urlObj) {
			this.id = this._rangeManagerService.getAccountTreeManager.idUser;
		} else {
			this.id = this.userInfoService.userInfo.id;

		}
	}
	getSingleBonus(): void {
		this.isLoading = true;

		this.dashboardService.getBonus(this.id).subscribe({
			next: (response) => {
				if (response && response.data) {
					this.singleBonus = response.data;
				} else {
					this.singleBonus = 0;
				}

				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error al obtener la bonificación:', error);
				this.singleBonus = null;
				this.isLoading = false;
			}
		});
	}

	public refreshSingleBonus(): void {
		this.isRefreshingBonus = true;
		this.dashboardService.getBonus(this.id).subscribe({
			next: (response) => {
				if (response && response.data) {
					this.singleBonus = response.data;
				} else {
					this.singleBonus = 0;
				}
				this.isRefreshingBonus = false;
			},
			error: (error) => {
				console.error('Error al obtener la bonificación:', error);
				this.singleBonus = null;
				this.isRefreshingBonus = false;
			}
		});
	}

	/**
	 * Método para refrescar solo el getPoints (método del padre)
	 */
	public refreshPoints(): void {
		this.isRefreshingPoints = true;

		this.dashboardService.getPoints(this.id).subscribe({
			next: (response) => {
				if (response.data === null) {
					this.updateParentPoints({
						compuestoRama1: 0,
						compuestoRama2: 0,
						compuestoRama3: 0,
						residualRama1: 0,
						residualRama2: 0,
						residualRama3: 0,
						cTotal: 0,
						rTotal: 0,
						volCtotal: 0,
						volRTotal: 0,
						numberOfUsers: 0,
						puntajeDeLaMembresia: 0,
						puntajeDeLaMembresiaResidual: 0
					});
				} else {
					this.updateParentPoints({
						compuestoRama1: response.data.compuestoRama1,
						compuestoRama2: response.data.compuestoRama2,
						compuestoRama3: response.data.compuestoRama3,
						residualRama1: response.data.residualRama1,
						residualRama2: response.data.residualRama2,
						residualRama3: response.data.residualRama3,
						cTotal: response.data.directoCTotal,
						rTotal: response.data.directoRTotal,
						volCtotal: response.data.compuestoTotal,
						volRTotal: response.data.residualTotal,
						numberOfUsers: response.data.numberOfUsers,
						puntajeDeLaMembresia: response.data.puntajeDeLaMembresia,
						puntajeDeLaMembresiaResidual: response.data.puntajeDeLaMembresiaResidual
					});
				}
				this.isRefreshingPoints = false;
			},
			error: (err) => {
				console.error('Error al refrescar puntos:', err);
				this.isRefreshingPoints = false;
			}
		});
	}

	/**
	 * Método privado para comunicar los cambios al componente padre
	 */
	private updateParentPoints(pointsData: any): void {
		this.pointsUpdated.emit(pointsData);
	}

	private currenTab(isState: boolean): void {
		this.updateTab.emit(isState);
		this.isResidual = !isState;
	}
}
