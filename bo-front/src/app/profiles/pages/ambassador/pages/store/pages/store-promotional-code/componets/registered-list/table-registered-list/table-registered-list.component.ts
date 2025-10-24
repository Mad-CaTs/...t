import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { TableComponent } from '@shared/components/table/table.component';
import { CommonModule } from '@angular/common';
import { PaginationNgPrimeComponent } from '@shared/components/pagination-ng-prime/pagination-ng-prime.component';
import { TablePaginationService } from '@shared/services/table-pagination.service';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { ITableRegisteredList } from '../commons/interfaces/periodCompound';
import { BuyPackageService } from '../../../../../services/buy-package.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IAccountTreeActivationManagerTable } from 'src/app/profiles/pages/ambassador/pages/tree/commons/interfaces';
import { ITablePromotional } from 'src/app/profiles/pages/ambassador/pages/tree/commons/interfaces/partnerList';
import { CIVIL_STATE_OPTIONS } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/constants';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { finalize, Subject, takeUntil, tap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProspectCreationModalComponent } from '../commons/modals/prospect-creation-modal/promotional-creation-modal.component';

@Component({
	selector: 'app-table-registered-list',
	templateUrl: './table-registered-list.component.html',
	standalone: true,
	imports: [
		CommonModule,
		TableComponent,
		DynamicDialogModule,
		ButtonModule,
		PaginationNgPrimeComponent,
		ReactiveFormsModule,
		MatIconModule,
		ProgressSpinnerModule
	],
	styleUrls: ['./table-registered-list.component.scss']
})
export class TableRegisteredListComponent {
	@Input() dataBody: ITablePromotional[] = [];
	@Input() totalRecords: number = 0;
	@Output() pageChange: EventEmitter<any> = new EventEmitter();
	@Output() refresh: EventEmitter<any> = new EventEmitter();
	@Output() btnClick = new EventEmitter<any>();
	public rows: number = 10;
	@Input() isLoading: boolean = true;
	public first: number = 0;
	public id: string = '';
	align: string = 'right';
	public selected: FormControl = new FormControl(1);
	dialogRef: DynamicDialogRef;
	userInfo: any;

	nationalitiesList: { value: number; content: string }[] = [];
	isButtonLoading: { [key: number]: boolean } = {};
	constructor(
		public tableService: TablePaginationService,
		private buyPackageService: BuyPackageService,
		private userInfoService: UserInfoService,
		private newPartnerService: NewPartnerService,
		private dialogService: DialogService
	) {
		this.id = tableService.addTable(this.dataBody, this.rows);
		this.userInfo = this.userInfoService.userInfo;
	}
	ngOnInit(): void {
		this.selected.setValue(this.dataBody[0]?.id || 1);
		this.getNationalities();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['dataBody']) {
			if (this.dataBody) {
				this.selected.setValue(this.dataBody[0]?.id || 1);
				this.tableService.updateTable(this.dataBody, this.id, this.rows);
				this.isLoading = false;
			} else {
				setTimeout(() => {
					this.isLoading = false;
				}, 1000);
			}
		}
	}

	ngOnDestroy(): void {
		this.tableService.deleteTable(this.id);
	}

	getCivilStateDescription(civilStateId: number): string {
		const state = CIVIL_STATE_OPTIONS.find((option) => option.value === civilStateId);
		return state ? state.content : 'Desconocido';
	}

	private getNationalities() {
		this.newPartnerService.getCountriesList().subscribe(
			(paises) => {
				this.nationalitiesList = paises;
			},
			(error) => {
				console.error('Error al obtener la lista de países', error);
			}
		);
	}

	getCountryName(countryId: number): string {
		const country = this.nationalitiesList.find((item) => item.value === countryId);
		return country ? country.content : '';
	}

	get table() {
		const tableData = this.tableService.getTable<IAccountTreeActivationManagerTable>(this.id);
		return tableData;
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

	get headers() {
		const result = [
			'Item',
			'Nombres',
			'Apellidos',
			'Tipo de invitado',
			'Membresía',
			'N° de documento',
			'Fecha de nacimiento',
			'Estado civil',
			'Nacionalidad',
			'Celular',
			'Correo',
			'Acciones'
		];
		return result;
	}

	get minWidthHeaders() {
		const result = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
		return result;
	}

	editPayItem(id: number) {
		this.dialogRef = this.dialogService.open(ProspectCreationModalComponent, {
			header: 'Editar invitado',
			width: '50%',
			data: {
				userId: this.userInfo.id,
				beneficiaryId: id
			}
		});

		this.dialogRef.onClose.subscribe((data) => {
			if (data === true) {
				const ref = this.dialogService.open(ModalSuccessComponent, {
					header: '',
					data: {
						text: 'El invitado se guardo correctamente.',
						title: '¡Éxito!',
						icon: 'assets/icons/Inclub.png'
					}
				});
				ref.onClose.subscribe(() => {
					this.onRefresh({ rows: this.rows });
				});
			} else if (data === false) {
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'El invitado no se pudo editar.',
						title: '¡Error!',
						icon: 'check_circle_outline'
					}
				});
			}
		});
	}

	deletePayItem(data: any) {
		this.isButtonLoading[data.id] = true;
		this.buyPackageService
			.deleteGuest(data.id)
			.pipe(
				finalize(() => {
					this.isButtonLoading[data.id] = false;
				})
			)
			.subscribe({
				next: () => {
					const ref = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'El invitado se elimino correctamente.',
							title: '¡Éxito!',
							icon: 'assets/icons/Inclub.png'
						}
					});
					ref.onClose.subscribe(() => {
						this.onRefresh({ rows: this.rows });
					});
				},
				error: () => {
					this.dialogService.open(ModalAlertComponent, {
						header: '',
						data: {
							message: 'El invitado no se pudo eliminar.',
							title: '¡Error!',
							icon: 'check_circle_outline'
						}
					});
				}
			});
	}
}
