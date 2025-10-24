import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewPartnerGeneralInfoService } from '../../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { NewPartnerService } from '../../../../new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap, switchMap, of, catchError } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';
import { SkeletonModule } from 'primeng/skeleton';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { optGenderMock } from '../../../pages/account-bank-data-tab/commons/mocks/_mock';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { LocationService, OptionResponse } from 'src/app/shared/services/location.service';

@Component({
	selector: 'app-account-personal-data-modal',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		SkeletonModule,
		ReactiveFormsModule,
		SelectComponent,
		InputComponent,
		DateComponent
	],
	templateUrl: './account-personal-data-modal.component.html',
	styleUrl: './account-personal-data-modal.component.scss',
	providers: [DialogService]
})
export class AccountPersonalDataModalComponent {
	constructor(
		private formBuilder: FormBuilder,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private newPartnerService: NewPartnerService,
		private userInfoService: UserInfoService,
		public ref: DynamicDialogRef,
		private dialogService: DialogService,
		private locationService: LocationService
	) {
		this.userInfo = this.userInfoService.userInfo;
		this.formUser = formBuilder.group({
			name: ['', Validators.required, Validators.minLength(3)],
			lastName: ['', Validators.required, Validators.minLength(3)],
			cellphone: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			gender: ['', [Validators.required]],
			idNationality: ['', [Validators.required]],
			idResidenceCountry: [''],
			civilState: ['', [Validators.required]],
			bornDate: ['', [Validators.required]],
			idDocument: ['', Validators.required],
			nroDocument: ['', Validators.required],
			districtAddress: [''],
			address: ['', Validators.required],
			paisResidencia: [null],
			department: [null],
			province: [null],
			district: [null],
			id_location: [null]
		});
	}

	@Output() close = new EventEmitter<void>();

	isLoading: boolean = false;
	btnText: string;
	disableBtn: boolean = true;
	public userInfo: any;
	public formUser: FormGroup;
	private destroy$: Subject<void> = new Subject<void>();
	public nationalitiesList: any[] = [];
	public civilStateOpt: ISelect[];
	public documentTypes: ISelect[];
	public optGenders: ISelect[] = optGenderMock;
	public disabledUser: boolean = this.userInfoService.disabled;
	public paisResidenciaOptions: ISelect[] = [];
	public departmentOptions: ISelect[] = [];
	public provinceOptions: ISelect[] = [];
	public districtOptions: ISelect[] = [];
	private selectedCountryCode: string | null = null;
	private selectedRegionCode: string | null = null;
	private selectedProvinceCode: string | null = null;

	ngOnInit(): void {
		const loadingModalRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		this.btnText = 'Guardar';
		this.getNationalities();
		this.getCivilStatus();
		this.loadCountries();
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
					bornDate: value.birthdate ? new Date(value.birthdate) : null,
					districtAddress: value.districtAddress,
					id_location: value.idLocation ?? null
				});
				this.getDocumentType({ idCountry: value.idResidenceCountry });

				if (value.idLocation) {
					this.preloadLocationFromId(value.idLocation);
				}
				loadingModalRef.close();
				this.isLoading = false;
			}
		});
		console.log('DATOS USERINFO-modalnew', this.userInfo);
		this.formUser.get('name').disable();
		this.formUser.get('lastName').disable();
		this.formUser.get('idDocument').disable();
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
					console.log('document type', this.documentTypes);
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
				tap((paises) => {
					this.nationalitiesList = paises;
					const code = this.selectedCountryCode || this.findCountryCodeFromControl();
					if (code) {
						this.syncResidenceCountryFromCode(code);
					}
				})
			)
			.subscribe();
	}

	editPersonalData() {
		const loadingModalRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		if (this.formUser.valid) {
			const userData = {
				name: this.formUser.get('name').value.trim(),
				lastName: this.formUser.get('lastName').value.trim(),
				gender: String(this.formUser.value.gender),
				idNationality: this.formUser.value.idNationality,
				civilState: this.formUser.value.civilState,
				email: this.formUser.get('email').value.trim(),
				nroPhone: this.formUser.get('cellphone').value.trim(),
				id_location: this.formUser.value.id_location ?? null,
				birthdate: new Date(this.formUser.value.bornDate).toISOString(),
				idDocument: this.formUser.get('idDocument').value,
				nroDocument: this.formUser.get('nroDocument').value,
				idResidenceCountry: this.formUser.value.idResidenceCountry,
				districtAddress: this.formUser.value.districtAddress?.trim(),
				address: this.formUser.value.address.trim()
			};

			console.log('DATOS ENVIADOS DEL MODAL', userData);
			const userName = this.userInfo.username;

			if (this.userInfo.username != null) {
				this.newPartnerService.modifyUser(userName, userData).subscribe({
					next: () => {
						loadingModalRef.close();
						const ref = this.dialogService.open(ModalSuccessComponent, {
							header: '',
							//width: '20%',
							data: {
								text: 'El registro de sus datos personales se guardó exitosamente.',
								title: '¡Éxito!',
								icon: 'assets/icons/Inclub.png'
							}
						});
						this.ref.close(true);
					},
					error: () => {
						this.dialogService.open(ModalAlertComponent, {
							header: '',
							data: {
								message: 'El usuario no se pudo editar.',
								title: '¡Error!',
								icon: 'pi pi-times-circle'
							}
						});
					}
				});
			}
		}
	}

	closeModal() {
		this.close.emit();
	}

	// ===================== Ubigeo (cascada) =====================
	loadCountries() {
		this.locationService.getCountries().subscribe({
			next: (countries) => {
				this.paisResidenciaOptions = (countries || [])
					.filter((c) => (c?.value || '').toString().trim() !== '')
					.map((c) => this.mapOptionToSelect(c));
			},
			error: (err) => {
				console.error('Error cargando países de residencia', err);
				this.paisResidenciaOptions = [];
			}
		});
	}

	onCountryResidenceChange(item: any) {
		const code = (item?.value ?? '').toString();
		const label = (item?.content ?? '').toString();
		this.selectedCountryCode = code || null;

		// Sincronizar "Residencia" con el mismo país de "País-residencia"
		let matched: any | undefined = undefined;
		if (this.nationalitiesList && this.nationalitiesList.length > 0) {
			const upperCode = code?.toUpperCase?.() || '';
			const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
			const normLabel = normalize(label);
			matched = this.nationalitiesList.find((n: any) =>
				(n?.iso?.toUpperCase?.() === upperCode) ||
				(n?.iso2?.toUpperCase?.() === upperCode) ||
				(n?.code?.toUpperCase?.() === upperCode) ||
				(n?.alpha2?.toUpperCase?.() === upperCode) ||
				(n?.alpha2Code?.toUpperCase?.() === upperCode) ||
				(n?.countryCode?.toUpperCase?.() === upperCode) ||
				(normalize(n?.content) === normLabel) ||
				(normalize(n?.name) === normLabel) ||
				(normalize(n?.nicename) === normLabel)
			);

			if (matched?.value != null) {
				this.formUser.get('idResidenceCountry')?.setValue(matched.value);
			}
		}

		// Limpiar ciudad
		this.formUser.get('districtAddress')?.setValue('');

		// Limpiar niveles siguientes
		this.departmentOptions = [];
		this.provinceOptions = [];
		this.districtOptions = [];
		this.formUser.get('department')?.setValue(null);
		this.formUser.get('province')?.setValue(null);
		this.formUser.get('district')?.setValue(null);
		this.formUser.get('id_location')?.setValue(null);
		this.selectedRegionCode = null;
		this.selectedProvinceCode = null;

		if (!this.selectedCountryCode) return;

		// Cargar regiones por país
		this.locationService.getRegions(this.selectedCountryCode).subscribe({
			next: (regions) => {
				this.departmentOptions = (regions || []).map((r) => this.mapOptionToSelect(r));
			},
			error: (err) => {
				console.error('Error cargando regiones', err);
				this.departmentOptions = [];
			}
		});
	}

	onRegionChange(item: any) {
		const code = (item?.value ?? '').toString();
		this.selectedRegionCode = code || null;

		this.provinceOptions = [];
		this.districtOptions = [];
		this.formUser.get('province')?.setValue(null);
		this.formUser.get('district')?.setValue(null);
		this.formUser.get('id_location')?.setValue(null);
		this.formUser.get('districtAddress')?.setValue('');
		this.selectedProvinceCode = null;

		if (!this.selectedCountryCode || !this.selectedRegionCode) return;

		this.locationService.getProvinces(this.selectedCountryCode, this.selectedRegionCode).subscribe({
			next: (provinces) => {
				this.provinceOptions = (provinces || []).map((p) => this.mapOptionToSelect(p));
			},
			error: (err) => {
				console.error('Error cargando provincias', err);
				this.provinceOptions = [];
			}
		});
	}

	onProvinceChange(item: any) {
		const code = (item?.value ?? '').toString();
		this.selectedProvinceCode = code || null;

		this.districtOptions = [];
		this.formUser.get('district')?.setValue(null);
		this.formUser.get('id_location')?.setValue(null);
		this.formUser.get('districtAddress')?.setValue('');

		if (!this.selectedCountryCode || !this.selectedRegionCode || !this.selectedProvinceCode) return;

		this.locationService
			.getDistricts(this.selectedCountryCode, this.selectedRegionCode, this.selectedProvinceCode)
			.subscribe({
				next: (districts) => {
					this.districtOptions = (districts || []).map((d) => this.mapOptionToSelect(d));
				},
				error: (err) => {
					console.error('Error cargando distritos', err);
					this.districtOptions = [];
				}
			});
	}

	onDistrictChange(item: any) {
		const raw = item?.value;
		const districtId = raw !== null && raw !== undefined && raw !== '' ? Number(raw) : null;
		console.log('District world_locations.id seleccionado:', districtId);
		this.formUser.get('id_location')?.setValue(Number.isFinite(districtId as number) ? districtId : null);
		const label = (item?.content ?? '').toString();
		if (label) {
			this.formUser.get('districtAddress')?.setValue(label);
		}
	}

	private mapOptionToSelect(opt: OptionResponse): ISelect {
		return {
			value: (opt?.value as unknown) as number,
			content: opt?.label ?? ''
		} as ISelect;
	}

	// ===================== Precarga por id_location =====================
	private preloadLocationFromId(id: number): void {
		this.locationService.getLocationById(id).subscribe({
			next: (loc) => {
				if (!loc) return;

				// 1) País
				const setCountry = () => {
					if (!this.paisResidenciaOptions || this.paisResidenciaOptions.length === 0) return;
					const target = String(loc.countryName || '').toLowerCase();
					const found = this.paisResidenciaOptions.find((o) => String((o as any).content || '').toLowerCase() === target);
					if (found) {
						this.formUser.get('paisResidencia')?.setValue((found as any).value);
					}
					this.selectedCountryCode = loc.countryCode;
					this.syncResidenceCountryFromCode(loc.countryCode, loc.countryName);
				};

				if (!this.paisResidenciaOptions || this.paisResidenciaOptions.length === 0) {
					this.locationService.getCountries().subscribe((countries: OptionResponse[]) => {
						this.paisResidenciaOptions = (countries || [])
							.filter((c) => (c?.value || '').toString().trim() !== '')
							.map((c) => this.mapOptionToSelect(c));
						setCountry();
						this.loadRegionsProvincesDistrictsFromLoc(loc, id);
					});
				} else {
					setCountry();
					this.loadRegionsProvincesDistrictsFromLoc(loc, id);
				}
			},
			error: (err) => console.error('No se pudo obtener la ubicación por id_location', err)
		});
	}

	private loadRegionsProvincesDistrictsFromLoc(loc: any, id: number) {
		// 2) Regiones
		this.locationService.getRegions(loc.countryCode).subscribe({
			next: (regions: OptionResponse[]) => {
				this.departmentOptions = (regions || []).map((r) => this.mapOptionToSelect(r));
				const targetRegion = String(loc.regionName || '').toLowerCase();
				const foundRegion = this.departmentOptions.find((o) => String((o as any).content || '').toLowerCase() === targetRegion);
				if (foundRegion) {
					this.formUser.get('department')?.setValue((foundRegion as any).value);
					this.selectedRegionCode = (foundRegion.value as unknown as string) ?? loc.regionCode;
				}

				// 3) Provincias
				this.locationService.getProvinces(loc.countryCode, loc.regionCode).subscribe({
					next: (provinces: OptionResponse[]) => {
						this.provinceOptions = (provinces || []).map((p) => this.mapOptionToSelect(p));
						const targetProvince = String(loc.provinceName || '').toLowerCase();
						const foundProvince = this.provinceOptions.find((o) => String((o as any).content || '').toLowerCase() === targetProvince);
						if (foundProvince) {
							this.formUser.get('province')?.setValue((foundProvince as any).value);
							this.selectedProvinceCode = (foundProvince.value as unknown as string) ?? loc.provinceCode;
						}

						// 4) Distritos
						this.locationService.getDistricts(loc.countryCode, loc.regionCode, loc.provinceCode).subscribe({
							next: (districts: OptionResponse[]) => {
								this.districtOptions = (districts || []).map((d) => this.mapOptionToSelect(d));
								const targetDistrict = String(loc.districtName || '').toLowerCase();
								const foundDistrict = this.districtOptions.find(
									(o) => String((o as any).content || '').toLowerCase() === targetDistrict || Number((o as any).value) === Number(id)
								);
								if (foundDistrict) {
									this.formUser.get('district')?.setValue((foundDistrict as any).value);
									this.formUser.get('id_location')?.setValue(Number(id));
									this.formUser.get('districtAddress')?.setValue(loc.districtName || '');
								}
							},
							error: (err) => {
								console.error('Error cargando distritos', err);
								this.districtOptions = [];
							}
						});
					},
					error: (err) => {
						console.error('Error cargando provincias', err);
						this.provinceOptions = [];
					}
				});
			},
			error: (err) => {
				console.error('Error cargando regiones', err);
				this.departmentOptions = [];
			}
		});
	}

	private syncResidenceCountryFromCode(code: string, label?: string) {
		try {
			if (!this.nationalitiesList || this.nationalitiesList.length === 0) return;
			const upperCode = (code || '').toUpperCase();
			const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
			const normLabel = normalize(label || '');
			const matched = this.nationalitiesList.find((n: any) =>
				(n?.iso?.toUpperCase?.() === upperCode) ||
				(n?.iso2?.toUpperCase?.() === upperCode) ||
				(n?.code?.toUpperCase?.() === upperCode) ||
				(n?.alpha2?.toUpperCase?.() === upperCode) ||
				(n?.alpha2Code?.toUpperCase?.() === upperCode) ||
				(n?.countryCode?.toUpperCase?.() === upperCode) ||
				(normalize(n?.content) === normLabel) ||
				(normalize(n?.name) === normLabel) ||
				(normalize(n?.nicename) === normLabel)
			);
			if (matched?.value != null) {
				this.formUser.get('idResidenceCountry')?.setValue(matched.value);
			}
		} catch (e) {
			console.warn('No se pudo sincronizar idResidenceCountry desde código', e);
		}
	}

	private findCountryCodeFromControl(): string | null {
		try {
			const selectedValue = this.formUser.get('paisResidencia')?.value;
			if (selectedValue == null) return null;
			const opt: any = this.paisResidenciaOptions.find((o: any) => (o?.value as any) === selectedValue);
			if (!opt) return null;
			// Buscar el code ISO a partir del label seleccionado cruzando con nationalitiesList
			const label = (opt?.content || '').toString();
			const normalize = (s: string) => (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
			const normLabel = normalize(label);
			const match = (this.nationalitiesList || []).find((n: any) => normalize(n?.content) === normLabel || normalize(n?.name) === normLabel || normalize(n?.nicename) === normLabel);
			return (match?.iso || match?.iso2 || match?.code || match?.alpha2 || match?.alpha2Code || match?.countryCode || null) as string | null;
		} catch {
			return null;
		}
	}
}
