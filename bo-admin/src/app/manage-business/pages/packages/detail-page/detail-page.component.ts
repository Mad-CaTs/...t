import { ChangeDetectorRef, Component } from '@angular/core';

import { tableDataMock } from './mock';

import { TableModel } from '@app/core/models/table.model';

import type { ITableDetailPackage } from '@interfaces/manage-business.interface';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';

/* === Modules === */
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TablesModule } from '@shared/components/tables/tables.module';
import { ModalDetailUpsertComponent } from '@app/manage-business/components/modals';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { MembershipVersionAdministratorService } from '@app/manage-business/services/MembershipVersionAdministratorService';
import { IMembershipVersion } from '@interfaces/packageAdministrator';
import { PackageDetailAdministratorService } from '@app/manage-business/services/PackageDetailAdministratorService';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalDetailEditComponent } from '@app/manage-business/components/modals/modal-detail-edit/modal-detail-edit.component';
import { ModalDetailCreateComponent } from '@app/manage-business/components/modals/modal-detail-create/modal-detail-create.component';
import { DetailDetailPageComponent } from './detail-detail-page/detail-detail-page.component';
import { PackageDetailRewardsService } from '@app/manage-business/services/package-detail-rewards.service';

@Component({
	selector: 'app-detail-page',
	standalone: true,
	imports: [
		CommonModule,
		FormControlModule,
		ReactiveFormsModule,
		TablesModule,
		DetailDetailPageComponent,
		NgIf
	],
	templateUrl: './detail-page.component.html',
	styleUrls: ['./detail-page.component.scss']
})
export class DetailPageComponent {
	public readonly table: TableModel<ITableDetailPackage>;

	public familyPackageOptions: ISelectOpt[] = [];
	public versionOptions: ISelectOpt[] = [];

	private loadingModalRef: NgbModalRef | null = null;

	public form: FormGroup;
	pointsFreeMock: number = 5000;
	statusMock: boolean = true;

	public refresh: boolean = false;

	// Paginación
	public currentPage: number = 1;
	public itemsPerPage: number = 5;
	public pagedData: ITableDetailPackage[] = [];

	public openNewDetalle: boolean = false;

	public idEdit!: number;
	public familyPackageOptionsSend: ISelectOpt[] = [];

	constructor(
		public formBuilder: FormBuilder,
		public modal: NgbModal,
		private tableService: TableService,
		private cdr: ChangeDetectorRef,
		private familyPackageAdministratorService: FamilyPackageAdministratorService,
		private membershipVersionService: MembershipVersionAdministratorService,
		private packageDetailAdministratorService: PackageDetailAdministratorService,
		private packageDetailService: PackageDetailRewardsService
	) {
		this.form = formBuilder.group({
			family: ['1'],
			version: ['1']
		});

		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableDetailPackage>({
			headers: [
				'Paquete',
				'Código',
				'Duración',
				'Precio total',
				'N° de Cuota',
				'Precio Inicial',
				'Precio de cuota',
				'Volumen de inicial',
				'Volumen de cuota',
				'N° de cuota inicial',
				'N° de acciones',
				//'Puntaje a liberar',
				'USD Rewards',
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
					console.error('Error loading family packages:', error);
					return of([]);
				})
			)
			.subscribe((familyPackageOptions) => {
				this.familyPackageOptions = familyPackageOptions;
				this.cdr.detectChanges();
			});

		this.loadMembershipVersions(this.form.get('family')?.value);

		this.form.get('family')?.valueChanges.subscribe((familyPackageId) => {
			this.loadMembershipVersions(familyPackageId);
		});

		this.form.get('version')?.valueChanges.subscribe(() => {
			this.loadDetailPackage();
		});
	}

	private loadMembershipVersions(familyPackageId: string): void {
		this.membershipVersionService
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

	private loadDetailPackage(): void {
		const version = this.form.get('version')?.value;
		const family = this.form.get('family')?.value;

		this.showLoadingModal();
		this.packageDetailService.listPackageDetailRewards(family, version).subscribe((details) => {
			this.table.data = details.map((detail) => ({
				id: detail.packageDetail.idPackageDetail,
				idPackage: detail.packageDetail.idPackage,
				family: detail.packageDetail.description || '-',
				name: detail.packageSummary.packageName || '-',
				code: detail.packageSummary.code || '-',
				months: detail.packageDetail.monthsDuration,
				price: detail.packageDetail.price,
				cuotes: detail.packageDetail.numberQuotas,
				initialPrice: detail.packageDetail.initialPrice,
				cuotePrice: detail.packageDetail.quotaPrice,
				volume: detail.packageDetail.volume,
				volumeByFee: detail.packageDetail.volumeByFee,
				intialCuoteN: detail.packageDetail.numberInitialQuote,
				comission: detail.packageDetail.comission,
				actionsN: detail.packageDetail.numberShares,
				packageName: detail.packageDetail.packageName,
				pointsFree: detail.rewardsDetail.totalRewardsToUse + detail.rewardsDetail.extraRewards,
				points: detail.packageDetail.points,
				interCuote: detail.packageDetail.installmentInterval,
				freePointStatus: detail.packageDetail.canReleasePoints
			}));
			this.updatePagedData();
			this.cdr.detectChanges();
			this.hideLoadingModal();
			console.log('details', details);
		});
	}

	/* === Events === */
	public onSearch() {}

	public onRefresh() {
		//this.loadFamilyPackage();
		this.loadDetailPackage();
	}

	public onCreate() {
		this.idEdit = 0;
		console.log(this.form.get('version')?.value);
		this.familyPackageOptionsSend = this.familyPackageOptions;
		this.openNewDetalle = true;
	}

	public onEdit(id: number, data: ITableDetailPackage) {
		this.idEdit = id;
		this.openNewDetalle = true;
		const selectedFamilyPackage = this.familyPackageOptions.find(
			(option) => option.id === this.form.get('family')?.value
		);
		this.familyPackageOptionsSend = selectedFamilyPackage
			? [selectedFamilyPackage]
			: [{ id: '', text: 'Unknown Package' }];
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

	onPageChange(page: number) {
		this.currentPage = page;
		this.updatePagedData();
	}

	updatePagedData() {
		const start = (this.currentPage - 1) * this.itemsPerPage;
		const end = start + this.itemsPerPage;
		this.pagedData = this.table.data.slice(start, end);
	}

	closeComponent($event: boolean) {
		this.openNewDetalle = $event;
		this.idEdit = 0;
	}
}
