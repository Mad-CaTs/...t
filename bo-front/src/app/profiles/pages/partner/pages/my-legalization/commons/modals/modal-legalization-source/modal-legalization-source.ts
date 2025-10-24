import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { PointRangesData } from 'src/app/profiles/pages/ambassador/pages/tree/pages/range-manager/commons/interfaces';
import { TableModule } from 'primeng/table';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { LegalizationService } from '../../services/legalization.service';
import { ModalLegalizationPresenter } from '../../../my-legalization.presenter';
import { Router } from '@angular/router';
import { DataSharingService } from '../../../../my-products/commons/services/data-sharing.service';
import { LEGALIZATION_MESSAGES } from '../../constants';

@Component({
	selector: 'app-modal-legalization-source',
	standalone: true,
	providers: [MessageService, ModalLegalizationPresenter],
	imports: [
		CommonModule,
		MatIconModule,
		DialogModule,
		ToastModule,
		RadiosComponent,
		TableModule
	],
	templateUrl: './modal-legalization-source.html',
	styleUrl: './modal-legalization-source.scss'
})
export class ModalLegalizationSource implements OnInit {
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
	showMoreDetails = false;
	@Input() dataBody: any[] = [];
	@Input() id: string = '';
	public payTypeList: ISelect[];
	form = this.presenter.form;
	selectedElement: any;
	public selectedPayType: number;
	public selectedPayTypeOption: ISelect | null = null;
	legalizationMessage: string = '';

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		public tableService: TableService,
		public presenter: ModalLegalizationPresenter,
		private router: Router,
		private dataSharingService: DataSharingService
	) {
		this.id = tableService.addTable(this.dataBody);
	}
	ngOnInit(): void {
		this.initData();
	}

	initData() {
		this.receiveModalData();
		this.getOptionCategories();
		this.setMessage();
	}

	receiveModalData() {
		this.data = this.config.data;
		console.log('datakeyla', this.data);
	}

	setMessage() {
		const idDoc = this.data?.membershipData?.idLegalDocument;
		this.legalizationMessage = LEGALIZATION_MESSAGES[idDoc] || '';
	}

	private getOptionCategories() {
		this.payTypeList = this.data.payTypeList || [];
	}

	closeModal() {
		this.ref.close();
	}

	public onChangeSelectionPayType(option: number) {
		this.selectedPayType = option;
		this.selectedPayTypeOption = this.payTypeList.find((opt) => opt.value === option) || null;
		console.log('categoriaopcion', this.selectedPayTypeOption);
	}

	onContinue() {
		const selectedProduct = this.data?.selectedElement;
		localStorage.setItem('selectedProduct', JSON.stringify(selectedProduct));
		const payTypeData = JSON.stringify(this.selectedPayTypeOption);
		this.router.navigate(['/profile/partner/my-products/validate-documents'], {
			queryParams: { from: 'legalization', payTypeData }
		});
		this.closeModal();
	}

	/* 	onContinue() {
		this.dataSharingService.setSelectedProduct(this.data?.selectedElement);
		const payTypeData = JSON.stringify(this.selectedPayTypeOption);
		this.router.navigate(['/profile/partner/my-products/validate-documents'], {
			queryParams: { from: 'legalization', payTypeData}
		});
		this.closeModal();
	} */
}
