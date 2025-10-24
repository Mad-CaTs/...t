import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IAccountTreeActivationManagerTable } from '../../../../../commons/interfaces';
import { TableComponent } from '@shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { PartnerListResponseDTO } from '../../../../../commons/interfaces/partnerList';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NetworkSubscriptionDetailModal } from '../../modals/networkSubscriptionDetailModal/networkSubscriptionDetailModal';
import { ScheduleDetailsModal } from '../../modals/scheduleDetailsModal/scheduleDetailsModal';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { PaymentAlertModal } from '../../modals/paymentAlertModal/paymentAlertModal';
import { TreeService } from '../../../../../commons/services/tree.service';
import { DialogModule } from 'primeng/dialog';
import { INextPayment } from '@shared/interfaces/payment/next-payment';
import { INumberAndCountry } from '@shared/interfaces/number-and-country';
import { ActivationManagerService } from '../../../service/activation-manager.service';

@Component({
	selector: 'app-table-account-tree-activation-manager',
	templateUrl: './table-account-tree-activation-manager.component.html',
	standalone: true,
	providers: [DialogService],
	imports: [
		CommonModule,
		PaginationNgPrimeComponent,
		TableComponent,
		ButtonModule,
		SelectComponent,
		MatIconModule,
		DialogModule,
		DynamicDialogModule
	],
	styleUrls: ['./table-account-tree-activation-manager.component.css']
})
export class TableAccountTreeActivationManagerComponent {
	@Input() dataBody: PartnerListResponseDTO[] = [];
	@Output() detailModal = new EventEmitter<number>();
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Input() totalRecords: number = 0;
	@Input() isLoading: boolean = true;
	@ViewChild(PaginationNgPrimeComponent) paginator: PaginationNgPrimeComponent | undefined;
	isLoadingBooton: boolean = true;

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
	nextPayment: INextPayment;
	numberAndCountry: INumberAndCountry;

	constructor(
		public tableService: TablePaginationService,
		private fb: FormBuilder,
		private productService: ProductService,
		private dialogService: DialogService,
		private _activationManagerService: ActivationManagerService,
		private cdr: ChangeDetectorRef,
		private treeService: TreeService
	) {
		this.form = this.fb.group({
			nextQuota: [null],
			idSubscription: [null]
		});

		this.id = tableService.addTable(this.dataBody, this.rows);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (!changes['dataBody']) return;

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
		const result = [
			'N°',
			'Nombres y Apellidos',
			'Estado',
			'Patrocinador',
			'Suscripción',
			'Vencimiento',
			'Detalle',
			'Cronogroma',
			'Not. de pago',
			'Chat socio'
		];
		return result;
	}

	get minWidthHeaders() {
		const result = [80, 50, 50, 30, 50, 200, 50, 50, 50];
		return result;
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

	onSelectionChange(selectedItem: any, idUser: number): void {
		if (selectedItem?.value) {
			this.getListSubscripcion(idUser, selectedItem.value);
		} else {
			this.getListSubscripcion(idUser, 0);
		}
		this.selectedMembership[idUser] = Number(selectedItem?.value) || null;
	}

	// getListSubscripcion(idUser: number, idPayment: number): void {
	// 	this._activationManagerService.getListSubscription(idPayment).subscribe({
	// 		next: (data: IPayment[]) => {
	// 			const pendingPayment = data.find(p => p.statePaymentId === 0);
	// 			this.dataBody.forEach(item => {
	// 				if (item.idUser === idUser) {
	// 					if (idPayment && pendingPayment?.nextExpiration) {
	// 						item.nextExpiration = this._activationManagerService.nextExpirationDate(
	// 							pendingPayment.nextExpiration
	// 						);
	// 						item.flagColor = true;
	// 					} else {
	// 						item.nextExpiration = '';
	// 						item.flagColor = false;
	// 					}
	// 				}
	// 			});

	// 			this.tableService.updateTable(this.dataBody, this.id, this.rows);
	// 		},
	// 		error: (err) => {
	// 			console.error('Error obteniendo lista de suscripción:', err);
	// 		}
	// 	});
	// }

	getListSubscripcion(idUser: number, idSuscription: number): void {
		const toYMD = (iso?: string | null) => iso ? iso.slice(0, 10) : '';


		if (!idSuscription) {
			const row = this.dataBody.find(x => x.idUser === idUser);
			if (row) {
				row.nextExpiration = '';
				row.flagColor = false;
			}
			this.tableService.updateTable(this.dataBody, this.id, this.rows);
			return;
		}
		this.getNumberAndCountryCode(idUser);
		this.treeService.getNextPaymentList(idSuscription).subscribe({
			next: (np: any) => {
				const iso = np?.nextExpirationDate ?? null;
				this.nextPayment = np;
				const row = this.dataBody.find(x => x.idUser === idUser);
				if (row) {
					row.nextExpiration = toYMD(iso);
					row.flagColor = !!iso;
				}

				this.tableService.updateTable(this.dataBody, this.id, this.rows);
			},
			error: (err) => {
				console.error('Error next-payment:', err);

				const row = this.dataBody.find(x => x.idUser === idUser);
				if (row) {
					row.nextExpiration = '';
					row.flagColor = false;
				}

				this.tableService.updateTable(this.dataBody, this.id, this.rows);
			}
		});
	}

	loadingMap: { [key: string]: boolean } = {};



	// onClickOpenCoAffiliateModal(row: any): void {
	// 	const loadingKey = row.idUser + '-coAffiliate';
	// 	const selectedSubscription = this.selectedMembership[row.idUser];
	// 	if (!selectedSubscription) {
	// 		console.error('No hay suscripción seleccionada para este usuario');
	// 		return;
	// 	}
	// 	this.loadingMap[loadingKey] = true;
	// 	this.productService.getCronograma(selectedSubscription).subscribe(
	// 		(cronograma) => {
	// 			this.loadingMap[loadingKey] = false;
	// 			this.dialogRef = this.dialogService.open(NetworkSubscriptionDetailModal, {
	// 				width: '50%',
	// 				data: { subscription: selectedSubscription, row, cronograma }
	// 			});
	// 			this.dialogRef.onClose.subscribe(() => {
	// 				this.loadingMap[loadingKey] = false;
	// 			});
	// 		},
	// 		(error) => {
	// 			console.error('Error al obtener cronograma:', error);
	// 			this.loadingMap[loadingKey] = false;
	// 		}
	// 	);
	// }

	onClickOpenCoAffiliateModal(row: any): void {
		const loadingKey = row.idUser + '-coAffiliate';
		const selectedSubscription = this.selectedMembership[row.idUser];
		if (!selectedSubscription) {
			console.error('No hay suscripción seleccionada para este usuario');
			return;
		}
		this.loadingMap[loadingKey] = true;

		this.productService.getCronograma(selectedSubscription).subscribe(
			(cronograma) => {
				this.loadingMap[loadingKey] = false;

				const nextExpirationDateIso = row.nextExpiration || null;

				this.dialogRef = this.dialogService.open(NetworkSubscriptionDetailModal, {
					width: '50%',
					data: { subscription: selectedSubscription, row, cronograma, nextExpirationDateIso }
				});

				this.dialogRef.onClose.subscribe(() => {
					this.loadingMap[loadingKey] = false;
				});
			},
			(error) => {
				console.error('Error al obtener cronograma:', error);
				this.loadingMap[loadingKey] = false;
			}
		);
	}


	onClickOpenScheduleModal(row: any): void {
		const loadingKey = row.idUser + '-schedule';
		const selectedSubscription = this.selectedMembership[row.idUser];
		if (!selectedSubscription) {
			console.error('No hay suscripción seleccionada para este usuario');
			return;
		}
		this.loadingMap[loadingKey] = true;
		this.productService.getCronograma(selectedSubscription).subscribe(
			(cronograma) => {
				this.loadingMap[loadingKey] = false;
				this.dialogRef = this.dialogService.open(ScheduleDetailsModal, {
					width: '80%',
					data: { row: row, subscription: selectedSubscription, cronograma }
				});

				this.dialogRef.onClose.subscribe(() => {
					this.loadingMap[loadingKey] = false;
				});
			},
			(error) => {
				console.error('Error al obtener cronograma:', error);
				this.loadingMap[loadingKey] = false;
			}
		);
	}

	onNotify(row: any): void {
		const selectedSubscription = this.selectedMembership[row.idUser];
		if (!selectedSubscription) {
			console.error('No hay suscripción seleccionada para este usuario');
			alert('Por favor, selecciona una suscripción válida antes de continuar.');
			return;
		}
		this.loadingMap[row.idUser + '-notify'] = true;
		this.treeService.getSubscriptionDetail(selectedSubscription).subscribe(
			(response) => {
				this.loadingMap[row.idUser + '-notify'] = false;

				if (response.status === 'CONFLICT') {
					if (response.message && response.message.includes('Una Inicial fue rechazada')) {
						alert(
							'Una inicial fue rechazada. Por favor, revisa la información de la suscripción.'
						);
					} else {
						alert(
							response.message || 'Hubo un conflicto con la suscripción, intenta nuevamente.'
						);
					}
					return;
				}

				if (response.data.suscriptionDescription === 'No tiene cuotas a pagar') {
					alert('No tienes cuotas a pagar en esta suscripción.');
					return;
				}

				this.dialogRef = this.dialogService.open(PaymentAlertModal, {
					width: '30%',
					data: {
						row: row,
						nextPayment: this.nextPayment,
						numberAndCountry: this.numberAndCountry,
						subscription: selectedSubscription,
						subscriptionDetails: response
					}
				});

				this.dialogRef.onClose.subscribe(() => {
					this.loadingMap[row.idUser + '-notify'] = false;
				});
			},
			(error) => {
				this.loadingMap[row.idUser + '-notify'] = false;
				console.error('Error al obtener los detalles de la suscripción:', error);

				if (error.status === 409) {
					alert('Una inicial fue rechazada. Por favor, revisa la información de la suscripción.');
				} else {
					alert(
						'Hubo un error al obtener los detalles de la suscripción. Por favor, intenta nuevamente.'
					);
				}
			}
		);
	}

	getNumberAndCountryCode(idUser: number): void {
		this._activationManagerService.getNumberAndCountryCode(idUser).subscribe({
			next: (data) => {
				this.numberAndCountry = data;
			},
			error: (err) => {
				console.error('Error obteniendo número y código de país:', err);
			}
		});
	}
}
