import { ChangeDetectorRef, Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import type {
	ICivilStatus,
	ICountry,
	IDocumentType,
	IRequestFixData,
	IRequestFixDataForm,
	IRequestFixDataService
} from '@interfaces/users.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '@app/core/services/toast.service';
import { ISelectOpt } from '@interfaces/form-control.interface';
import { UserService } from '@app/users/services/user.service';
import { LocationService, WorldLocation } from '@app/shared/services/location.service';

@Component({
	selector: 'app-fix-data-modal',
	templateUrl: './fix-data-modal.component.html',
	styleUrls: ['./fix-data-modal.component.scss']
})
export class FixDataModalComponent implements OnInit, OnChanges {
	@Input() id: string = '';

	form: FormGroup;
	title: string = 'Editar Datos del Usuario';
	changes: string[] = [];

	genderOpt: ISelectOpt[] = [
		{
			id: '1',
			text: 'Masculino'
		},
		{
			id: '2',
			text: 'Femenino'
		}
	];
	docTypeOpt: ISelectOpt[] = [];
	countryOpt: ISelectOpt[] = [];
	civilOpt: ISelectOpt[] = [];
	paisResidenciaOpt: ISelectOpt[] = [];
	estadoDepartamentoOpt: ISelectOpt[] = [];
	provinciaOpt: ISelectOpt[] = [];
	distritoOpt: ISelectOpt[] = [];

	selectedCountryCode: string = '';
	selectedRegionCode: string = '';
	selectedProvinceCode: string = '';
	selectedDistrictId: string = '';
	selectedDistrictLabel: string = '';

	private countriesLoaded = false;
	private locationPrefilled = false;

	@Input() tableData: IRequestFixData | null = null;
	@Input() allData: IRequestFixDataService | null = null;
	@Input() countries: ICountry[] | null = null;
	@Input() civilStatus: ICivilStatus[] | null = null;
	@Input() documents: IDocumentType[] | null = null;

	constructor(
		public toastService: ToastService,
		public instanceModal: NgbActiveModal,
		public formBuilder: FormBuilder,
		private cdr: ChangeDetectorRef,
		private userService: UserService,
		private locationService: LocationService
	) {
		this.form = formBuilder.group({
			fullname: ['', Validators.required],
			lastname: ['', Validators.required],
			gender: ['0'],
			nationality: ['0'],
			civilState: ['0'],
			email: ['', Validators.email],
			phone: ['', Validators.minLength(4)],
			bornDate: [''],
			docType: ['0'],
			docNumber: ['', Validators.required],
			country: ['0'],
			state: ['0'],
			address: ['', Validators.required],
			paisResidencia: [''],
			estadoDepartamento: [''],
			provincia: [''],
			distrito: ['']
		});
	}

	ngOnInit(): void {
		console.log("los documentos en ngOnInit ", this.documents);

		this.locationService.getCountries().subscribe({
			next: (options) => {
				this.paisResidenciaOpt = options.map(opt => ({ id: opt.value, text: opt.label }));
				this.cdr.detectChanges();
				this.mapOptions();
				this.setValues();
				this.countriesLoaded = true;
				this.maybePreFillFromLocation();
			},
			error: (err) => {
				console.error('Error loading countries:', err);
				this.mapOptions();
				this.setValues();
				this.countriesLoaded = true;
				this.maybePreFillFromLocation();
			}
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['allData'] && this.allData) {
			this.setValues();
			this.maybePreFillFromLocation();
		}
	}

	onResetChanges() {
		this.setValues();
	}

	onSaveChanges() {
		if (this.form.valid) {
			const selectedDistrictId = this.selectedDistrictId && this.selectedDistrictId.trim() !== ''
				? this.selectedDistrictId
				: (this.allData?.id_location ? String(this.allData.id_location) : '');

			const idlocation = selectedDistrictId ? Number((selectedDistrictId.includes(':') ? selectedDistrictId.split(':').pop() : selectedDistrictId)?.trim()) : undefined;

			const userData: any = {
				name: this.form.value.fullname.trim(),
				lastName: this.form.value.lastname.trim(),
				gender: this.form.value.gender,
				idNationality: this.form.value.nationality,
				civilState: this.form.value.civilState,
				email: this.form.value.email,
				nroPhone: this.form.value.phone,
				birthdate: new Date(this.form.value.bornDate).toISOString(),
				idDocument: this.form.value.docType,
				nroDocument: this.form.value.docNumber.trim(),
				idResidenceCountry: this.form.value.country ?? null,
				districtAddress: ((): string | null => {
					const regionId = this.form.value.estadoDepartamento;
					const regionLabel = this.estadoDepartamentoOpt.find(o => o.id === regionId)?.text;
					return regionLabel ?? null;
				})(),
				address: this.form.value.address
			};

					if (idlocation !== undefined && !Number.isNaN(idlocation)) {
						userData.id_location = idlocation;
					}
			const userName = this.allData?.userName ?? '';
			this.userService.modifyUser(userName, userData).subscribe(
				(response) => {
					this.toastService.addToast('El socio se editó con éxito!', 'success');
					this.instanceModal.close();
				},
				(error) => {
					console.error('Error modificando usuario:', error);
					this.toastService.addToast('Error al modificar el socio', 'error');
				}
			);
		} else {
			console.error('Formulario inválido');
		}
	}

	setValues() {
		if (this.allData) {
			let birthdate = new Date(this.allData.birthdate);
			birthdate.setDate(birthdate.getDate() + 1);
			const birthdateCorrected = birthdate.toISOString().split('T')[0];
			this.form.patchValue({
				fullname: this.allData.name,
				lastname: this.allData.lastName,
				gender: this.allData.gender.toString(),
				nationality: this.allData.idNationality.toString(),
				civilState: this.allData.civilState.toString(),
				email: this.allData.email,
				phone: this.allData.nroPhone,
				bornDate: birthdateCorrected,
				docType: this.allData.idDocument.toString(),
				docNumber: this.allData.nroDocument,
				country: this.allData.idResidenceCountry.toString(),
				state: this.allData.districtAddress.toString(),
				address: this.allData.address
			});

			Object.keys(this.form.controls).forEach((key) => {
				this.form.get(key)?.markAsTouched();
			});
			this.cdr.detectChanges();
		} else {
			console.error('No hay datos en allData para setear los valores.');
		}
	}

	private maybePreFillFromLocation() {
		if (this.locationPrefilled) return;
		if (!this.countriesLoaded) return;
		if (!this.allData?.id_location) return;
		this.locationPrefilled = true;
		this.loadByLocationId(this.allData.id_location);
	}

	mapOptions() {
		if (this.countries) {
			this.countryOpt = this.countries.map((country) => ({
				id: country.idCountry.toString(),
				text: country.countrydesc
			}));
		}

		if (this.civilStatus) {
			this.civilOpt = this.civilStatus.map((status) => ({
				id: status.idCivilStatus.toString(),
				text: status.description
			}));
		}

		console.log("documents en el fix data modal: " + this.documents);

		if (this.documents) {
			this.docTypeOpt = this.documents.map((doc) => ({
				id: doc.idDocumentType.toString(),
				text: doc.name
			}));
		}

		console.log('Opciones mapeadas: ', { countryOpt: this.countryOpt, civilOpt: this.civilOpt, docTypeOpt: this.docTypeOpt });
	}

	onCountryResidenciaChange(value: string) {
		console.log('Country selected:', value);
		const countryCode = value.includes(':') ? value.split(':')[1].trim() : value;
		this.selectedCountryCode = countryCode;
		this.selectedRegionCode = '';
		this.selectedProvinceCode = '';
		this.selectedDistrictId = '';
		this.estadoDepartamentoOpt = [];
		this.provinciaOpt = [];
		this.distritoOpt = [];
		this.form.patchValue({ estadoDepartamento: null, provincia: null, distrito: null });

		const matchCountry = this.countries?.find(c => c.iso === countryCode) || null;
		this.form.patchValue({ country: matchCountry ? String(matchCountry.idCountry) : null });

		if (countryCode && countryCode !== '0') {
			this.locationService.getRegions(countryCode).subscribe({
				next: options => {
					console.log('Regions loaded:', options);
					this.estadoDepartamentoOpt = options.map(opt => ({ id: opt.value, text: opt.label }));
					this.cdr.detectChanges();
				},
				error: err => {
					console.error('Error loading regions:', err);
				}
			});
		}
	}

	onRegionChange(value: string) {
		console.log('Region selected:', value);
		const regionCode = value.includes(':') ? value.split(':')[1].trim() : value;
		console.log('Extracted region code:', regionCode);
		this.selectedRegionCode = regionCode;
		this.selectedProvinceCode = '';
		this.selectedDistrictId = '';
		this.provinciaOpt = [];
		this.distritoOpt = [];
		this.form.patchValue({ provincia: null, distrito: null });

		if (regionCode && regionCode !== '0' && this.selectedCountryCode) {
			this.locationService.getProvinces(this.selectedCountryCode, regionCode).subscribe({
				next: options => {
					console.log('Provinces loaded:', options);
					this.provinciaOpt = options.map(opt => ({ id: opt.value, text: opt.label }));
					this.cdr.detectChanges();
				},
				error: err => {
					console.error('Error loading provinces:', err);
				}
			});
		}
	}

	onProvinceChange(value: string) {
		console.log('Province selected:', value);
		const provinceCode = value.includes(':') ? value.split(':')[1].trim() : value;
		console.log('Extracted province code:', provinceCode);
		this.selectedProvinceCode = provinceCode;
		this.selectedDistrictId = '';
		this.distritoOpt = [];
		this.form.patchValue({ distrito: null });

		if (provinceCode && provinceCode !== '0' && this.selectedCountryCode && this.selectedRegionCode) {
			this.locationService.getDistricts(this.selectedCountryCode, this.selectedRegionCode, provinceCode).subscribe({
				next: options => {
					console.log('Districts loaded:', options);
					this.distritoOpt = options.map(opt => ({ id: opt.value, text: opt.label }));
					this.cdr.detectChanges();
				},
				error: err => {
					console.error('Error loading districts:', err);
				}
			});
		}
	}

	onDistrictChange(value: string) {
		console.log('District selected:', value);
		this.selectedDistrictId = (value && value.includes(':')) ? value.split(':').pop()?.trim() || '' : value;
		this.selectedDistrictLabel = this.distritoOpt.find(opt => opt.id === value)?.text || '';
	}

	private loadByLocationId(id: number) {
		this.locationService.getLocationById(id).subscribe({
			next: (location) => {
				if (!location) return;
				console.log('Location loaded:', location);
				this.selectedCountryCode = location.countryCode;
				this.selectedRegionCode = location.regionCode;
				this.selectedProvinceCode = location.provinceCode;
				this.selectedDistrictId = location.id.toString();

				const matchCountry = this.paisResidenciaOpt.find(opt => opt.id === location.countryCode || opt.id.endsWith(`: ${location.countryCode}`));
				if (matchCountry) {
					this.form.patchValue({ paisResidencia: matchCountry.id });
				}

				const matchCountryObj = this.countries?.find(c => c.iso === location.countryCode) || null;
				this.form.patchValue({ country: matchCountryObj ? String(matchCountryObj.idCountry) : null });

				this.locationService.getRegions(location.countryCode).subscribe({
					next: (regions) => {
						this.estadoDepartamentoOpt = regions.map(opt => ({ id: opt.value, text: opt.label }));
						const regionMatch = regions.find(r => r.value === location.regionCode);
						this.form.patchValue({ estadoDepartamento: regionMatch ? regionMatch.value : location.regionCode });

						this.locationService.getProvinces(location.countryCode, location.regionCode).subscribe({
							next: (provinces) => {
								this.provinciaOpt = provinces.map(opt => ({ id: opt.value, text: opt.label }));
								const provinceMatch = provinces.find(p => p.value === location.provinceCode);
								this.form.patchValue({ provincia: provinceMatch ? provinceMatch.value : location.provinceCode });

								this.locationService.getDistricts(location.countryCode, location.regionCode, location.provinceCode).subscribe({
									next: (districts) => {
										this.distritoOpt = districts.map(opt => ({ id: opt.value, text: opt.label }));
										const districtMatch = districts.find(d => d.value === location.id.toString() || d.label === location.districtName);
										this.form.patchValue({ distrito: districtMatch ? districtMatch.value : location.id.toString() });
										this.cdr.detectChanges();
									},
									error: (err) => console.error('Error loading districts:', err)
								});
							},
							error: (err) => console.error('Error loading provinces:', err)
						});
					},
					error: (err) => console.error('Error loading regions:', err)
				});
			},
			error: (err) => console.error('Error loading location by ID:', err)
		});
	}
}
