import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ISelect } from '@shared/interfaces/forms-control';
import { Subject, takeUntil, tap } from 'rxjs';
import { ModalPromotionalPresenter } from './promotional-creation-modal.presenter';
import { optGenderMock } from 'src/app/profiles/pages/ambassador/pages/account/pages/account-bank-data-tab/commons/mocks/_mock';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { BuyPackageService } from 'src/app/profiles/pages/ambassador/pages/store/services/buy-package.service';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { CIVIL_STATE_OPTIONS } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/constants';
import { ProductService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/product-service.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-promotional-creation-modal',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		SelectComponent,
		DialogModule,
		DynamicDialogModule,
		InputComponent,
		InputNumberModule,
		ProgressSpinnerModule,
		DateComponent
	],
	templateUrl: './promotional-creation-modal.component.html',
	styleUrl: './promotional-creation-modal.component.scss',
	providers: [ModalPromotionalPresenter, DatePipe]
})
export class ProspectCreationModalComponent {
	userId: number;
	prospectId: number;
	btnText: string;
	prospectForm: FormGroup;
	documentTypes: ISelect[];
	isLoading: boolean = false;
	optGenders: ISelect[] = optGenderMock;
	nationalitiesList: any[] = [];
	private destroy$: Subject<void> = new Subject<void>();
	civilStateList: ISelect[];
	specialTypes: ISelect[] = [];
	userInfoId: any;

	constructor(
		public modalProspectPresenter: ModalPromotionalPresenter,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		public ref: DynamicDialogRef,
		private newPartnerService: NewPartnerService,
		private config: DynamicDialogConfig,
		private buyPackageService: BuyPackageService,
		private datePipe: DatePipe,
    private productService:ProductService,
    private userInfoService:UserInfoService
	) {
    this.userInfoId = this.userInfoService.userInfo.id;

  }

	ngOnInit(): void {
		this.btnText = 'Editar';
		this.getNationalities();
		this.prospectForm = this.modalProspectPresenter.prospectForm;
		this.userId = this.config.data.userId;
		this.prospectId = this.config.data.beneficiaryId;
		if (this.prospectId !== 0) {
			this.buyPackageService.findProspectById(this.prospectId).subscribe({
				next: (response) => {
					const birthDateParts = response.data.birthDate.split('-'); // Separar por guiones
					const formattedBirthdate = `${birthDateParts[0]}/${birthDateParts[1]}/${birthDateParts[2]}`; // Formato DD/MM/YYYY

					console.log('formattedBirthdate', formattedBirthdate);
					this.prospectForm.patchValue({
						name: response.data.name,
						lastName: response.data.lastname,
						gender: Number(response.data.gender),
						email: response.data.email,
						documentId: response.data.documentId,
						nroDocument: response.data.nroDocument,
						residenceCountryId: response.data.residenceCountryId,
						nroPhone: response.data.nroPhone,
						prospectType: String(response.data.customerType),
						civilState: response.data.civilState,
						birthdate: formattedBirthdate,
						specialType: response.data.suscriptionId
					});
					this.getDocumentType({ idCountry: response.data.residenceCountryId });
					this.getCivilStatus(response.data.civilState);
          if (String(response.data.customerType) === '2') {
            this.loadSuscriptions(); // Llamamos para cargar las suscripciones
          }
				},
				error: () => {
					alert('Error al obtener datos del prospecto.');
				}
			});
		}
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
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

	private getCivilStatus(selectedCivilStateId: number) {
		this.newPartnerGeneralInfoService
			.getCivilstatus()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => {
					this.civilStateList = civilStatus;
					const selectedCivilState = civilStatus.find(
						(option: any) => option.value === selectedCivilStateId
					);
					if (selectedCivilState) {
						this.prospectForm.patchValue({
							civilState: selectedCivilState.value
						});
					}
				})
			)
			.subscribe();
	}

  loadSuscriptions() {
    this.productService
      .getSuscription(this.userInfoId)
      .pipe(
        takeUntil(this.destroy$),
        tap((suscriptions) => {
          this.specialTypes = suscriptions.map((s) => ({
            value: s.id,
            content: s.nameSuscription
          }));
  
          // Cuando las opciones se cargan, asignamos el valor de la suscripción si ya tenemos la data del prospecto
          if (this.prospectForm.get('prospectType')?.value === '2') {
            const suscriptionId = this.prospectForm.get('specialType')?.value;
            this.prospectForm.get('specialType')?.setValue(suscriptionId);
          }
        })
      )
      .subscribe();
  }

  /* loadSuscriptions() {
		this.productService
			.getSuscription(this.userInfoId)
			.pipe(
				takeUntil(this.destroy$),
				tap((suscriptions) => {
					this.specialTypes = suscriptions.map((s) => ({
						value: s.id,
						content: s.nameSuscription
					}));
				})
			)
			.subscribe();
	} */

	editProspect() {
		this.isLoading = true;
		const data = {
			userId: this.userId,
			name: this.prospectForm.get('name').value,
			lastname: this.prospectForm.get('lastName').value,
			gender: this.prospectForm.get('gender').value,
			email: this.prospectForm.get('email').value,
			documentId: this.prospectForm.get('documentId').value,
			nroDocument: this.prospectForm.get('nroDocument').value,
			nroPhone: this.prospectForm.get('nroPhone').value,
			prospectType: this.prospectForm.get('prospectType').value,
			residenceCountryId: this.prospectForm.get('residenceCountryId').value,
			civilState: this.prospectForm.get('civilState').value,
			birthdate: this.prospectForm.get('birthdate').value
		};
		if (this.prospectId !== 0) {
			this.buyPackageService.updatePromotionalGuest(data, this.prospectId).subscribe({
				next: () => {
					this.ref.close(true);
				},
				error: () => {
					this.ref.close(false);
				},
				complete: () => {
					this.isLoading = false;
				}
			});
		}
	}
}
