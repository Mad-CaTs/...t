import { Component, EventEmitter, inject, Input, Output, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { INewPartnerStep3Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Subject, takeUntil, tap } from 'rxjs';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { NewPartnerSelectPackageService } from './commons/service/new-partner-select-package.service';
import { SelectedPackageService } from '../../commons/services/package-detail.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { PackageToTransfer } from './commons/interfaces/new-partner-select-package';
import { MultiCodePackagesComponent } from './multi-code-packages/multi-code-packages.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ListResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { Router } from '@angular/router';

@Component({
	selector: 'app-new-partner-select-package',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		MatCheckboxModule,
		NgbAccordionModule,
		RadioButtonModule,
		RadiosComponent
	],
	templateUrl: './new-partner-select-package.component.html',
	styleUrls: ['./new-partner-select-package.component.scss']
})
export class NewPartnerSelectPackageComponent implements OnInit, OnDestroy {
	@Input() data;
	@Input() preloadedData: INewPartnerStep3Data | undefined = undefined;
	@Input() packagess = new FormControl(1);
	@Input() presenter: any;
	@Output() submit = new EventEmitter<INewPartnerStep3Data>();
	@Output() prevState = new EventEmitter();
	@Input() controlName: string;
	@Input() showPromotionalCode: boolean = true;
	@Input() isMultiUser: boolean = false;
	@Output() packageSelected = new EventEmitter<any>();

	public packages: any[] = [];
	public familyPackageList: any;
	public isPackageSelected: boolean = false;
	public disabledUser: boolean = this.userInfoService.disabled;
	public packagesToTransfer: PackageToTransfer[] = [];
	private dialogService: DialogService = inject(DialogService);
	public isAvailableForTransfer: boolean = false;
	private destroy$ = new Subject<void>();

	@Input() set familyPackages(packages: any[]) {
		if (packages && packages.length > 0) {
			this.packages = JSON.parse(JSON.stringify(packages));

			const packageControl = this.getForm('packageData')?.get('packageDetailId');

			if (packageControl) {
				packageControl.reset(null, { emitEvent: false });
			}

			this.cdr.markForCheck();

			setTimeout(() => {
				this.cdr.detectChanges();
			}, 0);
		} else {
			this.packages = [];
			this.cdr.detectChanges();
		}
	}

	constructor(
		public userInfoService: UserInfoService,
		private newPartnerSelectPackageService: NewPartnerSelectPackageService,
		private selectedPackageService: SelectedPackageService,
		private cdr: ChangeDetectorRef,
		private router: Router
	) { }

	ngOnInit(): void {
		this.getPackagesToTransfer();
		if (this.router.url === '/profile/ambassador/store') {
			this.getFamilyPackage();
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	getFamilyPackage() {
		this.newPartnerSelectPackageService
			.getFamilyPackage()
			.pipe(
				takeUntil(this.destroy$),
				tap((familyPackageList) => {
					this.packages = familyPackageList;
					this.cdr.detectChanges();
				})
			)
			.subscribe({
				error: (err) => console.error('[SELECT-PACKAGE] Error:', err)
			});
	}

	getPackagesToTransfer() {
		this.newPartnerSelectPackageService
			.getValidSubscriptions(3, this.userInfoService.userInfo.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: ListResponse<PackageToTransfer>) => {
					if (!response.data || response.data.length === 0) {
						this.isAvailableForTransfer = false;
						return;
					}
					this.packagesToTransfer = response.data;
					this.isAvailableForTransfer = true;
				},
				error: (error) => {
					this.isAvailableForTransfer = false;
				}
			});
	}

	trackByPackageId(index: number, item: any): any {
		return item?.idFamilyPackage || index;
	}

	trackByPackageItemId(index: number, item: any): any {
		return item?.idPackage || index;
	}

	onPackageSelection(val) {
		const selectedPackage = this.findPackageById(val);
		if (selectedPackage) {
			this.selectedPackageService.setSelectedPackageData(selectedPackage);
		} else {
			console.warn('Paquete no encontrado con ID:', val);
		}
	}

	getForm(form: string) {
		return this.presenter?.multiStepForm?.controls[form];
	}

	findPackageById(idToFind) {
		for (const packageData of this.packages) {
			if (packageData.packageList) {
				for (const packageItem of packageData.packageList) {
					if (packageItem.idPackage === idToFind) {
						return packageItem;
					}
				}
			}
		}
		return null;
	}

	setPgId(id) {
		this.getForm('packageData')?.get('packageDetailId')?.setValue(id);
	}

	onSubmit() {
		this.submit.emit();
	}

	openMultiCodePackages() {
		this.dialogService.open(MultiCodePackagesComponent, {
			width: '564px',
			data: this.packagesToTransfer,
			breakpoints: {
				'575px': '90vw',
				'320px': '95vw'
			}
		});
	}
}