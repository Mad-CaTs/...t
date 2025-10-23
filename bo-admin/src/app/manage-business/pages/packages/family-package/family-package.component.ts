import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { tableDataMock } from './mock';

import type { ITableFamilyPackage } from '@interfaces/manage-business.interface';

import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

/* === Modules === */
import { CommonModule } from '@angular/common';
import { TablesModule } from '@shared/components/tables/tables.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { TableModel } from '@app/core/models/table.model';
import { TableService } from '@app/core/services/table.service';
import { ModalFamilyCreateComponent, ModalFamilyEditComponent } from '@app/manage-business/components/modals';
import { ModalLoadingComponentManageBusiness } from '@app/manage-business/components/modals/modal-loading/modal-loading.component';
import { FamilyPackageAdministratorService } from '@app/manage-business/services/FamilyPackageAdministratorService';

@Component({
	selector: 'app-packages',
	templateUrl: './family-package.component.html',
	styleUrls: ['./family-package.component.scss'],
	standalone: true,
	imports: [CommonModule, TablesModule, FormControlModule]
})
export class FamilyPackageComponent implements OnInit {
	public readonly table: TableModel<ITableFamilyPackage>;

	public form: FormGroup;

	private originalData: ITableFamilyPackage[] = [];

	private loadingModalRef: NgbModalRef | null = null; 

	constructor(public formBuilder: FormBuilder, 
				public modal: NgbModal, 
				private tableService: TableService,
				private packageAdministratorService: FamilyPackageAdministratorService,
				private cdr: ChangeDetectorRef) {
		this.form = formBuilder.group({
			search: ['']
		});

		/* === Table builder === */
		this.table = this.tableService.generateTable<ITableFamilyPackage>({
			headers: ['Nombre', 'Descripción', 'Versión activa', 'Última versión', 'Editar'],
			headersArrows: [true, true, true, true],
			noCheckBoxes: true
		});
		//this.table.data = tableDataMock;
	}

	ngOnInit(): void {
		this.loadFamilyPackages();
	}

	/* === Events === */
	public onSearch() {
		this.showLoadingModal();
		const searchValue = this.form.get('search')?.value.toLowerCase() || '';
    	this.table.data = this.originalData.filter(item =>
      		item.name.toLowerCase().includes(searchValue)
    	);
    	this.cdr.detectChanges();
		this.hideLoadingModal();
	}

	public onCreate() {
		this.modal.open(ModalFamilyCreateComponent, { centered: true, size: 'md' });
	}

	public onEdit(id: number, name: string, description: string) {
		const ref = this.modal.open(ModalFamilyEditComponent, { centered: true, size: 'md' });
		const modal = ref.componentInstance as ModalFamilyEditComponent;
		modal.name = name;
		modal.id = id;
		modal.description = description;


		ref.result.then(
			(result) => {
				if (result === 'success') {
					this.loadFamilyPackages();
				}
			},
		);
		
	}

	public onRefresh(){
		this.loadFamilyPackages();
	}

	loadFamilyPackages(): void {
		this.showLoadingModal();
		this.packageAdministratorService.getAllFamilyPackages().subscribe(
			(data) => {
				this.originalData = data.map(item => this.mapToITableFamilyPackage(item));
        		this.table.data = this.originalData;
        		this.cdr.detectChanges();
				this.hideLoadingModal();
		  	},
		  	(error) => {
				console.error('Error loading family packages:', error);
				this.hideLoadingModal();
		  	}
		);
	  }

	private mapToITableFamilyPackage(item: any): ITableFamilyPackage {
		return {
			id: item.idFamilyPackage,
		  	name: item.name,
		  	description: item.description,
		  	activeVersion: item.currentMembershipVersion?.description || 'N/A',
		  	lastVersion: item.packageList?.[item.packageList.length - 1]?.packageDetail?.[0]?.membershipVersion?.description || 'N/A'
		};
	}

	private showLoadingModal(): void {
		this.loadingModalRef = this.modal.open(ModalLoadingComponentManageBusiness, { centered: true, size: 'sm' });
	}

	private hideLoadingModal(): void {
		if (this.loadingModalRef) {
			this.loadingModalRef.close();
			this.loadingModalRef = null;
		}
	}

}
