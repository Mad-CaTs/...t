import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IAccountTreeActivationManagerTable } from '../../../../../commons/interfaces';
import { TableComponent } from '@shared/components/table/table.component';
import { CommonModule, DatePipe } from '@angular/common';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { PartnerListResponseDTO } from '../../../../../commons/interfaces/partnerList';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { TreeService } from '../../../../../commons/services/tree.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { ModalRangeManager } from '../../modals/modal-range-manager/modal-range-manager';
import { DashboardService } from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/services/dashboard.service';
import { IAccountTreeManagerUser } from '../../interfaces/account-tree-manager-user';
import { RangeManagerService } from '../../service/range-manager.service';
import { forkJoin } from 'rxjs';

@Component({
	selector: 'app-table-account-tree-range-manager',
	templateUrl: './table-account-tree-range-manager.component.html',
	standalone: true,
	providers: [DatePipe],
	imports: [
		CommonModule,
		PaginationNgPrimeComponent,
		TableComponent,
		ButtonModule,
		SelectComponent,
		MatIconModule,
		CheckboxComponent
	],
	styleUrls: ['./table-account-tree-range-manager.component.css']
})
export class TableAccountTreeRangeManagerComponent {
	@Input() dataBody: PartnerListResponseDTO[] = [];
	@Output() detailModal = new EventEmitter<number>();
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Input() totalRecords: number = 0;
	@Input() isLoading: boolean = true;
	@ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
	isLoadingBooton: boolean = true;
	private dataPoints: any = {};

	public id: string = '';
	align: string = 'right';
	public rows: number = 10;
	public first: number = 0;
	public selected: FormControl = new FormControl(1);
	public form: FormGroup;
	@Input() isDirectRecomendation: boolean = false;
	@Input() isProductComission: boolean = false;
	public subscriptionList: any[] = [];
	dialogRef: DynamicDialogRef;
	disabled: boolean = true;
	selectedMembership: { [idUser: number]: number | null } = {};
	selectedRows: { [id: string]: boolean } = {};
	selectedUser: any;
	selectedUserId: number | null = null;
	selectedRecord: any;
	public userRanges: { [userId: number]: string } = {};
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		public tableService: TablePaginationService,
		private fb: FormBuilder,
		private productService: ProductService,
		private dialogService: DialogService,
		private cdr: ChangeDetectorRef,
		private treeService: TreeService,
		private dashboardService: DashboardService,
		public userInfoService: UserInfoService,
		private _rangeManagerService: RangeManagerService
	) {
		this.form = this.fb.group({
			nextQuota: [null],
			idSubscription: [null]
		});

		this.id = tableService.addTable(this.dataBody, this.rows);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['dataBody']) return;
		this.getRangeForUserArray();
		this.tableService.updateTable(this.dataBody, this.id, this.rows);
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	onClickDetail() {
		const id = this.selected.value;
		this.detailModal.emit(id);
	}

	get table() {
		return this.tableService.getTable<IAccountTreeActivationManagerTable>(this.id);
	}

	onPageChange(event: any): void {
		this.first = event.first;
		this.rows = event.rows;
		this.isLoading = true;
		this.pageChange.emit({ page: event.page, rows: this.rows });
	}

	onRefresh(event: any): void {
		this.rows = event.rows;
		this.isLoading = true;
		this.refresh.emit({ rows: this.rows });
	}

	private hexToRgba(hex: string, opacity: number, factor: number): string {
		const bigint = parseInt(hex.replace('#', ''), 16);
		let r = (bigint >> 16) & 255;
		let g = (bigint >> 8) & 255;
		let b = bigint & 255;

		r = Math.floor(r * factor);
		g = Math.floor(g * factor);
		b = Math.floor(b * factor);

		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}

	getTransparentColor(color: string): string {
		return this.hexToRgba(color, 0.4, 1);
	}

	getSolidColor(color: string): string {
		return this.hexToRgba(color, 1, 0.8);
	}

	resetPagination(): void {
		if (this.paginator) {
			this.paginator.resetPaginator();
		}
	}

	get headers() {
		return [
			'N°',
			'Fecha de Afiliación',
			'Usuario',
			'Nombres y Apellidos',
			'Patrocinador',
			'Estado',
			'Rango',
			'Rama 1',
			'Rama 2',
			'Rama 3',
			'Directos',
			'Acciones'
		];
	}

	get minWidthHeaders() {
		return [0, 100, 100, 100, 100];
	}

	getSubscriptionsForUser(userId: number): any[] {
		const user = this.dataBody.find((item) => item.idUser === userId);
		return user && user.suscriptions
			? user.suscriptions.map((sub) => ({
				content: sub.nameSuscription,
				value: sub.idSuscription
			}))
			: [];
	}

	onSelectionChange(selectedData: IAccountTreeManagerUser) {
		this.selectedRecord = selectedData;
		this.selectedUserId = selectedData.idUser;
		this._rangeManagerService.setAccountTreeManagerUser(selectedData);
		this.sendDataToKafka(selectedData.idUser, 'R', () => {
			if (!this.userRanges[selectedData.idUser]) {
				this.getRangeForUser(selectedData.idUser);
			}
		});
	}



	loadingMap: { [key: string]: boolean } = {};

	onClickBtn(selectedData: IAccountTreeManagerUser): void {
		if (!selectedData) {
			console.error('No hay registro seleccionado');
			return;
		}
		this._rangeManagerService.setAccountTreeManagerUser(selectedData);
		this.sendDataToKafka(selectedData.idUser, 'R');
		this.dialogRef = this.dialogService.open(ModalRangeManager, {
			header: 'Detalle',
			width: '50%',
			data: { record: selectedData }
		});
		
	}

	sendDataToKafka(id: number, tipo: string, callback?: () => void) {
		const pointKafkaBody = { id, tipo };
		this.dashboardService.postPointsKafka(pointKafkaBody).subscribe({
			next: (response: any) => {
				console.log('Datos enviados a Kafka:', response);
				if (callback) callback();
			},
			error: (error) => {
				console.error('Error al enviar datos a Kafka:', error);
			}
		});
	}
	getRangeForUser(userId: number): void {
		this.loadingMap[userId] = true;
		this.dashboardService.getRange(userId).subscribe({
			next: (res: any) => {
				if (res?.data?.rango) {
					this.userRanges[userId] = res.data.rango;
				} else {
					console.warn('No se obtuvo rango para el usuario', userId);
				}
				this.loadingMap[userId] = false;
				this.cdr.detectChanges();
			},
			error: (err) => {
				console.error('Error al obtener rango:', err);
				this.loadingMap[userId] = false;
			}
		});
	}


getRangeForUserArray() {
  const ids = this.dataBody.map(u => u.idUser);

  this.dashboardService.getRangeArray(ids).subscribe(rangos => {
    this.dataBody = this.dataBody.map(usuario => {
      const rangoEncontrado = rangos.data.find(r => r.socioId === usuario.idUser);
      return {
        ...usuario,
        rango: rangoEncontrado ? rangoEncontrado.rango : usuario.rango
      };
    });

    this.tableService.updateTable(this.dataBody, this.id, this.rows);
  });
}
}
