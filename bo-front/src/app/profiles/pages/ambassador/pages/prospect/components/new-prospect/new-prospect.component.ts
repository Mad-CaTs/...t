import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ISelect } from '@shared/interfaces/forms-control';
import {
	DynamicDialogRef,
	DynamicDialogConfig,
	DynamicDialogModule,
	DialogService
} from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil, tap, timeout } from 'rxjs';
import { optGenderMock } from '../../../account/pages/account-bank-data-tab/commons/mocks/_mock';
import { NewPartnerService } from '../../../new-partner/commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from '../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ProspectPresenter } from './new-prospect.presenter';
import { MatIconModule } from '@angular/material/icon';
import { CheckboxComponent } from '@shared/components/form-control/checkbox/checkbox.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { TextAreaComponent } from '@shared/components/form-control/text-area/text-area.component';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ProspectService } from '../../services/prospect-service.service';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { TokenManagerService } from '@shared/services/token-manager/token-manager.service';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';

@Component({
	selector: 'app-new-prospect',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule,
		InputComponent,
		FileComponent,
		InputNumberModule,
		ProgressSpinnerModule,
		DateComponent
	],
	templateUrl: './new-prospect.component.html',
	styleUrl: './new-prospect.component.scss',
	providers: [ProspectPresenter, DatePipe, DialogService]
})
export class NewProspectComponent {
	prospectForm: FormGroup;
	documentTypes: ISelect[];
	isLoading: boolean = false;
	linkLoading: boolean = false;
	showTooltip: boolean = false;
	optGenders: ISelect[] = optGenderMock;
	nationalitiesList: any[] = [];
	userInfoId: any;
	civilStateList: ISelect[];
	@Output() register = new EventEmitter<any>();
	@Output() cancel = new EventEmitter<void>();
	@Input() isRegisteringPromotionalGuest: boolean = false;

	@ViewChild(FileComponent) fileComponent!: FileComponent;
	private destroy$: Subject<void> = new Subject<void>();
	@Input() isPromotionalGuest: boolean;
	specialTypes: ISelect[] = [];
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		public prospectPresenter: ProspectPresenter,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private productService: ProductService,
		private newPartnerService: NewPartnerService,
		private prospectService: ProspectService,
		private dialogService: DialogService,
		private datePipe: DatePipe,
		private userInfoService: UserInfoService,
		private tokenService: TokenManagerService
	) {
		this.userInfoId = this.userInfoService.userInfo.id;
	}

	ngOnInit(): void {
		this.initdata();
		this.prospectForm.get('prospectType')?.valueChanges.subscribe((value) => {
			if (value !== '4') {
				this.prospectForm.get('description')?.setValue('', { emitEvent: false });
			}
		});
	}

	private initdata() {
		this.prospectPresenter.isPromotionalGuest = this.isPromotionalGuest;
		this.getNationalities();
		this.prospectForm = this.prospectPresenter.prospectForm;
		this.getCivilStatus();
		this.handleProspectTypeChange();
		this.handleSpecialTypeChange();
	}

	private handleProspectTypeChange(): void {
		this.prospectForm
			.get('prospectType')
			?.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((value) => {
				if (value === '2' && this.isPromotionalGuest) {
					this.loadSuscriptions();
				}
			});
	}

	private handleSpecialTypeChange(): void {
		this.prospectForm
			.get('specialType')
			?.valueChanges.pipe(takeUntil(this.destroy$))
			.subscribe((selectedValue) => {
				if (selectedValue) {
					const selectedMembership = this.specialTypes.find((type) => type.value === selectedValue);
					if (selectedMembership) {
					}
				}
			});
	}

	loadSuscriptions() {
		this.productService
			.getSuscription(this.userInfoId)
			.pipe(
				takeUntil(this.destroy$),
				tap((suscriptions) => {
					this.specialTypes = suscriptions.map((s) => ({
						value: s.id,
						content: s.nameSuscription
					}));
				})
			)
			.subscribe();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	getNationalities() {
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
				tap((civilStatus) => {
					this.civilStateList = civilStatus;
				})
			)
			.subscribe();
	}

	getDocumentType(event: any) {
		this.newPartnerGeneralInfoService
			.getDocumentType(event.idCountry)
			.pipe(
				takeUntil(this.destroy$),
				tap((documentTypes) => {
					this.documentTypes = documentTypes;
				})
			)
			.subscribe();
	}

	toggleTooltip(): void {
		this.showTooltip = !this.showTooltip;
	}

	closeTooltip(): void {
		this.showTooltip = false;
	}

	clearForm(): void {
		this.prospectForm.reset();
		if (this.fileComponent) {
			this.fileComponent.clearFile();
		}
	}

	saveProspect() {
		this.isLoading = true;
		this.prospectForm.get('userId').setValue(this.userInfoId);
		if (this.prospectForm.valid) {
			const formData = new FormData();
			Object.entries(this.prospectForm.value).forEach(([key, value]) => {
				formData.append(key, value as string | Blob);
			});

			this.prospectService
				.saveProspect(formData)
				.pipe(
					finalize(() => {
						this.isLoading = false;
					})
				)
				.subscribe({
					next: (response) => {
						const ref = this.dialogService.open(ModalSuccessComponent, {
							header: '',
							data: {
								text: 'El prospecto se guardo correctamente.',
								title: '¡Éxito!',
								icon: 'assets/icons/Inclub.png'
							}
						});
					},
					error: (err) => {
						this.dialogService.open(ModalAlertComponent, {
							header: '',
							data: {
								message: 'El prospecto no se pudo guardar.',
								title: '¡Error!',
								icon: 'pi pi-times-circle'
							}
						});
					},
					complete: () => {
						this.clearForm();
					}
				});
		}
	}

	saveLink() {
		this.linkLoading = true;
		const id = this.userInfoId;
		const token = this.tokenService.generateTokenBase64(id, 30);
		const link = `https://gateway.inclub.world/backoffice/home/prospect/temporal/${token}`;
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(link).then(
				() => {
					setTimeout(() => {
						this.linkLoading = false;
					}, 500);
				},
				(err) => {
					setTimeout(() => {
						this.linkLoading = false;
					}, 500);
					console.error('Error copying link using clipboard API:', err);
				}
			);
		} else {
			this.copyToClipboardFallback(link);
		}
	}

	private copyToClipboardFallback(link: string) {
		const textarea = document.createElement('textarea');
		textarea.value = link;
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.focus();
		textarea.select();

		try {
			const successful = document.execCommand('copy');
			if (successful) {
			} else {
				console.error('Failed to copy link using fallback.');
			}
		} catch (err) {
			console.error('Error copying link using fallback:', err);
		}
		document.body.removeChild(textarea);
		this.linkLoading = false;
	}

	onRegister(): void {
		if (!this.prospectForm.valid) {
			this.dialogService.open(ModalAlertComponent, {
				header: '',
				data: {
					message: 'Por favor, completa todos los campos requeridos antes de continuar.',
					title: 'Ups!!',
					icon: 'pi pi-exclamation-triangle'
				}
			});
			return;
		}

		const prospectType = this.prospectForm.get('prospectType')?.value;
		if (prospectType === '2' && this.isPromotionalGuest) {
			const selectedSpecialTypeId = this.prospectForm.get('specialType')?.value;
			if (!selectedSpecialTypeId) {
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'Por favor, selecciona una membresía antes de continuar.',
						title: 'Ups!!',
						icon: 'pi pi-exclamation-triangle'
					}
				});
				return;
			}

			const selectedSpecialType = this.specialTypes.find(
				(type) => type.value === selectedSpecialTypeId
			);

			if (!selectedSpecialType) {
				this.dialogService.open(ModalAlertComponent, {
					header: '',
					data: {
						message: 'La membresía seleccionada no es válida.',
						title: 'Ups!!',
						icon: 'pi pi-exclamation-triangle'
					}
				});
				return;
			}
			const formData = {
				...this.prospectForm.value,
				specialTypeId: selectedSpecialType.value,
				specialTypeName: selectedSpecialType.content
			};
			this.register.emit(formData);
		} else {
			this.register.emit(this.prospectForm.value);
		}
	}

	onCancel(): void {
		this.cancel.emit();
	}
}
