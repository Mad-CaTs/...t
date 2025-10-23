import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TableModel } from '@app/core/models/table.model';
import type { ITablePackagePackage } from '@interfaces/manage-business.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TableService } from '@app/core/services/table.service';
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { PackageAdministratorService } from '@app/manage-business/services/PackageAdministratorService';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { ModalPackageEditComponent } from '@app/manage-business/components/modals/modal-package-edit/modal-package-edit.component';
import { ModalPackageCreateComponent } from '@app/manage-business/components/modals';
import { DetailCreatePageComponent } from './detail-create-page/detail-create-page.component';

@Component({
	selector: 'app-packages-page',
	templateUrl: './packages-page.component.html',
	styleUrls: ['./packages-page.component.scss'],
	standalone: true,
	imports: [CommonModule, FormControlModule, ReactiveFormsModule, TablesModule, DetailCreatePageComponent]
})
export class PackagesPageComponent implements OnInit {
	public readonly table: TableModel<ITablePackagePackage>;

	public form: FormGroup;

	public options: ISelectOpt[] = [];

	private originalData: ITablePackagePackage[] = [];

	private loadingModalRef: NgbModalRef | null = null;

	public showCreateView: boolean = false;
	public newPackageData: ITablePackagePackage | null = null;
	public familyPackageOptionsSend: ISelectOpt[] = [];

	constructor(
		public formBuilder: FormBuilder,
		public modal: NgbModal,
		private tableService: TableService,
		private familyPackageAdministratorService: FamilyPackageAdministratorService,
		private packageAdministratorService: PackageAdministratorService,
		private cdr: ChangeDetectorRef
	) {
		this.form = formBuilder.group({
			search: [''],
			family: ['1']
		});

		this.table = this.tableService.generateTable<ITablePackagePackage>({
			headers: ['Nombre', 'Membresía de código', 'Descripción', 'Estado', 'Editar'],
			headersArrows: [true, true, true, true],
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
			.subscribe((options) => {
				this.options = options;
				this.cdr.detectChanges();
			});

		this.loadPackages();

		this.form.get('family')?.valueChanges.subscribe(() => {
			this.loadPackages();
		});
	}

	public onRefresh() {
		this.loadPackages();
	}

	/* === Events === */
	public onSearch() {
		const searchValue = this.form.get('search')?.value.toLowerCase() || '';
		this.table.data = this.originalData.filter((item) => item.name.toLowerCase().includes(searchValue));
		this.cdr.detectChanges();
	}

	public onCreate(): void {
		const modalRef = this.modal.open(ModalPackageCreateComponent, {
			centered: true,
			size: 'md',
			backdrop: 'static'
		});

		const modalInstance = modalRef.componentInstance as ModalPackageCreateComponent;
		modalInstance.options = this.options;
		modalInstance.idFamilypackage = this.form.get('family')?.value

		modalRef.result.then(
			(result) => {
				if (result?.continue && result?.packageData) {
					this.newPackageData = result.packageData;
					this.showCreateView = true;
					this.cdr.detectChanges();
				}
			},
			() => {}
		);
	}

	public onEdit(id: number, name: string, code: string, description: string, status: boolean) {
		const ref = this.modal.open(ModalPackageEditComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalPackageEditComponent;

		const idFamilyPackageControl = this.form.get('family');
		modal.id = id;
		const selectedPackage: ITablePackagePackage = {
			id: id,
			name: name,
			code: code,
			description: description,
			status: status
		};

		modal.package = selectedPackage;
		if (idFamilyPackageControl) {
			modal.idFamilyPackage = idFamilyPackageControl.value as String;
		}
	}

	loadPackages() {
		this.showLoadingModal();
		const idFamilyPackage = this.form.get('family')?.value;
		this.packageAdministratorService
			.getPackagesByIdFamilyPackage(idFamilyPackage)
			.pipe(
				map((response) =>
					response.map((item) => ({
						id: item.idPackage,
						name: item.name,
						code: item.codeMembership,
						description: item.description,
						status: item.status === 1
					}))
				),
				catchError((error: any) => {
					console.error('Error loading packages:', error);
					return of([]);
				})
			)
			.subscribe((data) => {
				this.originalData = data;
				this.table.data = data;
				this.cdr.detectChanges();
				this.hideLoadingModal();
			});
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

	public onCloseCreateView(success: boolean): void {
		this.showCreateView = false;
		this.newPackageData = null;

		if (success) {
			this.loadPackages();
		}

		this.cdr.detectChanges();
	}
}
