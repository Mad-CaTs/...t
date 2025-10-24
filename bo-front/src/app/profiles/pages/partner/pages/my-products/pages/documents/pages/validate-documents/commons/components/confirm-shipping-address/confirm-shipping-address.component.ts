import { CommonModule } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { pickupInfoMock } from 'src/app/profiles/pages/ambassador/pages/account/pages/account-bank-data-tab/commons/mocks/_mock';
import { ModalRegisterAuthorizedPerson } from './commons/modals/register-authorized-person-modal/register-authorized-person';
import { IAuthorizedPerson } from '../../interfaces/validate.interfaces';
import { BorderedTableComponent } from '@shared/components/bordered-table/bordered-table.component';
import { MatIconModule } from '@angular/material/icon';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { LegalizationValidateService } from '../validate-personal-data/commons/services/legalization-validate.service';
import { ShippingAddressForeignComponent } from '../shipping-address-foreign/shipping-address-foreign.component';
import { openImageAlert } from '../../utils';
import { DocumentMessageService } from '../shipping-address-foreign/commons/services/document-message.service';
import { IShippingFormData } from './commons/interfaces';
import ValidatePersonalDataComponent from '../validate-personal-data/validate-personal-data.component';

@Component({
	selector: 'app-confirm-shipping-address',
	standalone: true,
	imports: [
		CommonModule,
		RadiosComponent,
		BorderedTableComponent,
		MatIconModule,
		SelectComponent,
		ReactiveFormsModule,
		ShippingAddressForeignComponent,
		ValidatePersonalDataComponent
	],
	templateUrl: './confirm-shipping-address.component.html',
	styleUrl: './confirm-shipping-address.component.scss'
})
export default class ConfirmShippingAddressComponent implements OnInit {
	public formShipping: FormGroup;
	public formUser: FormGroup;
	public formShippingForeign: FormGroup;
	@Input() pickupInfo: ISelect[] = [];
	@Input() shippingInfo: ISelect[] = [];
	private destroy$: Subject<void> = new Subject<void>();

	@Output() formValidityChanged = new EventEmitter<boolean>();

	@Output() branchDataChanged = new EventEmitter<any>();
	@Output() formDataChanged = new EventEmitter<any>();

	registeredAuthorizedPerson: IAuthorizedPerson | null = null;
	@Output() authorizedPersonRegistered = new EventEmitter<IAuthorizedPerson>();
	isCollapseOpen = false;
	@Input() payTypeSelected: number;
	@Input() nationalitiesList: any[] = [];
	@Input() isForeign: any;
	@Input() optTypeLegalization: ISelect[] = [];
	@Input() legalizationDocList: ISelect[];
	public legalizationMethodOptions: ISelect[] = [];
	public documentMessages: Record<string, string> = {};
	@Input() selectedProduct: any;
	@Output() sucursalesCercanasChange = new EventEmitter<any[]>();
	@Output() loadingSucursalesChange = new EventEmitter<boolean>();
	@Input() shippingAddressData: any;
	constructor(
		private formBuilder: FormBuilder,
		private dialogService: DialogService,
		private legalizationValidateService: LegalizationValidateService,
		private documentMessageService: DocumentMessageService
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['nationalitiesList'] && changes['nationalitiesList'].currentValue?.length) {
		}
		if (changes['shippingInfo'] && changes['shippingInfo'].currentValue?.length) {
		}
	}

	foreignAddressValidator(control: any) {
		const value = control.value || '';
		const parts = value.split(',').map((part) => part.trim());
		if (parts.length !== 5) {
			return { invalidFormat: true };
		}
		if (parts.some((part) => !part)) {
			return { emptyPart: true };
		}
		return null;
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

	ngOnInit(): void {
		if (!this.selectedProduct) return;
		this.initData();
	}

	private initData() {
		this.initialiceMultiForn();
		this.initializeFormIfDataExists();
		this.subscribeToFormChanges();
		this.syncRegisteredAuthorizedPerson();
		this.getLegalizationMethods();
		this.loadDocumentMessages();
	}

	private initialiceMultiForn() {
		this.initFormShippingControlsLima();
		this.initFormProvinciaControls();
		this.initFormShippingForeignExtranjero();
	}

	private initFormShippingControlsLima(): void {
		if (!this.formShipping) {
			this.formShipping = this.formBuilder.group({});
		}
		this.formShipping.addControl('dtoRecojo', new FormControl(null, Validators.required));
		if (this.selectedProduct.tipo === 2) {
			this.formShipping.addControl('legalizationMethod', new FormControl('', Validators.required));
			this.formShipping.addControl('typeLegalization', new FormControl('', Validators.required));
		} else if (this.selectedProduct.tipo === 1) {
			this.formShipping.addControl('typeLegalization', new FormControl(''));
		}

		this.formShipping.addControl('registeredAuthorizedPerson', new FormControl(null));
	}

	private initFormProvinciaControls(): void {
		if (!this.formUser) {
			this.formUser = this.formBuilder.group({});
		}
		this.formUser.addControl('typeLegalization', new FormControl('', Validators.required));
		this.formUser.addControl('idResidenceCountry', new FormControl('', Validators.required));
		this.formUser.addControl('districtAddress', new FormControl('', Validators.required));
		this.formUser.addControl('address', new FormControl('', Validators.required));
		this.formUser.addControl('province', new FormControl('', Validators.required));
		this.formUser.addControl('department', new FormControl('', Validators.required));
		if (this.selectedProduct?.tipo === 2) {
			this.formUser.addControl('availability', new FormControl('', Validators.required));
		}
	}

	private initFormShippingForeignExtranjero(): void {
		if (!this.formShippingForeign) {
			this.formShippingForeign = this.formBuilder.group({});
		}
		this.formShippingForeign.addControl(
			'foreignFullAddress',
			new FormControl('', [Validators.required, this.foreignAddressValidator])
		);
		this.formShippingForeign.addControl('idResidenceCountry', new FormControl(null, Validators.required));
		this.formShippingForeign.addControl('nroPhone', new FormControl('', Validators.required));
		this.formShippingForeign.addControl(
			'email',
			new FormControl('', [Validators.required, Validators.email])
		);
		this.formShippingForeign.addControl('typeLegalization', new FormControl('', Validators.required));
		this.formShippingForeign.addControl(
			'apostillaOLegalizacion',
			new FormControl(null, Validators.required)
		);
		if (this.selectedProduct?.tipo === 2) {
			this.formShippingForeign.addControl('availability', new FormControl('', Validators.required));
		}
	}

	private initializeFormIfDataExists() {
		if (!this.shippingAddressData) return;
		const data = { ...this.shippingAddressData.data };

		Object.keys(data).forEach((key) => {
			if (data[key] && typeof data[key] === 'object' && 'value' in data[key]) {
				data[key] = data[key].value;
			}
		});
		if (this.isForeign === 1) {
			this.formShipping.patchValue(data);
		} else if (this.isForeign === 2) {
			this.formUser.patchValue(data);
		} else if (this.isForeign === 3) {
			this.formShippingForeign.patchValue(data);
		}
	}

	private loadDocumentMessages(): void {
		this.documentMessageService.getAllMessages().subscribe({
			next: (res) => {
				this.documentMessages = res;
			},
			error: () => {
				console.error('Error cargando mensajes');
			}
		});
	}

	onShippingAddressChanged(data: any): void {
		this.formDataChanged.emit(data);
	}

	onSucursalesChange(data: any[]) {
		this.sucursalesCercanasChange.emit(data);
	}

	onLoadingSucursalesChange(isLoading: boolean) {
		this.loadingSucursalesChange.emit(isLoading);
	}

	private syncRegisteredAuthorizedPerson(): void {
		this.registeredAuthorizedPerson = this.formShipping.get('registeredAuthorizedPerson')?.value;
	}

	private subscribeToFormChanges() {
		/* 		this.destroy$.next();
		 */
		if (this.isForeign === 1) {
			this.formShipping.valueChanges
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => this.emitCompleteFormData());
		}

		if (this.isForeign === 2) {
			this.formUser.valueChanges
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => this.emitCompletePersonalData());
		}

		if (this.isForeign === 3) {
			this.formShippingForeign.valueChanges
				.pipe(takeUntil(this.destroy$))
				.subscribe(() => this.emitCompleteForeignData());
		}
	}

	// Para formulario 1 (Lima)
	private emitCompleteFormData(): void {
		const isValid = this.formShipping.valid;
		const { dtoRecojo, ...rest } = this.formShipping.value;
		const opt = this.currentDeliveryOptions.find((o) => o.value === dtoRecojo);
		const data = { ...rest, dtoRecojo: opt ? { value: opt.value, content: opt.content } : null };

		this.formDataChanged.emit({ data: isValid ? data : null, valid: isValid });
	}

	// Para formulario 2 (provincia)

	private emitCompletePersonalData(): void {
		const isValid = this.formUser.valid;
		const formValue = this.formUser.value;

		const opt = this.nationalitiesList.find((o) => o.value === formValue.idResidenceCountry);

		const data = {
			...formValue,
			idResidenceCountry: opt
				? { value: opt.value, content: opt.content }
				: formValue.idResidenceCountry
		};

		this.formDataChanged.emit({
			data: isValid ? data : null,
			valid: isValid
		});
	}

	// Para formulario 3 (Extranjero)

	onForeignFormDataChanged(event: any) {
		console.log('💌 Padre intermedio recibió del hijo extranjero:', event);
		this.formDataChanged.emit(event);
	}
	private emitCompleteForeignData(): void {
		const isValid = this.formShippingForeign.valid;
		const formValue = this.formShippingForeign.value;

		const opt = this.nationalitiesList.find((o) => o.value === formValue.idResidenceCountry);

		const dataToEmit = isValid
			? {
					...formValue,
					idResidenceCountry: opt
						? { value: opt.value, content: opt.content }
						: formValue.idResidenceCountry
			  }
			: null;

		console.log('Emit completo FOREIGN DATA =>', {
			data: dataToEmit,
			valid: isValid
		});

		this.formDataChanged.emit({
			data: dataToEmit,
			valid: isValid
		});
	}

	onselectedBranchChange(data) {
		this.branchDataChanged.emit(data);
	}
	public get currentDeliveryLabel(): string {
		return this.isForeign === 1 ? 'Datos de Recojo' : 'Datos de Envío';
	}

	public get currentDeliveryOptions(): ISelect[] {
		return this.isForeign === 1 ? this.pickupInfo : this.shippingInfo;
	}

	openAuthorizedPersonModal(data?: IAuthorizedPerson) {
		const ref = this.dialogService.open(ModalRegisterAuthorizedPerson, {
			header: data ? 'Editar persona autorizada' : 'Registrar persona autorizada',
			width: '600px',
			data: data || null,
			styleClass: 'custom-modal'
		});

		ref.onClose.subscribe((result: IAuthorizedPerson | null) => {
			if (result) {
				this.registeredAuthorizedPerson = result;
				this.formShipping.patchValue({ registeredAuthorizedPerson: result });
				this.authorizedPersonRegistered.emit(result);
			}
		});
	}

	tableHeaders = ['Nombres', 'Apellidos', 'Documento', 'N° de doc.', 'Fech. nac.', 'Acciones'];

	removeAuthorizedPerson() {
		this.registeredAuthorizedPerson = null;
		this.formShipping.patchValue({ registeredAuthorizedPerson: null });
		this.formShipping.updateValueAndValidity();
	}

	openCronograma(event: Event) {
		event.preventDefault();
		openImageAlert(this.dialogService, 'advertisement/AnuncioLegal.jpeg');
	}
}
