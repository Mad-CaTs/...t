import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { INewPartnerStep2Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { PhoneComponent } from '@shared/components/form-control/phone/phone.component';
import { ModalLocationComponent } from './commons/modals/modal-location/modal-location.component';
import { CellFieldComponent } from '@shared/components/form-control/cell-field/cell-field.component';
import { INewUserPromotorData, Nationality } from '../../commons/interfaces/new-partner.interface';
import { ISelect } from '@shared/interfaces/forms-control';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { LocationService, OptionResponse } from 'src/app/shared/services/location.service';
import { filter, switchMap, tap } from 'rxjs';
import { NewPartnerSelectPackageService } from '../new-partner-select-package/commons/service/new-partner-select-package.service';
import { CountryType } from '../new-partner-payment/commons/enums';
import { NationalityStateService } from '../../commons/services/nationality-state.service';

@Component({
	selector: 'app-new-partner-contact-info-component',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, MatIconModule, InputComponent, SelectComponent],
	templateUrl: './new-partner-contact-info.component.html',
	styleUrls: []
})
export class NewPartnerContactInfoComponent {
	public iconName: string;
	public phonecodeCountry: string;
	public nationalitiesList: Nationality[] = [];
	public paisResidenciaOptions: ISelect[] = [];
	public departmentOptions: ISelect[] = [];
	public provinceOptions: ISelect[] = [];
	public districtOptions: ISelect[] = [];
	private selectedCountryCode: string | null = null;
	private selectedRegionCode: string | null = null;
	private selectedProvinceCode: string | null = null;
	// ======================================================================

	@Input() preloadedData: INewPartnerStep2Data | undefined = undefined;
	@Input() registerTypeControl = new FormControl(1);
	@Input() isPromotor: boolean;

	@Output() submit = new EventEmitter<INewPartnerStep2Data>();
	@Output() prevState = new EventEmitter();
	@Output() onCheckEmailExists = new EventEmitter<boolean>();
	@Output() saveNewUserPromotor = new EventEmitter<INewUserPromotorData>();
	@Output() onChangeResidency = new EventEmitter<string>();
	@Output() familyPackagesChanged = new EventEmitter<any[]>();

	@Input() set optNationalities(optNationalities: Nationality[]) {
		if (optNationalities) {
			this.nationalitiesList = optNationalities;
			const { country } = this.form.value;
			if (country) {
				this.setPhonePrefix(country);
			}
		}
	}

	@Input() form: FormGroup;
	public disabledUser: boolean = this.userInfo.disabled;

	constructor(
		private modal: NgbModal,
		public userInfo: UserInfoService,
		private locationService: LocationService,
		private packageService: NewPartnerSelectPackageService,
		private nationalityState: NationalityStateService
	) {}

	ngOnInit(): void {
		this.ensureLocationControls();

		// 1) Poblar País-residencia
		this.locationService.getCountries().subscribe({
			next: (countries) => {
				// Filtrar entradas vacías y mapeo
				this.paisResidenciaOptions = (countries || [])
					.filter((c) => (c?.value || '').toString().trim() !== '')
					.map((c) => this.mapOptionToSelect(c));
			},
			error: (err) => {
				console.error('Error cargando países de residencia', err);
				this.paisResidenciaOptions = [];
			}
		});

		this.listeningResidency();
	}

	onFocusLocation() {
		const tmp = document.createElement('input');

		document.body.appendChild(tmp);

		tmp.focus();

		document.body.removeChild(tmp);

		setTimeout(() => this.onOpenLocation(), 60);
	}

	onOpenLocation() {
		const ref = this.modal.open(ModalLocationComponent, { centered: true });
		const modal = ref.componentInstance as ModalLocationComponent;

		modal.form = this.form;
	}

	listeningResidency() {
		this.form
			.get('paisResidencia')
			.valueChanges.pipe(
				tap((idResidency: string) => {
					if (idResidency) {
						this.onChangeResidency.emit(idResidency);
						const isPeru = idResidency === 'PE' ? CountryType.PERU : null
						this.nationalityState.setResidence(isPeru);
					}
				})
			)
			.subscribe({
				error: (err) => {
					console.error('Error:', err);
				}
			});
	}

	onSubmit() {
		this.submit.emit();
	}

	onRegister() {
		this.saveNewUserPromotor.emit();
	}

	get isMultiUser() {
		const val = this.registerTypeControl.value;

		return val === 2;
	}

	onChangContry(event: any) {
		if (!event || !event.value) {
			this.iconName = '';
			this.phonecodeCountry = '';
			return;
		}
		this.setPhonePrefix(event.value);
	}

	setPhonePrefix(country: number) {
		const selectedContry = this.nationalitiesList.find((c) => c.value === country);
		this.iconName = selectedContry.icon;
		this.phonecodeCountry = selectedContry.phonecode;
	}

	// ===================== Ubigeo (cascada) =====================
	onCountryResidenceChange(item: any) {
		const code = (item?.value ?? '').toString();
		const label = (item?.content ?? '').toString();
		this.selectedCountryCode = code || null;

		// Sincronizar "Residencia" con el mismo país de "País-residencia" para mapear el código telefónico
		// Intentamos encontrar el país en nationalitiesList por diferentes llaves (iso, iso2, code) o por el label (content/name),
		// usando comparación case-insensitive y sin tildes para evitar desajustes (Perú vs Peru)
		let matched: any | undefined = undefined;
		if (this.nationalitiesList && this.nationalitiesList.length > 0) {
			const upperCode = code?.toUpperCase?.() || '';
			const normalize = (s: string) =>
				(s || '')
					.toString()
					.normalize('NFD')
					.replace(/[\u0300-\u036f]/g, '')
					.toLowerCase()
					.trim();
			const normLabel = normalize(label);
			matched = this.nationalitiesList.find(
				(n: any) =>
					n?.iso?.toUpperCase?.() === upperCode ||
					n?.iso2?.toUpperCase?.() === upperCode ||
					n?.code?.toUpperCase?.() === upperCode ||
					n?.alpha2?.toUpperCase?.() === upperCode ||
					n?.alpha2Code?.toUpperCase?.() === upperCode ||
					n?.countryCode?.toUpperCase?.() === upperCode ||
					normalize(n?.content) === normLabel ||
					normalize(n?.name) === normLabel
			);

			if (matched?.value != null) {
				this.form.get('country')?.setValue(matched.value);
				this.setPhonePrefix(matched.value);
			}
		}

		// Al ocultar ciudad, la limpiamos
		this.form.get('city')?.setValue('');

		// Limpiar niveles siguientes
		this.departmentOptions = [];
		this.provinceOptions = [];
		this.districtOptions = [];
		this.form.get('department')?.setValue(null);
		this.form.get('province')?.setValue(null);
		this.form.get('district')?.setValue(null);
		this.form.get('id_location')?.setValue(null);
		this.selectedRegionCode = null;
		this.selectedProvinceCode = null;

		if (!this.selectedCountryCode) return;

		// 2) Cargar regiones por país
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
		this.form.get('province')?.setValue(null);
		this.form.get('district')?.setValue(null);
		this.form.get('id_location')?.setValue(null);
		this.selectedProvinceCode = null;

		if (!this.selectedCountryCode || !this.selectedRegionCode) return;

		// 3) Cargar provincias por región
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
		this.form.get('district')?.setValue(null);
		this.form.get('id_location')?.setValue(null);

		if (!this.selectedCountryCode || !this.selectedRegionCode || !this.selectedProvinceCode) return;

		// 4) Cargar distritos por provincia
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
		this.form.get('id_location')?.setValue(Number.isFinite(districtId as number) ? districtId : null);
	}

	private mapOptionToSelect(opt: OptionResponse): ISelect {
		return {
			value: opt?.value as unknown as number,
			content: opt?.label ?? ''
		} as ISelect;
	}

	private ensureLocationControls(): void {
		const controls = ['paisResidencia', 'department', 'province', 'district', 'id_location'];
		controls.forEach((name) => {
			if (!this.form.get(name)) {
				this.form.addControl(name, new FormControl(null));
			}
		});
	}

	checkEmailExists(): void {
		const emailControl = this.form.get('email');
		if (emailControl) {
			emailControl.markAsTouched();
			emailControl.updateValueAndValidity();

			if (emailControl.valid) {
				this.onCheckEmailExists.emit();
			}
		}
	}

	onPrevState(): void {
		this.prevState.emit();
	}
}
