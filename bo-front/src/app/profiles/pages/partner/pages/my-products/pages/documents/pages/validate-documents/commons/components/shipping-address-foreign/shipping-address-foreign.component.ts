import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { LegalizationValidateService } from '../validate-personal-data/commons/services/legalization-validate.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { openImageAlert } from '../../utils';
import { DocumentMessageService } from './commons/services/document-message.service';
import ValidatePersonalDataComponent from '../validate-personal-data/validate-personal-data.component';

@Component({
	selector: 'app-shipping-address-foreign',
	standalone: true,
	imports: [
		CommonModule,
		InputComponent,
		ReactiveFormsModule,
		SelectComponent,
		RadiosComponent,
		ValidatePersonalDataComponent
	],
	templateUrl: './shipping-address-foreign.component.html',
	styleUrl: './shipping-address-foreign.component.scss'
})
export class ShippingAddressForeignComponent implements OnChanges {
	@Input() form: FormGroup;
	@Output() formDataChanged = new EventEmitter<any>();
	@Input() nationalitiesList: any[] = [];
	@Input() optTypeLegalization: ISelect[] = [];
	@Input() isForeign: any;
	@Input() selectedProduct: any;
	@Output() formValidityChanged = new EventEmitter<boolean>();
	public optList: ISelect[] = [];
	private destroy$: Subject<void> = new Subject<void>();
	@Input() legalizationDocList: ISelect[];
	public phonecodeCountry: string = '';
	public iconName: string = '';
	public documentMessages: Record<string, string> = {};
	public tipoServicioOpciones: ISelect[] = [];

	constructor(
		private legalizationValidateService: LegalizationValidateService,
		private dialogService: DialogService,
		private documentMessageService: DocumentMessageService
	) {}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['form'] && this.form) {
		}
		if (changes['nationalitiesList'] && this.nationalitiesList?.length) {
		}
	}

	ngOnInit(): void {
		this.initData();
	}

	initData() {
		this.getAvailabilityOptions();
		this.loadDocumentMessages();
		this.loadApostillaOptions();
		this.subscribeToFormChanges();
		this.form.get('idResidenceCountry')?.valueChanges.subscribe((selectedId) => {
			this.setPhonePrefix(selectedId);
		});
	}

	private subscribeToFormChanges() {
		if (!this.form) {
			console.error('⚠️ Hijo: form no está definido');
			return;
		}
		this.form.valueChanges.subscribe((value) => {
			const isValid = this.form.valid;
			this.formValidityChanged.emit(isValid);
			const residencia = this.nationalitiesList.find((pais) => pais.value === value.idResidenceCountry);
			const emitData = isValid
				? {
						value: {
							...value,
							idResidenceCountry: {
								value: value.idResidenceCountry,
								content: residencia?.content || null
							}
						},
						valid: true
				  }
				: { value: null, valid: false };
			this.formDataChanged.emit(emitData);
		});
	}

	setPhonePrefix(country: number) {
		const selectedContry = this.nationalitiesList.find((c) => c.value === country);
		this.iconName = selectedContry.icon;
		this.phonecodeCountry = selectedContry.symbol + selectedContry.phonecode;
	}

	emitGeolocation(): void {
		// por implemntar..
	}

	get isInvalidFormat(): boolean {
		const control = this.form.get('foreignFullAddress');
		return control?.touched && control?.errors?.['invalidFormat'];
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

	private loadApostillaOptions(): void {
		this.documentMessageService.getApostillaOptions().subscribe({
			next: (options) => {
				this.tipoServicioOpciones = options;
			},
			error: () => console.error('Error al cargar opciones de apostilla')
		});
	}

	openCronogramaAlert(event: Event) {
		event.preventDefault();
		openImageAlert(this.dialogService, 'advertisement/AnuncioLegal.jpeg');
	}

	getAvailabilityOptions(): void {
		this.legalizationValidateService
			.getAvailabilityOptions()
			.pipe(
				takeUntil(this.destroy$),
				tap((options) => {
					this.optList = options.filter((opt) => opt.value === 1 || opt.value === 2);
				})
			)
			.subscribe();
	}
}
