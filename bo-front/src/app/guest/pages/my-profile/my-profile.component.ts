import { Component, OnInit, inject } from '@angular/core';
import {
	FormBuilder,
	FormGroup,
	Validators,
	ReactiveFormsModule,
	AbstractControl,
	ValidationErrors
} from '@angular/forms';
import { PagesCard } from '../../commons/constants/pages-card';
import { Pages } from '../../commons/enums/guest.enum';
import { PanelsComponent } from '../../commons/components/panels/panels.component';
import { ProfileService } from '../../commons/services/profile.service';
import { DocumentTypeData, Profile } from '../../commons/interfaces/guest-components.interface';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { finalize } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { PublicAuthService } from 'src/app/init-app/pages/public-access/auth/services/public-auth.service';
import { LogoSpinnerComponent } from "@shared/logo-spinner/logo-spinner.component";
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { DocumentTypesService } from '../../commons/services/document-types.service';

@Component({
	selector: 'guest-my-profile',
	standalone: true,
	imports: [PanelsComponent, ReactiveFormsModule, CommonModule, LogoSpinnerComponent, ModalNotifyComponent],
	templateUrl: './my-profile.component.html',
	styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {
	myProfile = PagesCard[Pages.MY_PROFILE];
	profileForm: FormGroup;
	isLoading = false;
	currentProfile?: Profile;
	documentsTypesData?: DocumentTypeData[];
	isLoadingCntr = false;
	isSubmitting = false;
	showModal = false;
	modalTitle = '';
	modalMessage = '';

	private fb = inject(FormBuilder);
	private newPartnerService = inject(NewPartnerService);
	private profileService = inject(ProfileService);
	private documentType = inject(DocumentTypesService);
	private publicAuth = inject(PublicAuthService)
	public nationalitiesList: ISelect[] = [];
	private originalProfileData!: { [key: string]: any };

	guestId = this.publicAuth.getGuestId();

	constructor() {
		this.profileForm = this.fb.group({
			sponsor: [''],
			username: [''],
			firstName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
			lastName: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
			email: ['', [Validators.required, this.emailDomainValidator]],
			nationality: [''],
			country: [''],
			district: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)]],
			gender: [''],
			birthDate: [''],
			address: [''],
			phone: ['', [Validators.pattern(/^\d{9}$/)]],
			docType: ['dni'],
			docNumber: ['', [Validators.pattern(/^[0-9]+$/)]],
			promotions: [false]
		});

		this.profileForm.get('sponsor')?.disable();
		this.profileForm.get('username')?.disable();
	}

	ngOnInit() {
		this.loadData();
	}

	private emailDomainValidator(control: AbstractControl): ValidationErrors | null {
		const email = (control.value || '').toString().trim().toLowerCase();

		if (!email) return null;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return { email: true };
		}

		const validDomains = ['@gmail.com', '@hotmail.com'];
		const hasValidDomain = validDomains.some((domain) => email.endsWith(domain));
		return hasValidDomain ? null : { invalidDomain: true };
	}

	/**
	 * Carga países y perfil de forma sincronizada
	 */
	loadData() {
		this.isLoading = true;

		forkJoin({
			countries: this.newPartnerService.getCountriesList(),
			profile: this.profileService.getProfileData(this.guestId as number),
			documents: this.documentType.getDocumentType()
		})
			.pipe(finalize(() => (this.isLoading = false)))
			.subscribe({
				next: ({ countries, profile, documents }) => {
					this.nationalitiesList = countries;
					this.currentProfile = profile;
					this.documentsTypesData = documents; 

					const snapshot = {
						sponsor: profile.sponsor || '',
						username: profile.username || '',
						firstName: profile.firstName || '',
						lastName: profile.lastName || '',
						email: (profile.email || '').trim().toLowerCase(),
						nationality: profile.nationality ? profile.nationality : '',
						country: profile.country ? profile.country : '',
						district: profile.district || '',
						gender: profile.gender || '',
						birthDate: profile.birthDate || '',
						address: profile.address || '',
						phone: profile.phone || '',
						docType: profile.documentTypeId,
						docNumber: profile.documentNumber || '',
						promotions: profile.promotions || false
					};

					this.originalProfileData = snapshot;
					this.profileForm.reset(snapshot);

				},
				error: (error) => {
					console.error('Error cargando datos:', error);
				}
			});
	}

	onNationalityChange(event: Event): void {
		const target = event.target as HTMLSelectElement;
		const selectedValue = target.value;
		const selectedCountry = this.nationalitiesList.find((country) => country.content === selectedValue);
	}

	onlyLetters(event: KeyboardEvent) {
		const char = event.key;
		const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]$/;
		if (!regex.test(char)) {
			event.preventDefault();
		}
	}

	onlyNumbers(event: KeyboardEvent) {
		if (!/^\d$/.test(event.key)) {
			event.preventDefault();
		}
	}

	limitLength(event: Event, maxLength: number) {
		const input = event.target as HTMLInputElement;
		if (input.value.length >= maxLength) {
			input.value = input.value.slice(0, maxLength);
		}
	}

	cancelChanges() {
		if (!this.originalProfileData) return;
		this.profileForm.reset(this.originalProfileData);
		this.profileForm.markAsPristine();
		this.profileForm.markAsUntouched();
		this.profileForm.updateValueAndValidity({ emitEvent: false });
	}

	onSubmit() {
		const emailCtrl = this.profileForm.get('email');
		if (emailCtrl) {
			const normalized = (emailCtrl.value || '').toString().trim().toLowerCase();
			if (emailCtrl.value !== normalized) {
				emailCtrl.setValue(normalized, { emitEvent: false });
			}
			emailCtrl.updateValueAndValidity({ emitEvent: false });
		}

		this.profileForm.markAllAsTouched();
		const formData = this.profileForm.getRawValue();

		const profileData: Profile = {
			sponsor: formData.sponsor,
			username: formData.username,
			firstName: formData.firstName,
			lastName: formData.lastName,
			email: formData.email,
			nationality: formData.nationality,
			country: formData.country,
			district: formData.district,
			gender: formData.gender,
			documentTypeId: formData.docType,
			documentNumber: formData.docNumber,
			phone: formData.phone,
			birthDate: formData.birthDate,
			address: formData.address,
			promotions: formData.promotions
		};

		this.isSubmitting = true;

		this.profileService.updateProfile(profileData, this.guestId as number).pipe(finalize(() => this.isSubmitting = false)).subscribe({
			next: (response) => {
				this.originalProfileData = { ...this.profileForm.getRawValue() };
				this.profileForm.markAsPristine();
				this.profileForm.markAsUntouched();
				this.isSubmitting = false;
				this.modalTitle = 'Perfil Actualizado';
				this.modalMessage = 'Tu perfil fue actualizado exitosamente.';
				this.showModal = true;
			},
			error: () => {
				this.isSubmitting = false;
				this.modalTitle = 'Error';
				this.modalMessage = 'Ocurrió un error al actualizar tu perfil.';
				this.showModal = true;
			}
		});
	}
	
	private markFormGroupTouched() {
		Object.keys(this.profileForm.controls).forEach((key) => {
			const control = this.profileForm.get(key);
			if (control) {
				control.markAsTouched();
			}
		});
	}

	onCloseModal(): void {
		this.showModal = false;
	}

	get f() {
		return this.profileForm.controls;
	}
}