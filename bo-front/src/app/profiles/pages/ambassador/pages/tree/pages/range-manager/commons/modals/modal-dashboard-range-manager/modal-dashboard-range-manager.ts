import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { Location } from '@angular/common';
import { ModalRangeManager } from '../modal-range-manager/modal-range-manager';
import { MainAmbassadorComponent } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/main-ambassador/main-ambassador.component';
import { RangeManagerNavigationComponent } from '../../componentes/range-manager-navigation/range-manager-navigation.component';
import { RangeManagerStateDataComponent } from '../../componentes/range-manager-state-data/range-manager-state-data.component';
import { ReviewStateComponent } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/review-state/review-state.component';
import { PointVolumeComponentComponent } from '../../componentes/point-volume-component/point-volume-component.component';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { PointRangesData } from '../../interfaces';
import { RangeComponent } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/range/range.component';

@Component({
	selector: 'app-enterprise-bank-details',
	standalone: true,
	providers: [MessageService],
	imports: [
		CommonModule,
		MatIconModule,
		DialogModule,
		ToastModule,
		MatIconModule,
		RangeManagerNavigationComponent,
		RangeManagerStateDataComponent,
		ReviewStateComponent,
		PointVolumeComponentComponent,
		RangeComponent
	],
	templateUrl: './modal-dashboard-range-manager.html',
	styleUrl: './modal-dashboard-range-manager.scss'
})
export class ModalDashboardRangeManager implements OnInit {
	data: any;
	isLoading = false;
	dialogRef: DynamicDialogRef;
	selectedRecord: any;
	public activeTab: string = 'state';
	private dataPoints: any = {};
	idUser: number;
	public pointRangesData: PointRangesData[] = [];
	private singleBonus: any = {};
	pointsData: any;
	public rangeData: any;
	public nextRangeData: any;
	private loadedApiCount: number = 0;
	public isDataLoaded: boolean = false;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		private dialogService: DialogService,
		private location: Location,
		private dashboardService: DashboardService
	) {
		this.data = config.data.record;
		this.pointsData = config.data.pointsData;
	}
	ngOnInit(): void {
		this.selectedRecord = this.config.data?.record;
		this.idUser = this.selectedRecord.idUser;
		this.getRangeData();
		this.getNextRangeData();
		this.getPointRanges();
	}

	closeModal() {
		this.ref.close();
	}

	onTabChange(tab: string) {
		this.activeTab = tab;
		if (tab === 'score') {
			this.getPoints();
			this.getPointRanges();
		}
	}

	getRangeData(): void {
		this.dashboardService.getRange(this.idUser).subscribe({
			next: (response) => {
				this.rangeData = response.data;
				this.incrementLoadedApis();
			},
			error: (err) => {
				console.error('Error al obtener el rango:', err);
			}
		});
	}

	getNextRangeData(): void {
		this.dashboardService.getNextRanges(this.idUser).subscribe({
			next: (response) => {
				this.nextRangeData = response.data;
			},
			error: (err) => {
				console.error('Error al obtener el próximo rango:', err);
			}
		});
	}

	incrementLoadedApis(): void {
		this.loadedApiCount++;
		if (this.loadedApiCount === 3) {
			this.isDataLoaded = true;
		}
	}

	private getPoints(): void {
		this.isLoading = true;
		this.dashboardService.getPoints(this.idUser).subscribe({
			next: (response) => {
				this.isLoading = false;
				this.dataPoints = response?.data;
				this.isLoading = false;
			},
			error: (err) => {
				console.error('Error occurred:', err);
				this.isLoading = false;
			}
		});
	}
	// aqui regresa el cambio
	getPointRanges(): void {
		this.isLoading = true;
		this.dashboardService.getPointRangesPercentages(this.idUser).subscribe({
			next: (response) => {
				this.isLoading = false;
				if (response.data) {
					this.pointRangesData = [response.data];
				} else {
					this.pointRangesData = [];
				}
				this.isLoading = false;
			},
			error: (error) => {
				console.error('Error al consumir la API:', error);
				this.isLoading = false;
			}
		});
	}

	goBack(): void {
		if (!this.selectedRecord) {
			console.error('No hay datos seleccionados');
			return;
		}

		this.ref.close();

		this.dialogService.open(ModalRangeManager, {
			header: 'Detalle',
			width: '50%',
			data: { record: this.selectedRecord }
		});
	}
}
