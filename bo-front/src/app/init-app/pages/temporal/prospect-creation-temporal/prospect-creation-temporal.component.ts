import { CommonModule, DatePipe } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { TokenManagerService } from '@shared/services/token-manager/token-manager.service';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Subject, takeUntil, tap, finalize } from 'rxjs';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { optGenderMock } from 'src/app/profiles/pages/ambassador/pages/account/pages/account-bank-data-tab/commons/mocks/_mock';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ProspectPresenter } from 'src/app/profiles/pages/ambassador/pages/prospect/components/new-prospect/new-prospect.presenter';
import { ProspectService } from 'src/app/profiles/pages/ambassador/pages/prospect/services/prospect-service.service';

@Component({
	selector: 'app-prospect-creation-temporal',
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
		ProgressSpinnerModule
	],
	templateUrl: './prospect-creation-temporal.component.html',
	styleUrl: './prospect-creation-temporal.component.scss',
	providers: [ProspectPresenter, DatePipe, DialogService]
})
export class ProspectCreationTemporalComponent {
	prospectForm: FormGroup;
	documentTypes: ISelect[];
	isLoading: boolean = false;
	linkLoading: boolean = false;
	showTooltip: boolean = false;
	optGenders: ISelect[] = optGenderMock;
	nationalitiesList: any[] = [];
	isTemporal: boolean = false;
	token: any;
	userInfoId: any;
	@ViewChild(FileComponent) fileComponent!: FileComponent;
	private destroy$: Subject<void> = new Subject<void>();
	public disabledUser: boolean = this.userInfoService.disabled;

	constructor(
		public prospectPresenter: ProspectPresenter,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private newPartnerService: NewPartnerService,
		private prospectService: ProspectService,
		private dialogService: DialogService,
		private datePipe: DatePipe,
		private userInfoService: UserInfoService,
		private tokenService: TokenManagerService,
		private activateRoute: ActivatedRoute,
		private router: Router
	) {
		this.userInfoId = this.userInfoService.userInfo.id;
		this.token = this.activateRoute.snapshot.paramMap.get('id');
		if (this.token != null) {
			const valid = this.tokenService.validateTokenBase64(this.token);
			if (!valid) {
				this.router.navigateByUrl('/home');
			}
			this.userInfoId = this.tokenService.decodeTokenBase64(this.token).id;
			this.isTemporal = true;
		}
	}

	ngOnInit(): void {
		this.getNationalities();
		this.prospectForm = this.prospectPresenter.prospectForm;
		this.prospectForm.get('prospectType')?.valueChanges.subscribe((value) => {
			if (value !== '4') {
				this.prospectForm.get('description')?.setValue('', { emitEvent: false });
			}
		});
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
			if (this.tokenService.validateTokenBase64(this.token)) {
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
	}

	saveLink() {
		this.linkLoading = true;
		const id = this.userInfoId;
		const token = this.tokenService.generateTokenBase64(id, 30);
		const link = `http://gateway-dev.inclub:8090/backoffice/home/prospect/temporal/${token}`;
		if (navigator.clipboard && navigator.clipboard.writeText) {
			navigator.clipboard.writeText(link).then(
				() => {
					setTimeout(() => {
						this.linkLoading = false;
					}, 1000);
				},
				(err) => {
					setTimeout(() => {
						this.linkLoading = false;
					}, 1000);
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
				console.log('Link copied to clipboard using fallback:', link);
			} else {
				console.error('Failed to copy link using fallback.');
			}
		} catch (err) {
			console.error('Error copying link using fallback:', err);
		}
		document.body.removeChild(textarea);
		setTimeout(() => {
			this.linkLoading = false;
		}, 1000);
	}
}
