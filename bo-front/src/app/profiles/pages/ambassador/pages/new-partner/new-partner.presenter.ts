import { EventEmitter, Injectable } from '@angular/core';
import {
	AbstractControl,
	AsyncValidatorFn,
	FormBuilder,
	FormGroup,
	ValidationErrors,
	Validators
} from '@angular/forms';
import {
	Observable,
	Subject,
	catchError,
	debounceTime,
	filter,
	first,
	map,
	of,
	switchMap,
	takeUntil,
	tap
} from 'rxjs';
import { SelectedPackageService } from './commons/services/package-detail.service';
import { ageValidator } from './age.validator';

@Injectable()
export class NewPartnerFormPresenter {
	public multiStepForm: FormGroup;
	private destroy$: Subject<void> = new Subject<void>();

	constructor(private fb: FormBuilder, private selectedPackageService: SelectedPackageService) {
		this.multiStepForm = this.createMultiStepForm();
		this.onChangePackage();
	}

	private createMultiStepForm(): FormGroup {
		return this.fb.group({
			personalData: this.fb.group({
				registerType: ['', Validators.required],
				name: ['', [Validators.required]],
				lastname: ['', Validators.required],
				birthdate: [
					'',
					[
						Validators.required,
						ageValidator(18)     // ← ahora es parte del array de validadores
					]
				],
				gender: ['', Validators.required],
				idNationality: [null, Validators.required],
				idDocument: ['', Validators.required],
				nroDocument: [null, [Validators.required]],

				civilState: ['', Validators.required],
				coAffiliateData: [null]
			}),
			contactData: this.fb.group({
				email: [
					'',
					[
						Validators.required,
						Validators.email,
						Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/)
					]
				],
				address: ['', [Validators.required]],
				country: [''],
				city: [''],
				phone: ['', [Validators.required]]
			}),
			packageData: this.getPackageDataForm,
			godfatherData: this.getGodfatherDataForm,
			paymentData: this.getPaymentDataForm
		});
	}

	private get getGodfatherDataForm() {
		return this.fb.group({
			idGodfather: [null],
			godfatherLevel: [null],
			isInAscendingLine: [null],
			godfatherName: [null],
			godfatherUsername: [null]
		});
	}

	private get getPackageDataForm() {
		return this.fb.group({
			packageDetailId: [null, Validators.required],
			promotionalCodeVersion: ['']
		});
	}

	private get getPaymentDataForm() {
		return this.fb.group({
			typeExchange: [3.5, Validators.required],
			profileType: [1, Validators.required],
			numberPaymentInitials: [null, Validators.required],
			gracePeriodParameterId: [1, Validators.required],
			isPayLater: [0, Validators.required],
			amountPaid: [null, Validators.required],
			operationNumber: [54564, Validators.required],
			totalNumberPaymentPaid: [1, Validators.required],
			email: [
				'',
				[
					Validators.required,
					Validators.email,
					Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|org|net)$/)
				]
			],
			currency: [1, Validators.required], // Por defecto la moneda es Dolares (1)
			operationType: ['op', Validators.required],
			payType: [null]
		});
	}

	public removePackageAndPaymentForm() {
		this.multiStepForm.removeControl('packageData');
		this.multiStepForm.removeControl('paymentData');
	}

	public addPackageAndPaymentForm() {
		this.multiStepForm.addControl('packageData', this.getPackageDataForm);
		this.multiStepForm.addControl('paymentData', this.getPaymentDataForm);
	}

	public disableFormSections() {
		this.multiStepForm.get('personalData').disable();
		this.multiStepForm.get('contactData').disable();
		this.multiStepForm.get('personalData.registerType').enable();
	}

	public preserveAndResetFormData() {
		const currentRegisterType = this.multiStepForm.get('personalData.registerType').value;

		this.multiStepForm.get('personalData').reset();
		this.multiStepForm.get('contactData').reset();
		this.multiStepForm.get('personalData.registerType').setValue(currentRegisterType);

		this.multiStepForm.get('personalData').enable();
		this.multiStepForm.get('contactData').enable();
	}

	public onChangePackage() {
		this.selectedPackageService
			.getSelectedPackageDetailData$()
			.pipe(
				takeUntil(this.destroy$),
				filter((detail) => !!detail),
				tap((detail: any) => {
					const paymentDataForm = this.multiStepForm.get('paymentData') as FormGroup;
					if (detail.isSpecialFractional || detail?.numberInitialQuote > 1) {
						paymentDataForm.addControl('amount1', this.fb.control(0, [Validators.required]));
						paymentDataForm.addControl('amount2', this.fb.control(0, [Validators.required]));
						paymentDataForm.addControl('amount3', this.fb.control(0, [Validators.required]));
					} else {
						paymentDataForm.removeControl('amount1');
						paymentDataForm.removeControl('amount2');
						paymentDataForm.removeControl('amount3');
					}
				})
			)
			.subscribe();
	}

	/* public removeSpaces(): void {
    const documentControl = this.multiStepForm.get('personalData.nroDocument');
    
    if (documentControl && documentControl.value) {
        documentControl.setValue(documentControl.value.trim(), { emitEvent: false });
    }
} */
	public removeSpaces(): void {
		const fieldsToTrim = ['personalData.name', 'personalData.lastname', 'personalData.nroDocument'];

		fieldsToTrim.forEach((field) => {
			const control = this.multiStepForm.get(field);
			if (control && control.value) {
				control.setValue(control.value.trim(), { emitEvent: false });
			}
		});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
