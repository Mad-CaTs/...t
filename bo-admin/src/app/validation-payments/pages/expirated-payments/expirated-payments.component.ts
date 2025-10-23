import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';

import { tableMock } from './mock';
import { forkJoin } from 'rxjs';

import type { ISelectOpt } from '@interfaces/form-control.interface';
import type { ITableExpiratedPayments } from '@interfaces/payment-validate.interface';

import { TableModel } from '@app/core/models/table.model';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { SubscriptionService } from '@app/validation-payments/services/payment-data.service';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ScheduleService } from '@app/schedule/services/schedule.service';

@Component({
	selector: 'app-expirated-payments',
	standalone: true,
	imports: [
		CommonModule,
		TablesModule,
		InlineSVGModule,
		ReactiveFormsModule,
		FormControlModule,
		FormsModule
	],
	templateUrl: './expirated-payments.component.html',
	styleUrls: ['./expirated-payments.component.scss']
})
export class ExpiratedPaymentsComponent implements AfterViewInit {
	public deudaTypeOpt: ISelectOpt[] = [
		{ id: '1', text: 'Todos' },
		{ id: '5', text: 'Deuda 1' },
		{ id: '6', text: 'Deuda 2' },
		{ id: '7', text: 'Deuda 3' },
		{ id: '8', text: 'Pre-liquidación' },
		{ id: '9', text: 'Congelado' }
	];
	public readonly table: TableModel<ITableExpiratedPayments>;

	public form: FormGroup;
	public subscriptionTable: FormGroup[];
	dataLoaded: boolean = false;
	searchTerm: string = '';
	filteredData: ITableExpiratedPayments[] = [];
	fullData: ITableExpiratedPayments[] = [];
	private loadingModalRef: NgbModalRef | null = null;
	public descriptions: string[] = [];
	public nextExpirations: string[] = [];
	public amounts: number[] = [];
	constructor(
		private cdr: ChangeDetectorRef,
		private tableService: TableService,
		private modalService: NgbModal,
		private subscriptionService: SubscriptionService,
		private scheduleService: ScheduleService,
		private builder: FormBuilder
	) {
		this.table = this.tableService.generateTable<ITableExpiratedPayments>({
			headers: [
				'N°',
				'Nombres y Apellidos',
				'Suscripción',
				'Descripción',
				'Fecha',
				'Monto',
				'Notificación'
			],
			headersMinWidth: [70],
			headersMaxWidth: [70],
			noCheckBoxes: true
		});
		this.form = builder.group({
			search: [''],
			deudaType: ['', Validators.required]
		});
		this.subscriptionTable = tableMock.map(() => builder.group({ membership: [''] }));

		this.form.get('deudaType')?.valueChanges.subscribe((value) => {
			if (value) {
				if (value === '1') {
					const types = ['5', '6', '7', '8', '9'];
					const apiCalls = types.map((type) =>
						this.subscriptionService.getSubscriptionData<ITableExpiratedPayments>(type)
					);

					this.showLoadingModal();

					forkJoin(apiCalls).subscribe(
						(responses) => {
							const combinedData = responses.reduce(
								(acc, response) => acc.concat(response),
								[]
							);
							const groupedData = combinedData.reduce<ITableExpiratedPayments[]>(
								(acc, item) => {
									const existingUser = acc.find((user) => user.iduser === item.iduser);

									const packageId = item.idsuscription
										? item.idsuscription.toString()
										: '0';
									const packageName = item.package?.name || 'No Package';

									if (existingUser) {
										existingUser.packageOpt.push({
											id: packageId,
											text: packageName
										});
									} else {
										acc.push({
											...item,
											packageOpt: [
												{
													id: packageId,
													text: packageName
												}
											]
										});
									}

									return acc;
								},
								[]
							);
							this.table.data = groupedData;
							this.fullData = groupedData;

							this.subscriptionTable = combinedData.map(() =>
								this.builder.group({
									membership: ['']
								})
							);

							this.dataLoaded = true;
							this.hideLoadingModal();
							this.cdr.detectChanges();
						},
						(error) => {
							console.error('Error fetching subscription data:', error);
							this.hideLoadingModal();
						}
					);
				} else {
					this.loadData(value);
				}
			}
		});
	}

	private loadData(subscriptionType: string): void {
		this.showLoadingModal();
		this.subscriptionService.getSubscriptionData<ITableExpiratedPayments>(subscriptionType).subscribe(
			(data) => {
				const groupedData = data.reduce<ITableExpiratedPayments[]>((acc, item) => {
					const existingUser = acc.find((user) => user.iduser === item.iduser);

					const packageId = item.idsuscription ? item.idsuscription.toString() : '0';
					const packageName = item.package?.name || 'No Package';

					if (existingUser) {
						existingUser.packageOpt.push({
							id: packageId,
							text: packageName
						});
					} else {
						acc.push({
							...item,
							packageOpt: [
								{
									id: packageId,
									text: packageName
								}
							]
						});
					}

					return acc;
				}, []);

				this.table.data = groupedData;
				this.fullData = groupedData;

				this.subscriptionTable = groupedData.map(() =>
					this.builder.group({
						membership: ['']
					})
				);

				this.dataLoaded = true;
				this.hideLoadingModal();
				this.cdr.detectChanges();
			},
			(error) => {
				console.error('Error fetching subscription data:', error);
				this.hideLoadingModal();
			}
		);
	}

	convertToNumber(value: string): number {
		return Number(value);
	}

	onMembershipChange(event: Event, index: number): void {
		const target = event.target as HTMLSelectElement;

		if (target && target.value) {
			const id = this.convertToNumber(target.value);
			if (id) {
				this.subscriptionService.getUnpaidPaymentBySubscription(id).subscribe(
					(paymentData) => {
						if (paymentData) {
							this.descriptions[index] = paymentData.quoteDescription;
							this.nextExpirations[index] = paymentData.nextExpiration;
							this.amounts[index] = paymentData.quotaUsd || 0;
						} else {
							this.descriptions[index] = '-';
							this.nextExpirations[index] = '-';
							this.amounts[index] = 0;
						}
						this.cdr.detectChanges();
					},
					(error) => {
						console.error('Error fetching payment data:', error);
					}
				);
			}
		}
	}

	ngAfterViewInit() {
		const selectElement = document.querySelector('select[aria-hidden="true"]');
		if (selectElement) {
			selectElement.removeAttribute('aria-hidden');
		}
	}

	/* === Events === */

	private filterDataBySearchTerm(): void {
		const searchTerm = this.form.get('search')?.value?.toLowerCase().trim();
		if (searchTerm) {
			this.filteredData = this.fullData.filter((item) =>
				item.fullname.toLowerCase().includes(searchTerm)
			);
		} else {
			this.filteredData = this.fullData;
		}

		this.table.data = this.filteredData;
	}

	onSubmit(): void {
		this.filterDataBySearchTerm();
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modalService.open(ModalLoadingComponentManageBusiness, {
			centered: true,
			size: 'sm'
		});
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}
}
