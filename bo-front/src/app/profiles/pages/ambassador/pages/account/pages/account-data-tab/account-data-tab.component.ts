import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { optGenderMock } from '../account-bank-data-tab/commons/mocks/_mock';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { NewPartnerService } from '../../../new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { NewPartnerGeneralInfoService } from '../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { CookieService } from 'ngx-cookie-service';
import { SkeletonModule } from 'primeng/skeleton';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { AccountPersonalDataModalComponent } from '../../commons/modals/account-personal-data-modal/account-personal-data-modal.component';
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import { Footer } from 'primeng/api';
import { AccountChangePasswordModalComponent } from '../../commons/modals/account-change-password-modal/account-change-password-modal.component';
import { AccountSocioModalComponent } from '../../commons/modals/account-socio-modal/account-socio-modal.component';
import { icon } from 'leaflet';
import { AccountImageSocioModalComponent } from '../../commons/modals/account-image-socio-modal/account-image-socio-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalOpcionInhabilitadaComponent } from '@shared/modals/modal-opcion-inhabilitada/modal-opcion-inhabilitada.component';

@Component({
	selector: 'app-account-data-tab',
	templateUrl: './account-data-tab.component.html',
	styleUrls: ['./account-data-tab.component.scss'],
	standalone: true,
	providers: [DialogService, DynamicDialogRef],

	imports: [
		CommonModule,
		ReactiveFormsModule,
		SkeletonModule,
		MatIconModule,
		InputComponent,
		DateComponent,
		SelectComponent,
		FormsModule
	]
})
export default class AccountDataTabComponent {
	public formUser: FormGroup;
	public isLoading: boolean = true;
	public formPassword: FormGroup;
	public formFlyer: FormGroup;
	public optGenders: ISelect[] = optGenderMock;
	public nationalitiesList: any[] = [];
	public documentTypes: ISelect[];
	public civilStateOpt: ISelect[];
	public userInfo: any;
	/* Password inputs */
	public showOldPassword: boolean = false;
	public showNewPassword: boolean = false;
	public showRepeatPassword: boolean = false;
	private destroy$: Subject<void> = new Subject<void>();

	dialogRef: DynamicDialogRef;

	showPersonalDataModal = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private newPartnerService: NewPartnerService,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private userInfoService: UserInfoService,
		private cookieService: CookieService,
		private dialogService: DialogService,
		public ref: DynamicDialogRef,

	) {
		this.userInfo = this.userInfoService.userInfo;
		this.formUser = formBuilder.group({
			name: ['', [Validators.required, Validators.minLength(3)]],
			lastName: ['', [Validators.required, Validators.minLength(3)]],
			cellphone: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			gender: ['', [Validators.required]],
			idNationality: ['', [Validators.required]],
			idResidenceCountry: ['', [Validators.required]],
			civilState: ['', [Validators.required]],
			bornDate: ['', [Validators.required]],
			idDocument: ['', Validators.required],
			nroDocument: ['', Validators.required],
			districtAddress: ['', Validators.required],
			address: ['', Validators.required]
		});
		this.formPassword = formBuilder.group({
			oldPassword: ['', [Validators.required, Validators.minLength(6)]],
			newPassword: ['', [Validators.required, Validators.minLength(6)]],
			repeatPassword: ['', [Validators.required, Validators.minLength(6)]]
		});
		this.formFlyer = formBuilder.group({
			profile: [null],
			flyer: [null]
		});
	}

	ngOnInit(): void {
		this.getNationalities();
		this.getCivilStatus();
		this.newPartnerService.getUserByUsername(this.userInfo.username).subscribe({
			next: (value) => {
				this.formUser.patchValue({
					name: value.name,
					lastName: value.lastName,
					cellphone: value.nroPhone,
					gender: Number(value.gender),
					email: value.email,
					idNationality: value.idNationality,
					idResidenceCountry: value.idResidenceCountry,
					address: value.address,
					idDocument: value.idDocument,
					nroDocument: value.nroDocument,
					civilState: Number(value.civilState),
					bornDate: new Date(value.birthdate),
					districtAddress: value.districtAddress
				});
				this.getDocumentType({ idCountry: value.idResidenceCountry });
				this.isLoading = false;
			}
		});
		console.log('DATOS USERINFO', this.userInfo);
		this.formUser.get('name').disable();
		this.formUser.get('lastName').disable();
		this.formUser.get('nroDocument').disable();
		this.formUser.get('email').disable();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
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

	getCivilStatus() {
		this.newPartnerGeneralInfoService
			.getCivilstatus()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => (this.civilStateOpt = civilStatus))
			)
			.subscribe();
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

	editPersonalData() {
		if (this.formUser.valid) {
			const userData = {
				name: this.formUser.get('name').value,
				lastName: this.formUser.get('lastName').value,
				gender: String(this.formUser.value.gender),
				idNationality: this.formUser.value.idNationality,
				civilState: this.formUser.value.civilState,
				email: this.formUser.get('email').value,
				nroPhone: this.formUser.get('cellphone').value,
				birthdate: new Date(this.formUser.value.bornDate).toISOString(),
				idDocument: this.formUser.value.idDocument,
				nroDocument: this.formUser.get('nroDocument').value,
				idResidenceCountry: this.formUser.value.idResidenceCountry,
				districtAddress: this.formUser.value.districtAddress,
				address: this.formUser.value.address
			};

			console.log('Enviar', userData);
			const userName = this.userInfo.username;
			this.newPartnerService.modifyUser(userName, userData).subscribe({
				next: () => {
					const ref = this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'El usuario se edito.                   ',
							title: '¡Éxito!',
							icon: 'assets/icons/Inclub.png'
						}
					});
				},
				error: () => {
					this.dialogService.open(ModalAlertComponent, {
						header: '',
						data: {
							message: 'El usuario no se pudo editar.                     ',
							title: '¡Error!',
							icon: 'pi pi-times-circle'
						}
					});
				}
			});
		}
	}

	openPersonalDataModal() {
		this.showPersonalDataModal = true;
	}

	closePersonalDataModal() {
		this.showPersonalDataModal = false;
	}

	openAccountPersonalDataModal() {
		this.dialogRef = this.dialogService.open(AccountPersonalDataModalComponent, {
			//header: 'Datos Personales',
			closable: false,
			contentStyle: { overflow: 'auto' },
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw'
			},
			styleClass: 'custom-modal-css',
			templates: {
				footer: Footer
			}
		});
	}

	openAccountChangePasswordModal() {
		this.dialogRef = this.dialogService.open(AccountChangePasswordModalComponent, {
			// header: 'Cambiar Contraseña',
			width: '30%',
			modal: true,
			closable: false
		});
	}
	openAccountnDatosBancarios() {
		/* this.dialogService.open(ModalOpcionInhabilitadaComponent, {
			header: '',
			data: {
				icon: 'assets/wallet/warnning-icon.svg',
				title: "Esta funcionalidad se encuentra <br> temporalmente bloqueada.",
				message: `Por el momento no es posible acceder a esta<br> opción.
				 Estamos trabajando para restablecer <br> el servicio a la brevedad.
				  Agradecemos tu comprensión.`,
			}
		}); */

		return this.router.navigate(['/profile/ambassador/account/datos-bancarios']);
	}
	openAccountSocioModal() {
		this.dialogRef = this.dialogService.open(AccountSocioModalComponent, {
			// header: 'Datos del Socio',
			width: '30%',
			modal: true,
			closable: false
		});
	}

	openAccountImageSocioModal() {
		this.dialogRef = this.dialogService.open(AccountImageSocioModalComponent, {
			width: '30%',
			modal: true,
			closable: false,
			contentStyle: { overflow: 'auto' },
			breakpoints: {
				'960px': '75vw',
				'640px': '90vw'
			},
			styleClass: 'custom-modal-css'
		});
	}

	/*  get formPasswordInValid() {
	 const password = this.formPassword.get(
	   'newPassword'
	 ) as AbstractControl<string>;
	 const newPassword = this.formPassword.get(
	   'repeatPassword'
	 ) as AbstractControl<string>;
 
	 return this.formPassword.invalid || password.value !== newPassword.value;
   }
 
   get profileUrl() {
	 let photo = 'https://staticv1.inclub.site/images/flyer.png';
	 const control = this.formFlyer.get('profile') as AbstractControl<File>;
 
	 if (control.value) photo = URL.createObjectURL(control.value);
 
	 return `url('${photo}')`;
   }
 
   get flyerUrl() {
	 let photo = 'https://staticv1.inclub.site/images/flyer.png';
	 const control = this.formFlyer.get('flyer') as AbstractControl<File>;
 
	 if (control.value) photo = URL.createObjectURL(control.value);
 
	 return `url('${photo}')`;
   } */
}
