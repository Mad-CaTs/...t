import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
	FormArray,
	FormBuilder,
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
	civilStateOptMock,
	genderOptMock,
	nationalitiesOptMock,
	typeDocumentOptMock
} from 'src/app/profiles/pages/ambassador/commons/mocks/mock-personal-information';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { PhoneComponent } from '@shared/components/form-control/phone/phone.component';
import { DropdownModule } from 'primeng/dropdown';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { TransferLiquidationService } from '../../service/transfer-liquidation-package.service';
import { catchError, of, Subject, takeUntil, tap } from 'rxjs';
import { ISelect } from '@shared/interfaces/forms-control';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessTransferComponent } from '../modal-success-transfer/modal-success-transfer.component';
import { NewPartnerService } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/services/new-partner.service';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { Nationality } from 'src/app/profiles/pages/ambassador/pages/new-partner/commons/interfaces/new-partner.interface';
import { Observable } from 'ol';

@Component({
	selector: 'app-account-new-partner-modal',
	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		ReactiveFormsModule,
		InputComponent,
		SelectComponent,
		DateComponent,
		PhoneComponent,
		DropdownModule,
		FormsModule
	],
	templateUrl: './account-new-partner-modal.component.html',
	styleUrls: []
})
export class AccountNewPartnerModalComponent implements OnInit {
	@Input() idSponsor: number = 0;
	@Input() idTypeTransfer: number = 0;
	@Input() selectedMembership: any = {};
	@Output() submit = new EventEmitter();

	public form: FormGroup;
	public nationalityOpt: ISelect[];
	public residentOpt: Nationality[] = [];
	public docTypeOpt: ISelect[];
	public genderOpt = genderOptMock;
	public civilStateOpt: ISelect[];
	cities: any;
	selectedCity: any;
	sponsorByUser: any = {};
	currentUser: any = {};
	selectedUser: any = {};
	public screen: number = 1;
	public membership: ISelect[] = [];
	public typeTransfer: string = '';
	private destroy$: Subject<void> = new Subject<void>();
	public iconName: string;
	public phonecodeCountry: string;

	constructor(
		private builder: FormBuilder,
		private instanceModal: NgbActiveModal,
		private __transferLiquidationService: TransferLiquidationService,
		private newPartnerService: NewPartnerService,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private __newPartnerService: NewPartnerService,
		private modal: NgbModal
	) {
		this.form = builder.group({
			names: ['', [Validators.required, Validators.minLength(3)]],
			lastnames: ['', [Validators.required, Validators.minLength(3)]],
			nationality: [0, [Validators.required, Validators.min(1)]],
			docType: [0, [Validators.required, Validators.min(1)]],
			docNumber: ['', [Validators.required, Validators.minLength(7), Validators.pattern('[0-9]*')]],
			phone: ['', [Validators.required, Validators.minLength(9)]],
			email: ['', [Validators.required, Validators.email]],
			country: [0, [Validators.required, Validators.min(1)]],
			district: ['', [Validators.required, Validators.min(1)]],
			address: ['', [Validators.required, Validators.minLength(5)]],
			gender: [0, [Validators.required, Validators.min(1)]],
			bornDate: [new Date().toUTCString(), [Validators.required, Validators.minLength(3)]],
			civilState: [0, [Validators.required, Validators.min(1)]]
		});

		this.cities = [
			{ name: 'New York', code: 'NY' },
			{ name: 'Rome', code: 'RM' },
			{ name: 'London', code: 'LDN' },
			{ name: 'Istanbul', code: 'IST' },
			{ name: 'Paris', code: 'PRS' }
		];
	}

	ngOnInit(): void {
		this.currentUser = JSON.parse(localStorage.getItem('user_info'));
		this.getNationalities();
		this.getResident();
		this.getSuscriptionByIdUser();
		this.getCivilStatus();
	}

	private getNationalities() {
		this.newPartnerService
			.getCountriesList()
			.pipe(
				takeUntil(this.destroy$),
				tap((paises) => (this.nationalityOpt = paises))
			)
			.subscribe();
	}

	private getResident() {
		this.newPartnerService
			.getCountriesList()
			.pipe(
				tap((paises) => {
					this.residentOpt = paises.map((pais) => {
						return { content: pais.nicename, value: pais.icon, ...pais };
					});
				})
			)
			.subscribe();
	}

	public getDocumentType(event: any) {
		this.newPartnerGeneralInfoService
			.getDocumentType(event.idCountry)
			.pipe(
				takeUntil(this.destroy$),
				tap((documentTypes) => {
					this.docTypeOpt = documentTypes;
				})
			)
			.subscribe();
	}

	onChangeCountry(event: any) {
		if (!event || !event.value) {
			this.iconName = '';
			this.phonecodeCountry = '';
			return;
		}
		this.setPhonePrefix(event.value);
	}

	setPhonePrefix(country: number) {
		const selectedContry = this.residentOpt.find((c) => c.value === country);
		this.iconName = selectedContry.icon;
		this.phonecodeCountry = selectedContry.phonecode;
	}

	private getCivilStatus() {
		this.newPartnerGeneralInfoService
			.getCivilstatus()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => (this.civilStateOpt = civilStatus))
			)
			.subscribe();
	}

	/* === Events === */
	public onSubmit() {
		var date = new Date(this.form.value.bornDate),
			mnth = ('0' + (date.getMonth() + 1)).slice(-2),
			day = ('0' + date.getDate()).slice(-2),
			birthDate = [date.getFullYear(), mnth, day].join('-');

		let param = {
			typeUser: '2',
			idSponsor: this.idSponsor,
			user: {
				name: this.form.value.names,
				lastName: this.form.value.lastnames,
				birthDate: birthDate,
				gender: this.form.value.gender,
				idNationality: this.form.value.nationality,
				nroDocument: this.form.value.docNumber,
				email: this.form.value.email,
				districtAddress: this.form.value.district,
				address: this.form.value.address,
				idResidenceCountry: this.form.value.country,
				civilState: this.form.value.civilState,
				nroPhone: this.form.value.phone,
				idTypeDocument: this.form.value.docType,
				idState: 1,
				coAffiliate: {},
				typeUser: '2',
				idSponsor: this.idSponsor,
				userRegistrarionRequest: {}
			}
		};

		this.__transferLiquidationService
			.saveNewUser(param)
			.pipe(catchError((err) => of([])))
			.subscribe({
				next: (data) => {
					if (data.result) {
						this.saveTransferLiquidation(data.data.id);
					} else {
						console.error('Data not registered');
					}
				},
				error: (error) => {
					console.error('Error Data Users:', error);
				}
			});
		//this.instanceModel.close();
		//this.submit.emit();
	}

	checkDocument() {
		const nroDocument = this.form.value.docNumber;
		this.__newPartnerService
			.checkDocument(nroDocument, 0, 0)
			.pipe(
				tap((response: any) => {
					if (response.result && response.data) {
						const documentControl = this.form.get('docNumber');
						documentControl.setErrors({ documentExists: true });
					} else {
						const documentControl = this.form.get('docNumber');
						documentControl.setErrors(null);
					}
				})
			)
			.subscribe();
	}

	checkEmail() {
		const email = this.form.value.email;
		this.__newPartnerService
			.checkEmail(email)
			.pipe(
				tap((response: any) => {
					if (response.result && response.data) {
						const gmailControl = this.form.get('email');
						gmailControl.setErrors({ emailExists: true });
					} else {
						const documentControl = this.form.get('email');
						documentControl.setErrors(null);
					}
				})
			)
			.subscribe();
	}

	public saveTransferLiquidation(idNewUser: number) {
		let detail = [];
		if (this.selectedMembership.id == undefined) {
			this.membership.forEach((e: any) => {
				detail.push({
					idPackage: e.pack.idPackage,
					idSuscription: e.id,
					idPaymentLog: null,
					creationUser: this.currentUser.username
				});
			});
		} else {
			detail.push({
				idPackage: this.selectedMembership.pack.idPackage,
				idSuscription: this.selectedMembership.id,
				idPaymentLog: null,
				creationUser: this.currentUser.username
			});
		}
		let body = {
			transfer: {
				idUserOld: this.currentUser.id,
				idUserNew: idNewUser,
				idPerfil: '1',
				idSponsor: this.idSponsor,
				idStatus: '3',
				idTypeTransfer: this.idTypeTransfer,
				creationUser: this.currentUser.username
			},
			lstDetailTransfer: detail
		};
		this.__transferLiquidationService
			.saveTransfer(body)
			.pipe(catchError((err) => of([])))
			.subscribe({
				next: (data) => {
					if (data?.data.idTransfer > 0) {
						if (this.selectedMembership != null) {
							this.typeTransfer = 'suscripción';
							this.onShowModal(this.typeTransfer);
						} else {
							this.typeTransfer = 'membresia';
							this.onShowModal(this.typeTransfer);
						}
					} else {
						console.error('Data not registered');
					}
				},
				error: (error) => {
					console.error('Error Data Users:', error);
				}
			});
	}

	onShowModal(typeTransfer: string) {
		this.instanceModal.close();
		const ref = this.modal.open(ModalSuccessTransferComponent, {
			centered: true
		});
		const modal = ref.componentInstance as ModalSuccessTransferComponent;
		modal.typeTransfer = typeTransfer;
	}

	public getSuscriptionByIdUser() {
		this.__transferLiquidationService
			.getSuscriptionByIdUser(this.currentUser.id)
			.pipe(catchError((err) => of([])))
			.subscribe({
				next: (data) => {
					if (data?.length > 0) {
						data.forEach((obj: any) => {
							obj.content = obj.pack.name;
							obj.value = obj.id;
						});
						this.membership = data;
					} else {
						console.error('No data found for subscription');
					}
				},
				error: (error) => {
					console.error('Error Data Subscription:', error);
				}
			});
	}
}
