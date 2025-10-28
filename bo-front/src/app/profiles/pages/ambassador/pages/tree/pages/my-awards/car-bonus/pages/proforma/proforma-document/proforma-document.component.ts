import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, map } from 'rxjs';
import { SafeResourceUrl } from '@angular/platform-browser';
import { ModalNotifyComponent } from '@shared/components/modal/modal-notify/modal-notify.component';
import { QuotationService } from '../../service/quotation.service';
import { QuotationRequest } from '../../../interface/quotation.interface';
import { Quotation } from '../../../interface/quotation.interface';
import { PdfUploadComponent } from './pdf-upload/pdf-upload.component';
import { ModalInfoComponent } from '@shared/components/modal/modal-info/modal-info.component';
import { DialogData } from '@shared/components/modal/modal-info/interface/modal-info.interface';
import { MyAwardsService } from '../../../../components/service/my-awards.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ClassificationsService } from '../../../../components/service/classifications.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';

@Component({
	selector: 'app-proforma-document',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule, ModalNotifyComponent, PdfUploadComponent],
	templateUrl: './proforma-document.component.html',
	styleUrls: ['./proforma-document.component.scss']
})
export class ProformaDocumentComponent implements OnInit, OnDestroy {
	private _quotationService: QuotationService = inject(QuotationService);
	private _myAwardsService: MyAwardsService = inject(MyAwardsService);
	private _dialogService: DialogService = inject(DialogService);
	private _newPartnerService: NewPartnerService = inject(NewPartnerService);
	private _formBuilder: FormBuilder = inject(FormBuilder);
	private _router: Router = inject(Router);
	private _route: ActivatedRoute = inject(ActivatedRoute);
	private _classificationsService: ClassificationsService = inject(ClassificationsService);
	private _userInfoService: UserInfoService = inject(UserInfoService);

	private _classificationId: string;
	private _quotationRequest: QuotationRequest;
	initialBonus: number;
	monthlyBonus: number;
	bonusPrice: number;
	events: any[] = [];

	initialAmountValue: number = 0;
	totalAmountValue: number = 0;
	installmentAmountValue: number = 0;

	form: FormGroup = this._formBuilder.group({
		brandName: this._formBuilder.control('', [Validators.required]),
		modelName: this._formBuilder.control('', [Validators.required]),
		color: this._formBuilder.control('', [Validators.required]),
		price: this._formBuilder.control('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
		dealershipName: this._formBuilder.control('', [Validators.required]),
		executiveCountryId: this._formBuilder.control('', [Validators.required]),
		salesExecutiveName: this._formBuilder.control('', [Validators.required]),
		salesExecutivePhone: this._formBuilder.control('', [Validators.required]),
		quotationFile: this._formBuilder.control<File | string | null>(null, [Validators.required]),
		eventId: this._formBuilder.control(null, [Validators.required]),
		initialInstallments: this._formBuilder.control(1, [Validators.required])
	});

	ngOnInit() {
		this._classificationId = this._route.snapshot.params['classificationId'];
		const quotationId = this._route.snapshot.params['quotationId'];
		forkJoin([this.loadEvents(), this.loadCountries()]).subscribe({
			next: ([events, countries]) => {
				this.events = events;
				this.countries = countries;
				this.filteredCountries = countries;
				// Set default country to Peru (idCountry: 167)
				const peru = this.countries.find((c) => c.idCountry === '167');
				if (peru) {
					this.form.patchValue({ executiveCountryId: '167' });
				}
				const carBonus = this._myAwardsService.getCarBonus;
				if (!carBonus.classificationId) {
					const userId = this._userInfoService.userInfo.id;
					this._classificationsService.getClassification(userId).subscribe({
						next: (response) => {
							const classification = response.data.find(
								(c) => c.classificationId === this._classificationId
							);
							if (classification) {
								this._myAwardsService.setCarBonus(classification);
								this.setBonusValues();
							}
						},
						error: (error) => {
							console.error('Error loading classification:', error);
						}
					});
				} else {
					this.setBonusValues();
				}
				if (quotationId) {
					this.mode = 'edit';
					const state = history.state as any;
					if (state?.quotation) {
						this.populateForm(state.quotation);
					}
				}
			},
			error: (error) => {
				console.error('Error loading data:', error);
			}
		});
	}

	private loadEvents(): Observable<any[]> {
		return this._quotationService
				.getEvents()
				.pipe(
					map((events) =>
						events.map((e) => ({
							...e,
							eventId: e.eventId?.toString(),
						}))
					)
				);
	}

	private loadCountries(): Observable<any[]> {
		return this._newPartnerService.getCountriesList().pipe(
			map((countries) =>
				countries.map((c) => ({
					idCountry: c.idCountry.toString(),
					iso: c.iso,
					name: c.nicename,
					dial: c.symbol + c.phonecode,
					flag: c.icon
				}))
			)
		);
	}

	private setBonusValues() {
		this.initialBonus = this._myAwardsService.getCarBonus.initialBonus;
		this.monthlyBonus = this._myAwardsService.getCarBonus.monthlyBonus;
		this.bonusPrice = this._myAwardsService.getCarBonus.bonusPrice;
		this.updatePriceValidator();
		this.updateCalculations();
		this.form.valueChanges.subscribe(() => {
			this.updateCalculations();
		});
	}

	private updateCalculations() {
		const price = this.form.value.price;
		this.initialAmountValue =
			price && price > this.bonusPrice ? price - this.bonusPrice + this.initialBonus : 0;
		this.totalAmountValue = price && price > this.bonusPrice ? price - this.bonusPrice : 0;
		const n = this.form.value.initialInstallments || 1;
		this.installmentAmountValue = this.totalAmountValue / n;
	}

	private updatePriceValidator() {
		const priceControl = this.form.get('price');
		if (priceControl) {
			priceControl.setValidators([
				Validators.required,
				Validators.pattern(/^\d+(\.\d{1,2})?$/),
				this.priceValidator.bind(this)
			]);
			priceControl.updateValueAndValidity();
		}
	}

	private populateForm(quotation: Quotation) {
		this.quotation = quotation;
		this.form.patchValue({
			brandName: quotation.brand,
			modelName: quotation.model,
			color: quotation.color,
			price: quotation.price,
			dealershipName: quotation.dealership,
			executiveCountryId: quotation.executiveCountryId.toString(),
			salesExecutiveName: quotation.salesExecutive,
			salesExecutivePhone: quotation.salesExecutivePhone,
			eventId: quotation.eventId,
			initialInstallments: quotation.initialInstallments,
			quotationFile: quotation.quotationUrl
		});
		if (quotation.quotationUrl) {
			this.form.get('quotationFile')?.clearValidators();
			this.form.get('quotationFile')?.updateValueAndValidity();
		}
	}

	private priceValidator(control: FormControl) {
		const price = control.value;
		if (!price || price <= this.bonusPrice) {
			return { priceTooLow: true };
		}
		return null;
	}

	onSave() {
		if (this.form.invalid) {
			this.form.markAllAsTouched();
			return;
		}
		this.confirmOpen = true;
	}

	closeConfirm() {
		this.confirmOpen = false;
	}

	confirmSend() {
		this.confirmOpen = false;
		this._quotationRequest = this.buildQuotationRequest();
		const quotationId = this._route.snapshot.params['quotationId'];
		const request =
			this.mode === 'edit' && quotationId
				? this._quotationService.updateQuotation(quotationId, this._quotationRequest)
				: this._quotationService.createQuotation(this._quotationRequest);
		request.subscribe({
			next: (response: String) => {
				const data = this.getSuccessMessage();
				this.openModalInfo(data).onClose.subscribe({
					next: () => {
						return this._router.navigate([
							'/profile/ambassador/my-awards/car-bonus/proforma/',
							this._classificationId
						]);
					}
				});
			},
			error: (error) => {
        if (error.status === 422) {
          const data = this.getMessageError422();
          this.openModalInfo(data);
          return;
        }
				const data = this.getMessageError();
				this.openModalInfo(data);
			}
		});
	}

	private buildQuotationRequest(): QuotationRequest {
		const file = this.form.value.quotationFile;
		const quotationFile = typeof file === 'string' ? null : file;
		const request: any = {
			classificationId: this._classificationId,
			brandName: this.form.value.brandName,
			modelName: this.form.value.modelName,
			color: this.form.value.color,
			price: this.form.value.price,
			dealershipName: this.form.value.dealershipName,
			executiveCountryId: this.form.value.executiveCountryId,
			salesExecutiveName: this.form.value.salesExecutiveName,
			salesExecutivePhone: this.form.value.salesExecutivePhone,
			eventId: this.form.value.eventId ? Number(this.form.value.eventId) : null,
			initialInstallments: this.form.value.initialInstallments
		};
		if (quotationFile !== null) {
			request.quotationFile = quotationFile;
		}
		return request;
	}

	private getSuccessMessage(): DialogData {
		const isEdit = this.mode === 'edit';
		return {
			kind: 'preset',
			type: 'success',
			title: isEdit ? '¡Proforma actualizada!' : '¡Proforma enviada!',
			message: isEdit
				? 'Tu proforma fue actualizada exitosamente.'
				: 'Tu registro fue completado exitosamente. Nos comunicaremos contigo para confirmarte cuál de los autos fue elegido de tus proformas y enviarte el cronograma de pago de tu cuota inicial.'
		};
	}

	private getMessageError(): DialogData {
		return {
			kind: 'preset',
			type: 'error',
			title: '¡Error al enviar la proforma!',
			message:
				'Ocurrió un error al enviar tu proforma. Por favor, intenta nuevamente más tarde o contacta a soporte.'
		};
	}

	private getMessageError422(): DialogData {
		return {
			kind: 'preset',
			type: 'error',
			title: '¡No se puede crear la proforma!',
			message: 'La proforma no se puede crear porque alguna de las proformas ya ha sido aceptada.'
		};
	}

	pdfUrl: SafeResourceUrl | null = null;

	maxSizeMB = 10;
	dragOver = false;
	@ViewChild('fileInput') fileInput?: ElementRef<HTMLInputElement>;
	countries: any[] = [];
	filteredCountries: any[] = [];
	countrySearch: string = '';
	countryMenuOpen = false;
	eventMenuOpen = false;

	quotation: Quotation | null = null;

	mode: 'create' | 'edit' = 'create';

	isInvalid(n: string) {
		const c = this.form.get(n);
		return !!(c && c.touched && c.invalid);
	}
	errorText(n: string) {
		if (n === 'price') {
			const control = this.form.get('price');
			if (control?.errors?.['priceTooLow']) {
				return 'El precio del auto debe ser mayor al bono de la empresa.';
			}
			if (control?.errors?.['pattern']) {
				return 'El precio debe ser un número válido.';
			}
			return 'El precio es obligatorio.';
		}
		const m: Record<string, string> = {
			marca: 'La marca es obligatoria.',
			modelo: 'El modelo es obligatorio.',
			color: 'El color es obligatorio.',
			precioUSD: 'El precio es obligatorio.',
			concesionaria: 'La concesionaria es obligatoria.',
			ejecutivoVentas: 'El ejecutivo de ventas es obligatorio.',
			telefono: 'El celular del ejecutivo es obligatorio.',
			evento: 'El evento es obligatorio.',
			quotationFile: 'El PDF es obligatorio.',
			descripcion: 'La descripción es obligatoria.',
			priceTooLow: 'El precio del auto debe ser mayor al bono de la empresa.'
		};
		return m[n] || 'Este campo es obligatorio.';
	}

	get initialAmount(): number {
		return this.initialAmountValue;
	}

	get totalAmount(): number {
		return this.totalAmountValue;
	}

	get installmentAmount(): number {
		return this.installmentAmountValue;
	}

	confirmOpen = false;
	confirmMessage =
		'Estás a punto de enviar tus proformas al sistema para su validación. Verifica que la información sea correcta.';

	confirmBullets = [
		'Datos del vehículo (marca, modelo, color)',
		'Información de contacto',
		'Ejecutivo de ventas asignado',
		'Empresa/concesionaria'
	];

	resultTitle = '';
	resultMessage = '';
	resultIcon: 'success' | 'error' | 'info' | 'warning' = 'success';
	resultInfoMessage = '';

	toggleCountryMenu(evt: Event) {
		evt.stopPropagation();
		if (evt instanceof KeyboardEvent) {
			evt.preventDefault();
		}
		this.countryMenuOpen = !this.countryMenuOpen;
		if (this.countryMenuOpen) {
			this.filteredCountries = this.countries;
			this.countrySearch = '';
		}
	}

	selectCountry(country: any, event: Event) {
		event.stopPropagation();
		this.form.patchValue({ executiveCountryId: country.idCountry.toString() });
		this.countryMenuOpen = false;
	}

	onCountrySearch(term: string) {
		this.countrySearch = term ?? '';
		const q = this.countrySearch.trim().toLowerCase();
		if (!q) {
			this.filteredCountries = this.countries;
			return;
		}
		this.filteredCountries = this.countries.filter((c) => {
			return (
				(c.name && c.name.toLowerCase().includes(q)) ||
				(c.dial && c.dial.toString().toLowerCase().includes(q)) ||
				(c.iso && c.iso.toLowerCase().includes(q))
			);
		});
	}

	toggleEventMenu(evt: Event) {
		evt.stopPropagation();
		if (evt instanceof KeyboardEvent) {
			evt.preventDefault();
		}
		this.eventMenuOpen = !this.eventMenuOpen;
	}

	selectEvent(event: any, evt: Event) {
		evt.stopPropagation();
		this.form.patchValue({ eventId: event.eventId.toString() });
		this.eventMenuOpen = false;
	}

	onPdfUrlChange(url: SafeResourceUrl | null) {
		this.pdfUrl = url;
	}

	limitDigits(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.value.length > 2) {
			input.value = input.value.slice(0, 2);
			this.form.patchValue({ initialInstallments: +input.value });
		}
	}

	onBack() {
		this._router.navigate(['/profile/ambassador/my-awards/car-bonus/proforma/', this._classificationId]);
	}

	get selectedCountry() {
		const id = this.form.value.executiveCountryId.toString();
		return this.countries.find((c) => c.idCountry === id) ?? this.countries[0];
	}

	get selectedEvent() {
		const id = this.form.value.eventId?.toString();
		return this.events.find((e) => e.eventId === id) ?? null;
	}

	ngOnDestroy() {}

	openModalInfo(data: DialogData): DynamicDialogRef {
		return this._dialogService.open(ModalInfoComponent, {
			data,
			width: '440px',
			breakpoints: {
				'450px': '90vw',
				'320px': '95vw'
			},
			styleClass: 'custom-info-dialog'
		});
	}
}
