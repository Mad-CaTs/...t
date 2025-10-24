import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { Location } from '@angular/common';
import { ModalRangeManager } from '../../modals/modal-range-manager/modal-range-manager';
import { MainAmbassadorComponent } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/main-ambassador/main-ambassador.component';
import { RangeManagerNavigationComponent } from '../range-manager-navigation/range-manager-navigation.component';
import { RangeManagerStateDataComponent } from '../range-manager-state-data/range-manager-state-data.component';
import { ReviewStateComponent } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/review-state/review-state.component';
import { PointVolumeComponentComponent } from '../point-volume-component/point-volume-component.component';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { PointRangesData } from '../../interfaces';
import { RangeComponent } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/range/range.component';
import { BreadcrumbItem } from '@shared/interfaces/breadcrumb';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { RangeManagerService } from '../../service/range-manager.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import PrimaryAndSecondaryComponent from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/primary-and-secondary-profile.component';
import { Colors } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/interfaces/dashboard.interface';
import BoxCycleWeeklyComponent from 'src/app/profiles/pages/ambassador/commons/components/box-cycle-weekly/box-cycle-weekly.component';
import { MembershipStatusCardComponent } from 'src/app/profiles/pages/partner/pages/default/commons/components/investor-cards/commons/components/membership-status-card/membership-status-card.component';
import { TreeService } from '../../../../../commons/services/tree.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PeriodService } from 'src/app/profiles/pages/ambassador/commons/components/box-cycle-weekly/commons/services/period.service';
import { PointsProgressCardComponent } from 'src/app/profiles/pages/partner/pages/default/commons/components/investor-cards/commons/components/points-progress-card/points-progress-card.component';
import { PetResourceServerService } from 'src/app/profiles/pages/partner/pages/default/commons/services/pet-resource-server.service';
import { IAccountTreeManagerUser } from '../../interfaces/account-tree-manager-user';
import { ConcatenateSrcDirective } from "@shared/directives/concatenate-src/concatenate-src.directive";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthenticationService } from '@shared/services';

@Component({
	selector: 'app-dashboard-range-manager',
	standalone: true,
	providers: [MessageService, DatePipe],
	imports: [
		CommonModule,
		MatIconModule,
		DialogModule,
		DatePipe,
		ToastModule,
		MatIconModule,
		RangeManagerNavigationComponent,
		RangeManagerStateDataComponent,
		ReviewStateComponent,
		PointVolumeComponentComponent,
		BreadcrumbComponent,
		RangeComponent,
		PrimaryAndSecondaryComponent,
		MainAmbassadorComponent,
		BoxCycleWeeklyComponent,
		MembershipStatusCardComponent,
		PointsProgressCardComponent,
		MatProgressBarModule,
		ConcatenateSrcDirective
	],
	templateUrl: './dashboard-range-manager.html',
	styleUrl: './dashboard-range-manager.scss'
})
export class DashboardRangeManagerComponent implements OnInit {
	data: any;
	isLoading = false;
	selectedRecord: any;
	public activeTab: string = 'state';
	private dataPoints: any = {};
	idUser: number;
	public pointRangesData: PointRangesData[] = [];
	private singleBonus: any = {};
	pointsData: any = [];
	public rangeData: any;
	public nextRangeData: any;
	private loadedApiCount: number = 0;
	public isDataLoaded: boolean = false;
	breadcrumbItems: BreadcrumbItem[] = [];
	dialogRef: DynamicDialogRef;
	public currentDateTime: string;
	modalReady = false;
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
	public pointRangesDataToChild: PointRangesData[] = [];
	public colors: Colors[] = null;
	private pendingRequests: number = 0;
	statusColor: { textColor: string; backgroundColor: string } = { textColor: '', backgroundColor: '' };
	userDni: string = '';
	userStates: any[] = [];
	userStatus: string = '';
	rangoPeriodo: any;
	investorPoints: any;
	responsesReceived: number = 0;
	totalExpectedResponses: number = 3;
	isChildLoading: boolean = false;
	stateName: string = '';
	managerUser: IAccountTreeManagerUser;
	initialDate: string = '';
	endDate: string = '';

	public averagePercentage: number | null = null;

	constructor(
		private location: Location,
		private dashboardService: DashboardService,
		private _rangeManagerService: RangeManagerService,
		private dialogService: DialogService,
		private treeService: TreeService,
		private userInfoService: UserInfoService,
		private periodService: PeriodService,
		private readonly petResourceServerService: PetResourceServerService,
		private _autenticationService: AuthenticationService,
		private cdr: ChangeDetectorRef,
		private datePipe: DatePipe,
		private router: Router
	) {
	}
	ngOnInit(): void {
		this.isLoading = true;
		this.getPointRanges();
		this.getRangeData();
		this.getNextRangeData();
		this.initBreadcrumb();
		this.loadInvestorPoints();
		this.obtenerRangoPeriodo();
		this.getListAllStates();
		this.setCurrentDateTime();
		this.getPoints();
		this.getColors();
		this.getUser();

		this.stateName = this._rangeManagerService.getAccountTreeManager.stateName;
		this.managerUser = this._rangeManagerService.getAccountTreeManager;

	}




	public initBreadcrumb(): void {
		this.breadcrumbItems = [
			{
				label: 'Gestión de rango',
				action: () => this._rangeManagerService.setFlagRangeManager(true)
			},
			{
				label: 'Ver detalle',
				action: () => this.onClickBtn()
			},
			{
				label: 'Dashboard'
			}
		];
	}

	onClickBtn(): void {
		this.selectedRecord = this._rangeManagerService.getAccountTreeManager;
		if (!this.selectedRecord) {
			console.error('No hay registro seleccionado');
			return;
		}

		this.dialogRef = this.dialogService.open(ModalRangeManager, {
			header: 'Detalle',
			width: '50%',
			data: { record: this.selectedRecord }
		});

		this.dialogRef.onClose.subscribe(() => { });
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

	private loadInvestorPoints(): void {
		this.isLoading = true;
		this.petResourceServerService.getInvestorPoints(this._rangeManagerService.getAccountTreeManager.idUser).subscribe({
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

	checkIfDone(): void {
		this.responsesReceived++;
		if (this.responsesReceived >= this.totalExpectedResponses) {
			this.isLoading = false;
		}
	}

	private setCurrentDateTime() {
		const today = new Date();
		const dateOptions: Intl.DateTimeFormatOptions = {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		};
		const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };

		let datePart = this.datePipe.transform(today, 'dd/MM/yy') || '';
		const timePart = today.toLocaleTimeString('en-US', timeOptions);

		datePart = this.capitalizeFirstLetter(datePart).replace(' de ', ' de ');

		this.currentDateTime = `${datePart}, ${timePart}`;
	}
	private capitalizeFirstLetter(string: string): string {
		return string.charAt(0).toUpperCase() + string.slice(1);
	}

	private getPoints(): void {
		this.isLoading = true;
		const idUser = this._rangeManagerService.getAccountTreeManager.idUser;
		this.dashboardService.getPoints(idUser).subscribe({
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
			},
			error: (err) => {
				console.error('Error occurred:', err);
				this.isLoading = false;
				this.pointsData = [];
				this.modalReady = true;
			}
		});
	}
	obtenerRangoPeriodo(): void {
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

	private formatDate(dateArray: number[]): string {
		if (dateArray && dateArray.length >= 3) {
			const [year, month, day] = dateArray;
			const date = new Date(year, month - 1, day);
			return this.datePipe.transform(date, 'dd/MM/yy') || '';
		}
		return '';
	}


	getPointRanges(): void {
		const idUser = this._rangeManagerService.getAccountTreeManager.idUser;
		this.dashboardService.getPointRangesPercentages(idUser).subscribe({
			next: (response) => {
				if (response.data) {
					this.pointRangesDataToChild = [response.data];
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

	setPointsRangeData(): void {
		if (this.pointRangesDataToChild) {
			const data = Array.isArray(this.pointRangesDataToChild) ? this.pointRangesDataToChild[0] : this.pointRangesDataToChild;
			const percentagesNextRange = data?.percentagesNextRange;

			if (!percentagesNextRange) {
				this.averagePercentage = null;
				return;
			}
			// en caso sea requerido la parte dinamica residual descomentar
			let promedio: number = 0;
			if (this.currentTabState) {
				const rama1 = percentagesNextRange.percetangeRama1CompoundRange;
				const rama2 = percentagesNextRange.percetangeRama2CompoundRange;
				const rama3 = percentagesNextRange.percetangeRama3CompoundRange;
				promedio = (rama1 + rama2 + rama3) / 3;
			} else {
				const rama1 = percentagesNextRange.percetangeRama1ResidualRange;
				const rama2 = percentagesNextRange.percetangeRama2ResidualRange;
				const rama3 = percentagesNextRange.percetangeRama3ResidualRange;
				promedio = (rama1 + rama2 + rama3) / 3;
			}

			this.averagePercentage = parseFloat(promedio.toFixed(2));
		} else {
			this.averagePercentage = null;
		}
	}

	public currentTabState: boolean = true;

	onTabChanged(isCompuesto: boolean): void {
		this.currentTabState = isCompuesto;
		this.setPointsRangeData();
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

	onPointsUpdated(pointsData: any): void {
		this.volCtotal = pointsData.volCtotal;
		this.numberOfUsers = pointsData.numberOfUsers;
		this.puntajeDeLaMembresia = pointsData.puntajeDeLaMembresia;

	}

	getRangeData(): void {
		const idUser = this._rangeManagerService.getAccountTreeManager.idUser;
		this.dashboardService.getRange(idUser).subscribe({
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
		const idUser = this._rangeManagerService.getAccountTreeManager.idUser;
		this.dashboardService.getNextRanges(idUser).subscribe({
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

	private decrementPendingRequests(): void {
		this.pendingRequests--;
		if (this.pendingRequests <= 0) {
			this.isLoading = false;
		}
	}

	getUser() {
		this._autenticationService.getUserInfo(this._rangeManagerService.getAccountTreeManager.userName).subscribe(user => {
			this.userDni = user.data.documentNumber;
		});
	}
}
