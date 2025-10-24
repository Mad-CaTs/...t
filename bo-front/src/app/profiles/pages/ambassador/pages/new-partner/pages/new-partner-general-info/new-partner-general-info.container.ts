import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { tap, Subject, takeUntil, filter, finalize } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INewPartnerStep1Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { ISelect } from '@shared/interfaces/forms-control';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { NewPartnerGeneralInfoComponent } from './new-partner-general-info.component';
import { NewPartnerService } from '../../commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from './commons/services/new-partner-general-info.service';
import { DialogService } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { NewPartnerFormPresenter } from '../../new-partner.presenter';
import { ModalCoRequesterComponent } from '../../commons/modals/modal-co-requester/modal-co-requester.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ProspectService } from '../../../prospect/services/prospect-service.service';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ValidationMultiCodeResponse } from '../../commons/interfaces/new-partner.interface';
import { SingleResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';

@Component({
	selector: 'app-new-partner-general-info',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		ReactiveFormsModule,
		DropdownModule,
		FormsModule,
		NewPartnerGeneralInfoComponent,
		TableModule
	],
	templateUrl: './new-partner-general-info.container.html',
	styleUrls: [],
	providers: [DialogService]
})
export class NewPartnerGeneralInfoContainer implements OnInit, AfterViewInit {
	@Input() form: FormGroup;
	@Input() isToken: boolean;
	@Output() submit = new EventEmitter<INewPartnerStep1Data>();

	public registerTypeList: ISelect[];
	public nationalitiesList: ISelect[];
	public documentTypeList: ISelect[];
	public civilStateList: ISelect[];
	public genderList: ISelect[];
	public familyPackagesList: any[] = [];
	private destroy$: Subject<void> = new Subject<void>();

	cities: any;
	userInfo: any;
	selectedCivilState: string;
	selectedNationality: string;
	@Input() coRequesterData: any;
	documentAlreadyExists: boolean;
	@Output() onCheckDocumentExists = new EventEmitter<boolean>();
	@Output() changeTypeUser = new EventEmitter<string>();
	@Output() familyPackagesChanged = new EventEmitter<any[]>();
	@Input() isMultiUsuario = false;
	isDocumentLoading: boolean = false;

	constructor(
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private newPartnerService: NewPartnerService,
		private changeDetectorRef: ChangeDetectorRef,
		private prospectService: ProspectService,
		private dialogService: DialogService,
		private userInfoService: UserInfoService
	) {
		this.userInfo = userInfoService.userInfo;
	}

	ngAfterViewInit(): void {
		this.changeDetectorRef.detectChanges();
		this.form.get('idDocument')?.valueChanges.subscribe(() => this.checkDocumentExists());
	}

	ngOnInit(): void {
		this.getSelectsData();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	onSubmit() {
		this.submit.emit();
	}

	onFamilyPackagesChange(packages: any[]): void {
		this.familyPackagesChanged.emit(packages);
	}


	private getSelectsData() {
		this.getNationalities();
		this.getCivilStatus();
		this.getGender();
		this.getRegisterType();
	}

	private getNationalities() {
		this.newPartnerService
			.getCountriesList()
			.pipe(
				takeUntil(this.destroy$),
				tap((paises) => (this.nationalitiesList = paises))
			)
			.subscribe();
	}

	private getCivilStatus() {
		this.newPartnerGeneralInfoService
			.getCivilstatus()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => (this.civilStateList = civilStatus))
			)
			.subscribe();
	}

	public getDocumentType(idCountry: number) {
		this.newPartnerGeneralInfoService
			.getDocumentType(idCountry)
			.pipe(
				takeUntil(this.destroy$),
				tap((documentTypes) => {
					this.documentTypeList = documentTypes;
					this.form.get('idDocument')?.reset();
				})
			)
			.subscribe();
	}

	private getGender() {
		this.newPartnerGeneralInfoService
			.getGender()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => (this.genderList = civilStatus))
			)
			.subscribe();
	}

	private getRegisterType() {
		this.newPartnerGeneralInfoService
			.getRegisterType()
			.pipe(
				takeUntil(this.destroy$),
				tap((items) => {

					if (this.isToken) {
						this.registerTypeList = items.filter(i => i.value === 2);
						this.setRegisterTypeValue();
					} else {

						this.newPartnerService.validateIsParentAndCanCreateChild(this.userInfo.id).subscribe({
							next: (response: SingleResponse<ValidationMultiCodeResponse>) => {
								const data = response.data;
								// Por ahora quitamos el tipo 1 (PROMOTOR), porque no existe
								this.registerTypeList = items.filter((item: ISelect) => item.value !== 1);

								// Si el usuario no es padre, deshabilitamos la opción de crear hijos
								this.registerTypeList = this.registerTypeList.map((item: ISelect) => {
									if (item.value === 3 && (!data.isParent || !data.canCreate)) {
										return { ...item, disabled: true };
									}
									return { ...item };
								});
								this.setRegisterTypeValue();
							}
						});
					}

				}),
			)
			.subscribe();
	}

	private setRegisterTypeValue() {
		const controlRegisterType = this.form.get('registerType');
		controlRegisterType?.setValue(this.registerTypeList[0]?.value);
	}

	public onDeleteCoRequester() {
		this.coRequesterData = null;
	}

	public onOpenCoAffiliateModal() {
		const nationalityId = this.form.get('idNationality').value;
		const isValid = (val: any): boolean => val !== null && val !== undefined && val !== '';
		if (isValid(nationalityId)) {
			if (this.documentTypeList) {
				this.dialogService
					.open(ModalCoRequesterComponent, {
						header: 'Datos Co-Solicitante',
						data: {
							documentTypeList: this.documentTypeList,
							coRequesterData: this.coRequesterData
						},
						maskStyleClass: 'modal-co-requester'
					})
					.onClose.pipe(
						filter((data) => !!data),
						tap((data) => {
							this.form.get('coAffiliateData').setValue(data);
							this.coRequesterData = data;
						})
					)
					.subscribe();
			}
		} else {
			this.dialogService.open(ModalAlertComponent, {
				data: {
					message: 'Debe seleccionar una nacionalidad primero.',
					title: '¡Alerta!',
					icon: 'pi pi-exclamation-triangle'
				}
			});
			return;
		}
	}

	public isValid(val: any): boolean {
		return val !== null && val !== undefined && val !== '';
	}

	public checkDocumentExists(): void {
		const documentNumber = this.form.get('nroDocument').value;
		const documentControl = this.form.get('nroDocument');
		if (documentNumber && documentNumber.trim() !== '') {
			const idDocumentType = this.form.get('idDocument')?.value;
			const idNationality = this.form.get('idNationality')?.value;

			if (!this.isValid(idDocumentType) || !this.isValid(idNationality)) {
				const documentTypeControl = this.form.get('idDocument');
				const nationalityControl = this.form.get('idNationality');
				documentTypeControl.markAsTouched();
				nationalityControl.markAsTouched();
				return;
			}

			if (idDocumentType === 2 && idNationality === 167) {
				if (isNaN(Number(documentNumber))) {
					documentControl.setErrors({ onlyNumbers: true });
					return;
				}
				if (documentNumber.length !== 8) {
					documentControl.setErrors({ DNI_PERU: true });
					return;
				}
			}

			this.isDocumentLoading = true;
			documentControl.disable();
			this.newPartnerService
				.checkDocument(documentNumber, idDocumentType, idNationality)
				.pipe(
					tap((response: any) => {
						if (response.result && response.data) {
							this.isDocumentLoading = false;
							documentControl.enable();
							documentControl.setErrors({ documentExists: true });
						} else {
							this.prospectService
								.findProspectDocumentNumber(documentNumber)
								.pipe(
									finalize(() => {
										this.isDocumentLoading = false;
									})
								)
								.subscribe({
									next: (response) => {
										if (
											response.data.userId !== this.userInfo.id &&
											response.data.status == 0
										) {
											documentControl.enable();
											documentControl.setErrors({ prospectFound: true });
										} else {
											documentControl.enable();
										}
									},
									error: (error) => {
										documentControl.enable();
										if (error.status !== 404) {
											documentControl.setErrors({ error: true });
										}
									}
								});
						}
					})
				)
				.subscribe();
		}
	}

	onChangeTypeUser(value) {
		this.changeTypeUser.emit(value);
	}
}
