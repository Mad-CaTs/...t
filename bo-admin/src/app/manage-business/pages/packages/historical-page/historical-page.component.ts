import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '../../../../shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableModel } from '@app/core/models/table.model';
import { ITableHistoricalRecord } from '@interfaces/manage-business.interface';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { TableService } from '@app/core/services/table.service';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';
import { TablesModule } from '../../../../shared/components/tables/tables.module';
import { ModalLoadingComponent } from '@app/validation-payments/components/modals';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { IMembershipVersion } from '@interfaces/packageAdministrator';
import { PackageDetailAdministratorService } from '@app/manage-business/services/PackageDetailAdministratorService';
import { CommonModule } from '@angular/common';
import { HistoricalRecordService } from '@app/manage-business/services/HistoricalRecordService';

@Component({
	selector: 'app-historical-page',
	templateUrl: './historical-page.component.html',
	styleUrls: ['./historical-page.component.scss'],
	standalone: true,
	imports: [FormControlModule, TablesModule, CommonModule, ReactiveFormsModule]
})
export class HistoricalPageComponent {
	public readonly table: TableModel<ITableHistoricalRecord>;
	public readonly tableHistorical: TableModel<ITableHistoricalRecord>;

	public familyPackageOptions: ISelectOpt[] = [];
	public versionOptions: ISelectOpt[] = [];

	private loadingModalRef: NgbModalRef | null = null;

	loading: boolean = false;

	private originalData: ITableHistoricalRecord[] = [];

	public form: FormGroup;
	pointsFreeMock: number = 5000;
	starDateMock: string = '20/03/2025';
	endDateMock: string = '20/08/2025';

	constructor(
		public formBuilder: FormBuilder,
		public modal: NgbModal,
		private tableService: TableService,
		private familyPackageAdministratorService: FamilyPackageAdministratorService,
		private memberShipVersionService: MembershipVersionAdministratorService,
		private packageDetailAdministratorService: PackageDetailAdministratorService,
		private historicalPackageService: HistoricalRecordService,
		private cdr: ChangeDetectorRef
	) {
		this.form = formBuilder.group({
			family: ['1'],
			version: ['1']
		});

		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableHistoricalRecord>({
			headers: [
				'Inicio de Vigencia',
				'Fin de Vigencia',
				'Paquete',
				'Código',
				'Duración',
				'Precio Total',
				'N° de cuota',
				'Precio inicial',
				'Precio de cuota',
				'Volumen',
				'N° de cuota inicial',
				'N° de acciones',
				'Puntaje a liberar',
				'Editar'
			],
			noCheckBoxes: true
		});

		// Inicializar tableHistorical
		/* === Table builder === */
		this.tableHistorical = this.tableService.generateTable<ITableHistoricalRecord>({
			headers: [
				'Inicio de Vigencia',
				'Fin de Vigencia',
				'Paquete',
				'Código',
				'Duración',
				'Precio Total',
				'N° de cuota',
				'Precio inicial',
				'Precio de cuota',
				'Volumen',
				'N° de cuota inicial',
				'N° de acciones',
				'Puntaje a liberar',
				'Editar'
			],
			noCheckBoxes: true
		});
	}

	ngOnInit(): void {
		this.familyPackageAdministratorService
			.getAllFamilyPackages()
			.pipe(
				map((response) =>
					response.map((item) => ({
						id: item.idFamilyPackage.toString(),
						text: item.name
					}))
				),
				catchError((error) => {
					console.error('Error loading family package:', error);
					return of([]);
				})
			)
			.subscribe((familyPackageOptions) => {
				this.familyPackageOptions = familyPackageOptions;
				this.cdr.detectChanges();
			});

		this.loadMemberShipVersion(this.form.get('family')?.value);

		this.form.get('family')?.valueChanges.subscribe((familyPackageId) => {
			this.loadMemberShipVersion(familyPackageId);
		});

		this.form.get('version')?.valueChanges.subscribe(() => {
			//this.loadFamilyPackage();
			//this.loadHistoricalRecord();
			this.loadHistoricalPackageNew()

		});

		//this.loadHistoricalPackageNew();
	}

	private loadMemberShipVersion(familyPackageId: string): void {
		this.memberShipVersionService
			.getAllMembershipVersionByFamilyPackage(familyPackageId)
			.pipe(
				map((response: IMembershipVersion[]) =>
					response.map((item: IMembershipVersion) => ({
						id: item.idMembershipVersion.toString(),
						text: item.description
					}))
				),
				catchError((error) => {
					console.error('Error loading membership versions:', error);
					return of([]);
				})
			)
			.subscribe((versionOptions) => {
				this.versionOptions = versionOptions;
				this.cdr.detectChanges();
				this.form.get('version')?.setValue('1');
			});
	}

	private loadHistoricalPackageNew(): void {

		const version = this.form.get('version')?.value;
		const family = this.form.get('family')?.value;

		this.showLoadingModal();

		this.historicalPackageService
			.getPackageHistoryByFamilyAndVersion(family, version)
			.subscribe({
				next: (historicals) => {
					if (!historicals || historicals.length === 0) {
						this.tableHistorical.data = [];
						console.log('No se encontraron historicos de paquetes.')
						this.hideLoadingModal();

					} else {
						this.tableHistorical.data = historicals.map((historical) => ({
							startDate: this.starDateMock,
							endDate: this.endDateMock,
							id: historical.idPackageDetail,
							idPackage: historical.idPackage,
							family: historical.description,
							name: historical.packageName,
							code: historical.codeMembership,
							months: historical.monthsDuration,
							price: historical.price,
							cuotes: historical.numberQuotas,
							initialPrice: historical.initialPrice,
							cuotePrice: historical.quotaPrice,
							volume: historical.volume,
							initialCuoteN: historical.numberInitialQuote,
							actionsN: historical.numberShares,
							packageName: historical.packageName,
							pointsFree: historical.pointsToRelease
						}));
						console.log('LISTA DE DETALLE HISTORICO PAQUETES 1', historicals);
					}
					this.cdr.detectChanges();
					this.hideLoadingModal();
				},
				error: (err) => {
					console.log('Error al cargar los historicos de paquetes:', err);
					this.cdr.detectChanges();
					this.hideLoadingModal();

				},

			});
	}

	private loadHistoricalRecord(): void {
		const version = this.form.get('version')?.value;
		const family = this.form.get('family')?.value;

		this.showLoadingModal();

		this.packageDetailAdministratorService
			.getDetailPackagesByFamilyAndVersion(family, version)
			.subscribe((details) => {
				this.table.data = details.map((detail) => ({
					startDate: this.starDateMock,
					endDate: this.endDateMock,
					id: detail.idPackageDetail,
					idPackage: detail.idPackage,
					family: detail.description,
					name: detail.packageName,
					code: detail.codeMembership,
					months: detail.monthsDuration,
					price: detail.price,
					cuotes: detail.numberQuotas,
					initialPrice: detail.initialPrice,
					cuotePrice: detail.quotaPrice,
					volume: detail.volume,
					initialCuoteN: detail.numberInitialQuote,
					actionsN: detail.numberShares,
					packageName: detail.packageName,
					pointsFree: detail.pointsToRelease
				}));
				this.cdr.detectChanges();
				this.hideLoadingModal();
				console.log('LISTA DETALLE HISTORICO', details);
			});
	}

	/* === Events === */

	public onSearch() { }

	public onRefresh() {
		this.loadFamilyPackage();
	}
	loadFamilyPackage(): void {
		this.showLoadingModal();
		this.familyPackageAdministratorService.getAllFamilyPackages().subscribe(
			(data) => {
				this.originalData = data.map((item) => this.mapToIterableHistoricalRecord(item));
				console.log(this.originalData);
				this.cdr.detectChanges();
				this.hideLoadingModal();
			},
			(error) => {
				console.error('Error loading family packages:', error);
				this.hideLoadingModal();
			}
		);
	}

	private mapToIterableHistoricalRecord(item: any): ITableHistoricalRecord {
		return {
			id: item.idFamilyPackage,
			idPackage: item.idFamilyPackage,
			startDate: item.startDate,
			endDate: item.endDate,
			packageName: item.name,
			//description: item.description,
			code: item.code,
			months: item.months,
			price: item.price,
			cuotes: item.cuotes,
			initialPrice: item.initialPrice,
			cuotePrice: item.cuotePrice,
			volume: item.volume,
			initialCuoteN: item.initialCuoteN,
			actionsN: item.actionsN,
			pointsFree: item.pointsFree
		};
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, {
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
