import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import {
	DialogService,
	DynamicDialogConfig,
	DynamicDialogModule,
	DynamicDialogRef
} from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { Router } from '@angular/router';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { IPackage } from '../../interfaces/Migration.interface';

@Component({
	selector: 'modal-prodts-detail',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule
	],
	templateUrl: './modal-deteil-migration-package.html',
	styleUrls: [],
	providers: [DialogService]
})
export default class ModalDeteilMigrationComponent implements OnInit {
	isLoading = new BehaviorSubject<boolean>(false);
	product: any;
	selectedElement: any;
	paymentDetails: any;
	productId: number;
	loadingRef: any;
	@Input() selectedPackage: any;
	@Input() selectedPortfolio: any;
	@Output() nextClicked = new EventEmitter<any>();
	packageData: IPackage;
	idSus: any;
	deteilMigration: any;
	selectedMigrationDetail: any;
	selectedPackageData: any;
	idOption: number;

	constructor(private router: Router, public ref: DynamicDialogRef, public config: DynamicDialogConfig) {}

	ngOnInit(): void {
		const datos = this.config.data;
		if (datos.element) {
			this.selectedPackage = datos.element;
			this.deteilMigration = datos.selectedPackage;
		}
	}

	initializePaymentDetails(): void {
		this.paymentDetails = this.config.data?.element;
	}

	onClickButton() {
		this.ref.close(this.selectedPackageData);
		this.isLoading.next(true);
		this.router
			.navigate(['/profile/partner/my-products/migration-verification'], {
				queryParams: {
					/* idPack: idPack,
					idDet: idDet, */
					idSus: this.idSus,
					idOption: this.idOption,
					currentTab: this.config.data.currentTab,
					selectedPackage: JSON.stringify(this.selectedPackage),
					deteilMigration: JSON.stringify(this.deteilMigration)
				}
			})
			.then(() => {
				this.isLoading.next(false);
			});
	}
}
