import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { DialogService } from 'primeng/dynamicdialog';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil, tap } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { optFirmaMock } from 'src/app/profiles/pages/ambassador/pages/account/pages/account-bank-data-tab/commons/mocks/_mock';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { LegalizationService } from '../../../../../../../../my-legalization/commons/services/legalization.service';
import { PopupModalComponent } from 'src/app/profiles/commons/components/popup-modal/popup-modal.component';
import { LegalizationValidateService } from './commons/services/legalization-validate.service';
import { openImageAlert } from '../../utils';
import { MOCK_SERPOST_BRANCHES } from './commons/mocks/serpost-branches.mock';
import { SerpostOptionComponent } from './commons/components/serpost-option/serpost-option.component';
import { GeoLocationService } from '@shared/services/geo-location/geo-location.service';
import { SucursalesMapComponent } from '@shared/components/sucursales-map/sucursales-map.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import { IFormDataChange } from '../../interfaces';
import { LogoSpinnerComponent } from '@shared/logo-spinner/logo-spinner.component';

@Component({
	selector: 'app-validate-personal-data',
	standalone: true,
	imports: [
		CommonModule,
		InputComponent,
		SelectComponent,
		DateComponent,
		ReactiveFormsModule,
		RadiosComponent,
		PopupModalComponent,
		SerpostOptionComponent,
		SucursalesMapComponent,
		LoaderComponent,
	],
	templateUrl: './validate-personal-data.component.html',
	styleUrl: './validate-personal-data.component.scss'
})
export default class ValidatePersonalDataComponent {
	public userInfo: any;
	isLoading: boolean = false;
	private destroy$: Subject<void> = new Subject<void>();
	@Input() nationalitiesList: any[] = [];
	public civilStateOpt: ISelect[];
	public documentTypes: ISelect[];
	@Input() optTypeLegalization: ISelect[] = [];
	public optFirma: ISelect[] = optFirmaMock;
	@Input() legalizationDocList: ISelect[];
	public optList: ISelect[] = [];
	@Output() formValidityChanged = new EventEmitter<boolean>();
	documentosValidados = false;
	@Output() formDataChanged = new EventEmitter<any>();
	@ViewChild('welcomeModal') welcomeModal!: PopupModalComponent;
	public legalizationMethodOptions: ISelect[] = [];
	@Input() payTypeSelected: number;
	@Input() sucursalesCercanas = [];
	optListSucursales: ISelect[] = [];
	@Input() formUser: FormGroup;
	private fixedFields = { name: '', lastName: '' };
	coords: { lat: number; lon: number } | null = null;
	noResultsMessage: string = '';
	errorMessage: string = '';
	sucursalSeleccionada: any = null;
	@Output() selectedBranchChange = new EventEmitter<any>();
	@Output() sucursalesCercanasChange = new EventEmitter<any[]>();
	@Output() loadingSucursalesChange = new EventEmitter<boolean>();
	@Input() selectedProduct: any;
	public ultimaDireccionBuscada: string = '';
	@Input() showLoader: boolean = false;

	constructor(
		private newPartnerService: NewPartnerService,
		private userInfoService: UserInfoService,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private formBuilder: FormBuilder,
		private legalizationService: LegalizationService,
		private cdr: ChangeDetectorRef,
		private dialogService: DialogService,
		private legalizationValidateService: LegalizationValidateService,
		private geoLocationService: GeoLocationService
	) {
		this.userInfo = this.userInfoService.userInfo;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['nationalitiesList'] && changes['nationalitiesList'].currentValue?.length) {
		}
	}

	ngOnInit(): void {
		this.getInitData();
	}

	public getInitData() {
		this.subscribeToFormUserChanges();
		this.handleLegalizationMethodValidation();
		this.getLegalizationMethods();
		this.getAvailabilityOptions();
		this.subscribeToFormStatus();
		this.restoreOrLoadUserData();
	}

	private subscribeToFormUserChanges(): void {
		if (this.formUser) {
			const controls = ['districtAddress', 'province', 'department'];

			controls.forEach((ctrlName) => {
				this.formUser
					.get(ctrlName)
					?.valueChanges.pipe(debounceTime(500))
					.subscribe(() => {
						const districtCtrl = this.formUser.get('districtAddress');
						const provinceCtrl = this.formUser.get('province');
						const addressCtrl = this.formUser.get('department');

						if (districtCtrl?.valid && provinceCtrl?.valid && addressCtrl?.valid) {
							this.buscarSucursales();
						}
					});
			});
		}
	}

	async buscarSucursales() {
		this.isLoading = true;
		this.loadingSucursalesChange.emit(true);
		this.cdr.detectChanges();
		this.errorMessage = '';
		this.noResultsMessage = '';
		const { districtAddress, province, department } = this.formUser.value;
		const fullAddress = `${department}, ${districtAddress}, ${province}, Perú`;

		if (fullAddress === this.ultimaDireccionBuscada) {
			this.isLoading = false;
			this.loadingSucursalesChange.emit(false);
			return;
		}

		this.ultimaDireccionBuscada = fullAddress;
		try {
			const coords = await this.geoLocationService.getCoordinates(fullAddress);

			if (!coords) {
				console.warn('⚠️ No se pudo encontrar la ubicación.');
				this.noResultsMessage = 'No se encontró la ubicación especificada.';
				this.sucursalesCercanas = [];
				this.sucursalesCercanasChange.emit(this.sucursalesCercanas);
				this.loadingSucursalesChange.emit(false);
				return;
			}

			this.coords = coords;
			const sucursales = await this.geoLocationService.getNearbySucursales(coords.lat, coords.lon);
			const sucursalesConCoords = (sucursales || []).filter((s) => s.lat && s.lon);
			if (sucursalesConCoords.length > 0) {
				this.sucursalesCercanas = sucursalesConCoords;
			} else {
				this.sucursalesCercanas = [];
				this.noResultsMessage =
					'No se encontraron sucursales cercanas. Se usará la dirección ingresada para el envío de su legalización.';
			}
			this.sucursalesCercanasChange.emit(this.sucursalesCercanas);
		} catch (error) {
			console.error('Error buscando sucursales:', error);
			this.sucursalesCercanas = [];
			this.sucursalesCercanasChange.emit(this.sucursalesCercanas);
		} finally {
			this.isLoading = false;
			this.loadingSucursalesChange.emit(false);
		}
	}

	onMarkerClick(marker: any) {
		this.sucursalSeleccionada = marker;
		this.selectedBranchChange.emit(this.sucursalSeleccionada);
	}

	private subscribeToFormStatus(): void {
		this.formUser.statusChanges.subscribe(() => {
			const isValid = this.formUser.valid;
			this.formValidityChanged.emit(isValid);

			const formValue = this.formUser.getRawValue();

			const residencia = this.nationalitiesList.find(
				(pais) => pais.idCountry === formValue.idResidenceCountry
			);

			console.log('🌍 residencia encontrada:', residencia);

			const emitData = isValid
				? {
						value: {
							...formValue,
							idResidenceCountry: residencia
								? { value: residencia.idCountry, content: residencia.name } // 👈 aquí emitimos value + content
								: null
						},
						valid: true,
						sucursalSeleccionada: this.sucursalSeleccionada
				  }
				: { value: null, valid: false };

			this.formDataChanged.emit(emitData);
		});
	}

	/* 	private subscribeToFormStatus(): void {
		this.formUser.statusChanges.subscribe(() => {
			const isValid = this.formUser.valid;
			this.formValidityChanged.emit(isValid);

			const formValue = this.formUser.getRawValue();
			const residencia = this.nationalitiesList.find(
				(pais) => pais.idCountry === formValue.idResidenceCountry
			);

			const emitData = isValid
				? {
						value: {
							...formValue,
							idResidenceCountry: residencia
						},
						valid: true,
						sucursalSeleccionada: this.sucursalSeleccionada
				  }
				: { value: null, valid: false };

			this.formDataChanged.emit(emitData);
		});
	} */

	private restoreOrLoadUserData(): void {
		this.loadUserDataFromApi();
	}

	private loadUserDataFromApi(): void {
		this.newPartnerService.getUserByUsername(this.userInfo.username).subscribe({
			next: (value) => {
				this.fixedFields = {
					name: value.name,
					lastName: value.lastName
				};

				this.formUser.patchValue({
					...this.fixedFields,
					idResidenceCountry: value.idResidenceCountry
				});
				this.applyFixedFields();
				this.isLoading = false;
			}
		});
	}

	private applyFixedFields() {
		this.formUser.get('name')?.setValue(this.fixedFields.name);
		this.formUser.get('lastName')?.setValue(this.fixedFields.lastName);
		this.formUser.get('name')?.disable();
		this.formUser.get('lastName')?.disable();
	}

	getLegalizationMethods(): void {
		this.legalizationValidateService
			.getLegalizationMethods()
			.pipe(
				takeUntil(this.destroy$),
				tap((methods) => (this.legalizationMethodOptions = methods))
			)
			.subscribe();
	}

	getAvailabilityOptions(): void {
		this.legalizationValidateService
			.getAvailabilityOptions()
			.pipe(
				takeUntil(this.destroy$),
				tap((options) => (this.optList = options))
			)
			.subscribe();
	}

	onFormValidityChange(isValid: boolean) {
		this.documentosValidados = isValid;
		this.cdr.detectChanges();
	}

	public getLegalizationDocumentTypes(): void {
		this.legalizationService
			.getLegalizationDocumentTypes()
			.pipe(
				takeUntil(this.destroy$),
				tap((docs) => {
					this.legalizationDocList = docs;
				})
			)
			.subscribe();
	}

	openCronogramaAlert(event: Event) {
		event.preventDefault();
		openImageAlert(this.dialogService, 'advertisement/AnuncioLegal.jpeg');
	}

	handleLegalizationMethodValidation(): void {
		const control = this.formUser.get('legalizationMethod');

		if (this.payTypeSelected === 1) {
			control?.clearValidators();
			control?.setValue(null);
		} else {
			control?.setValidators([Validators.required]);
		}

		control?.updateValueAndValidity();
	}
}
