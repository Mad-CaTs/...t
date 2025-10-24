import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { paymentDetailDirectRecomendationTableData } from './commons/mocks/mock';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { IPaymentDetailComissionTable } from '../../interfaces/payments-and-comissions.interfaces';
import { ModalPaymentsBonificationDetailComponent } from './commons/modals/modal-payments-bonification-detail/modal-payments-bonification-detail.component';
import { TablePaymentsComissionComponent } from './commons/components/table-payments-comission/table-payments-comission.component';
import { ComisionesService } from '../../../../../commons/services/comisione.service';
import { CommonModule } from '@angular/common';
import { IAllData } from './commons/interfaces/payments-detail-comissions.interfaces';

@Component({
	selector: 'app-payment-detail-comission',
	templateUrl: './payment-detail-comission.component.html',
	standalone: true,
	imports: [TablePaymentsComissionComponent, CommonModule],
	styleUrls: []
})
export class PaymentDetailComissionComponent implements OnChanges {
	@Input() tab: number = 2;
	@Input() userId!: number;
	@Input() periodId!: number;
	selectedItem: IPaymentDetailComissionTable | null = null;
	/* 	selectedItem: any;
	 */ /* 	@Input() data: any; */
	@Input() loading: boolean = false;
	public hasData: boolean = false;
	@Input() allData: IAllData | null = null;
	public tableData: IPaymentDetailComissionTable[] = [];
	public customHeaders: string[] | null = null;
	preloadedData: {
		directRecommendationBonusList: [];
		teamRecommendationBonusList: [];
		quotesBonusList: [];
		secondMembershipBonusList: [];
		extraMembershipBonusList: [];
		migrationsBonusList: [];
		awardRankBonusList: [];
		exclusiveBrandsBonusList: [];
		founderBonusList: [];
		regularizationBonusList: [];
	};

	constructor(
		private modal: NgbModal,
		private comisionesService: ComisionesService,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {}

	onSelectionChange(item: IPaymentDetailComissionTable) {
		this.selectedItem = item;
	}

	onClickShowDetail(selectedData: IPaymentDetailComissionTable) {
		const ref = this.modal.open(ModalPaymentsBonificationDetailComponent, {
			centered: true
		});
		const modal = ref.componentInstance as ModalPaymentsBonificationDetailComponent;

		modal.data = selectedData;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['allData'] && changes['allData'].currentValue) {
			this.filterDataByTab();
		} else if (changes['tab'] && this.allData) {
			this.filterDataByTab();
		}
	}

	filterDataByTab(): void {
		this.loading = true;
		this.tableData = [];
		this.customHeaders = null;

		/*   this.tableData = [];
		 */
		if (!this.allData || Object.keys(this.allData).length === 0) {
			console.warn('Datos no disponibles en allData.');
			this.tableData = [];

			this.hasData = false;
			this.loading = false;
			this.cdr.detectChanges();
			return;
		}

		switch (this.tab) {
			case 2:
				this.tableData = this.allData.directRecommendationBonusList || [];
				break;
			case 3:
				this.tableData = this.allData.teamRecommendationBonusList || [];
				break;
			case 4:
				this.tableData = this.allData.quotesBonusList || [];
				break;
			case 5:
				this.tableData = this.allData.secondMembershipBonusList || [];
				break;
			case 6:
				this.tableData = this.allData.extraMembershipBonusList || [];
				break;
			case 7:
				this.tableData = this.allData.migrationsBonusList || [];
				break;
			case 8:
				this.tableData = this.allData.awardRankBonusList || [];
				break;
			case 9:
				this.tableData = this.allData.exclusiveBrandsBonusList || [];
				break;
			case 10:
				this.tableData = this.allData.founderBonusList || [];
				break;
			case 11:
				this.tableData = this.allData.regularizationBonusList || [];
				this.customHeaders = [
					'Nombre',
					'Tipo de Comisión',
					'Nivel',
					'Fecha',
					'Puntaje',
					'Diferencia de Porcentaje (%)',
					'Diferencia de Monto',
					'Por Nivel',
					'Por Condición'
				];
				console.log('this.tableData', this.tableData);
				
				break;
		}

		this.hasData = this.tableData.length > 0;
		this.loading = false;
		this.cdr.detectChanges();
	}
}
