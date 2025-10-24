import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { MyRewardsComponent } from '../history-range/commons/components/my-rewards/my-rewards.component';
import { DashboardService } from '../../../dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { Colors } from '../../../dashboard/pages/primary-and-secondary-profile/commons/interfaces/dashboard.interface';
import { PointRangesData } from '../range-manager/commons/interfaces';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { HowToEarnPonitsComponent } from './components/how-to-earn-ponits/how-to-earn-ponits.component';
import { MatInputModule } from "@angular/material/input";
import { ModalCarBonusComponent } from './components/modal-car-bonus/modal-car-bonus.component';
import { auto } from '@popperjs/core';
import { CAR_BONUS } from './components/data/carBonus';
import { IRangeData } from './interface/rangeData';
import { OptionEarnCarBonusComponent } from './components/option-earn-car-bonus/option-earn-car-bonus.component';
import { RouterTap } from './components/enum/router-tap';
import { MyAwardsService } from './components/service/my-awards.service';
import { carBonus } from './components/mock/car-bonus';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { CarBondDocumentComponent } from './components/car-bond-document/car-bond-document.component';
import { TreeService } from '../../commons/services/tree.service';
import { PartnerListResponseDTO } from '../../commons/interfaces/partnerList';
import { ICarBonusDocumentTable } from './interface/car-bonus-document-table';
import { SeeAutoBonusDocumentComponent } from './components/see-auto-bonus-document/see-auto-bonus-document.component';
import { ClassificationsService } from './components/service/classifications.service';
import { IRankBonusData } from './interface/classification';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DocumentService } from './components/service/document.service';
import { DocumentData } from './interface/document';
import { take } from 'rxjs';


@Component({
	selector: 'app-my-awards',
	standalone: true,
	imports: [CommonModule,
		MyRewardsComponent,
		ModalCarBonusComponent,
		OptionEarnCarBonusComponent,
		CarBondDocumentComponent,
		SeeAutoBonusDocumentComponent,
		MatProgressBarModule,
		MatCardModule,
		MatIconModule,
		MatInputModule,
		ModalNotifyComponent],
	templateUrl: './my-awards.component.html',
	styleUrl: './my-awards.component.scss',
	encapsulation: ViewEncapsulation.Emulated
})
export class MyAwardsComponent implements OnInit {
	private dialogRef: DynamicDialogRef;
	public currentTabState: boolean = true;
	public carBonus = CAR_BONUS;
	public routerTap = RouterTap;
	public rangeData: IRangeData = {} as IRangeData;
	public colors: Colors[] = null;
	public nextRangeData: any;
	public averagePercentage: number | null = null;
	public pointRangesDataToChild: PointRangesData[] = [];
	public compuestoRama1: number;
	public compuestoRama2: number;
	public compuestoRama3: number;
	public residualRama1: number;
	public residualRama2: number;
	public residualRama3: number;
	notifyTitle = 'Documentos Listos';
	notifyMessage = 'Tus documentos ya se encuentran disponibles. Puedes descargarlos y revisarlos cuando gustes.';
	notifyIcon = 'file';
	showNotify = true;
	infoBoxMessage = 'Recuerda: la empresa se hará cargo del bono siempre y cuando mantengas tu rango actual o lo superes.'
	isLoading: boolean = false;
	public statesOptions: { content: string; value: any; color?: any }[] = [];
	tableData: DocumentData[] = [];
	totalRecords: number = 0;
	public classification: IRankBonusData[] = [];
	private userId: any;
	private IdAssignment: string;
	public pdfUrl: string = '';

	@Input() color = '#8ed334ff';
	constructor(private _myAwardsService: MyAwardsService,
		private dashboardService: DashboardService, private renderer: Renderer2,
		private dialogService: DialogService,
		private _classificationsService: ClassificationsService,
		private _userInfoService: UserInfoService,
		private _documentService: DocumentService,
		private treeService: TreeService,) {
	}

	ngOnInit(): void {
		this.userId = this._userInfoService.userInfo.id;
		this.getStates();
		this.loadData(1, 10);
		this.getRangeData();
		// this.getNextRangeData();
		// this.getPointRanges();
		this.getPoints();
		this.getColors();

	}

	getBarStyle(idRange: number) {
		return { '--progress-color': this.getColorByRangeId(idRange) };
	}

	onTabChanged(isCompuesto: boolean): void {
		this.currentTabState = isCompuesto;
		// this.setPointsRangeData();
	}

	getGradientColor(rangeId: number): string {
		const color = this.getColorByRangeId(rangeId);
		return `linear-gradient(to bottom, ${color}, #FFFFFF)`;
	}

	getColorByRangeId(rangeId: number): string {
		const colorObject = this.colors?.find(color => color.idRange === rangeId);
		return colorObject ? colorObject.color : '#FFFFFF';
	}

	getRangeData(): void {
		const storedSoc = localStorage.getItem('user_info')
		const { id } = JSON.parse(storedSoc);
		this.dashboardService.getRange(id).subscribe({
			next: (response) => {
				this.rangeData = response.data;
			},
			error: (err) => {
				console.error('Error al obtener el rango:', err);

			}
		});
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

	getTextColorByRangeId(rangeId: number) {
		const textColor = this.colors?.find(color => color.idRange === rangeId);
		return textColor ? textColor.textColor : '#0000'
	}

	private getPoints(): void {
		const storedSoc = localStorage.getItem('user_info')
		const { id } = JSON.parse(storedSoc);
		this.dashboardService.getPoints(id).subscribe({
			next: (response) => {
				if (response.data === null) {
					this.compuestoRama1 = 0;
					this.compuestoRama2 = 0;
					this.compuestoRama3 = 0;
					this.residualRama1 = 0;
					this.residualRama2 = 0;
					this.residualRama3 = 0;

				} else {
					this.compuestoRama1 = response.data.compuestoRama1;
					this.compuestoRama2 = response.data.compuestoRama2;
					this.compuestoRama3 = response.data.compuestoRama3;
					this.residualRama1 = response.data.residualRama1;
					this.residualRama2 = response.data.residualRama2;
					this.residualRama3 = response.data.residualRama3;
				}
			},
			error: (err) => {
				console.error('Error occurred:', err);
			}
		});
	}

	getColors() {
		this.dashboardService.getColors().subscribe({
			next: (response) => {
				if (response.data !== null) {
					this.colors = response.data
				}
			},
			error: (error) => {
				console.log('error al obtener los colores', error)

			}
		})
	}

	openModal() {
		this.dialogRef = this.dialogService.open(HowToEarnPonitsComponent, {
			width: auto,
			height: auto,
			data: {}
		});
		this.dialogRef.onClose.subscribe(() => {
		});
	}

	getClassification() {
		this.openModalCarBonus({} as IRankBonusData[]);
		this._classificationsService.getClassification(this.userId).subscribe({
			next: (response) => {
				this._myAwardsService.setCarBonusList(response.data);
			},
			error: (error) => { console.error('Error fetching document:', error); }
		});
	}

	openModalCarBonus(data: IRankBonusData[]) {
		this.dialogRef = this.dialogService.open(ModalCarBonusComponent, {
			data: data
		});
		this.dialogRef.onClose.subscribe(() => {
		});
	}

	activetionOptionEarnCarBonus(): boolean {
		return this._myAwardsService.getRouterTap === RouterTap.BONUS_CAR;
	}

	activetionCarBonusDocument(): boolean {
		return this._myAwardsService.getRouterTap === RouterTap.BONUS_CAR_DOCUMENT;
	}

	activetionCarBonusSeeDocument(): boolean {
		return this._myAwardsService.getRouterTap === RouterTap.BONUS_CAR_SEE_DOCUMENT;
	}

	onCloseNotify() {
		this.showNotify = false;
	}

	confirmed() {
		this.showNotify = false;
		this._myAwardsService.setRouterTap(RouterTap.BONUS_CAR_DOCUMENT);
	}

	onRefresh(event: any): void {
		const rows = event.rows;
		this.loadData(1, rows);
	}

	loadData(page: number, rows: number): void {
		const offset = page - 1;
		this.isLoading = true;
		this._myAwardsService.getCarBonusList().subscribe({
			next: (response) => {
				if (response.length > 0) {
					this.IdAssignment = response[0].carAssignmentId;

					this._documentService.getDocument(this.IdAssignment).pipe(take(1)).subscribe({
						next: (result) => {
							const mapped: DocumentData[] = result.data.map((item: any) => this.mapItemWithState(item));
							this.tableData = mapped;
							this.pdfUrl = mapped[0]?.fileUrl || '';
							this.totalRecords = result.data.length ?? mapped.length;
							this.isLoading = false;
						},
						error: (err) => {
							console.error('Error en getListPartners:', err);
							this.isLoading = false;
						}
					});

				}
			}
		});
	}

	private mapItemWithState(item: any) {
		const state = this.statesOptions.find((s) => s.value === item.idState);
		return {
			...item,
			color: state ? state.color : '#000000',
			stateName: state ? state.content : 'Unknown'
		};
	}

	getStates(): void {
		this.treeService.getListAllStates().subscribe((response) => {
			this.statesOptions = response.map((item: any) => ({
				content: item.nameState,
				value: item.idState,
				color: item.colorRGB
			}));
			console.log('Estados obtenidos:', this.statesOptions);
		});
	}

	onPageChange(event: any): void {
		const page = event.page + 1;
		const rows = event.rows;
		this.loadData(page, rows);
	}
}
