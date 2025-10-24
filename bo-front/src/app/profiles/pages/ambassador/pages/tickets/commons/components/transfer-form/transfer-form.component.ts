import { CommonModule } from '@angular/common';
import {
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	SimpleChanges
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { NewPartnerGeneralInfoService } from '../../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { merge, Subject, takeUntil, tap } from 'rxjs';
import { NewPartnerService } from '../../../../new-partner/commons/services/new-partner.service';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { Nationality } from '../../../../new-partner/commons/interfaces/new-partner.interface';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalLocationComponent } from '../../../../new-partner/pages/new-partner-contact-info/commons/modals/modal-location/modal-location.component';
import { TransferFormPresenter } from '../../../pages/transfer-detail/transfer-form.presenter';
import { ITransferUserData } from '../../../pages/commons/interfaces';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { UserResponse } from 'src/app/authentication/commons/interfaces/authenticate.interface';
import { InputComponent } from '@shared/components/form-control/input/input.component';

@Component({
	selector: 'app-transfer-form',
	standalone: true,
	imports: [CommonModule, SelectComponent, InputComponent, DateComponent, AutoCompleteModule],
	templateUrl: './transfer-form.component.html',
	styleUrl: './transfer-form.component.scss'
})
export default class TransferFormComponent implements OnInit {
	@Input() form: FormGroup;
	@Output() formChange = new EventEmitter<any>();
	@Input() selectedId: any;
	public documentTypeList: ISelect[];
	public civilStateList: ISelect[];
	private destroy$: Subject<void> = new Subject<void>();
	public nationalitiesList: any[] = [];
	public genderList: ISelect[] = [];
	public residentOpt: Nationality[] = [];
	@Input() initialData: any;
	@Input() sponsorInfo: ITransferUserData;
	@Output() search = new EventEmitter<string>();
	public selectedUser: any = null;
	@Input() searchResults: any[] = [];
	@Input() membershipList: ISelect[] = [];
	selectedMembership: any;
	@Input() loading: boolean = false;
	@Input() multicodeListOpt: ISelect[] = [];
	public iconName: string = '';
	public phonecodeCountry: string = '';
	@Input() existingUserData: any;
	@Input() userInfo: UserResponse;
	@Output() onCheckEmailExists = new EventEmitter<boolean>();
	@Input() isDocumentLoading: boolean = false;
	@Output() onCheckDocumentExists = new EventEmitter<void>();

	constructor(
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private newPartnerService: NewPartnerService,
		private modal: NgbModal,
		private cdr: ChangeDetectorRef
	) {}

	ngOnInit(): void {
		this.getCivilStatus();
		this.getNationalities();
		this.getGender();
		this.getResident();
		this.emitForm();
		this.listenMembershipChanges();
		this.form.get('country')?.valueChanges.subscribe((selectedId) => {
			this.setPhonePrefix(selectedId);
		});
		this.handleCase4User();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['selectedId'] && !changes['selectedId'].firstChange) {
			this.selectedMembership = null;
		}

		if (changes['initialData'] && this.initialData) {
			const dataToPatch = this.initialData.value ?? this.initialData;

			const nroDocErrors = this.form.get('nroDocument')?.errors;
			const emailErrors = this.form.get('email')?.errors;

			const patch = { ...dataToPatch };
			delete patch.membership;
			delete patch.transferProfileId;

			this.form.patchValue(patch, { emitEvent: false });

			if (nroDocErrors) this.form.get('nroDocument')?.setErrors(nroDocErrors);
			if (emailErrors) this.form.get('email')?.setErrors(emailErrors);
		}

		if (this.selectedId === 4 && this.existingUserData) {
			const user = Array.isArray(this.existingUserData)
				? this.existingUserData[0]
				: this.existingUserData;

			if (user) {
				this.form.patchValue(
					{
						name: user.name || '',
						lastname: user.lastName || '',
						idDocument: user.idDocument || '',
						nroDocument: user.nroDocument || ''
					},
					{ emitEvent: false }
				);

				this.form.get('name')?.disable();
				this.form.get('lastname')?.disable();
				this.form.get('idDocument')?.disable();
				this.form.get('nroDocument')?.disable();
			}
		}
	}

	emitForm(): void {
		this.form.valueChanges.subscribe((value) => {
			const selectedMembership = this.membershipList.find((m) => m.value === value.membership);
			const selectedTransferProfile = this.multicodeListOpt.find(
				(p) => p.value === value.transferProfileId
			);

			this.formChange.emit({
				value: {
					...this.form.getRawValue(),
					membership: selectedMembership ? selectedMembership : null,
					transferProfileId: selectedTransferProfile ? selectedTransferProfile : null
				},
				valid: this.form.valid
			});
		});
	}

	private handleCase4User(): void {
		if (this.selectedId === 4) {
			this.getDocumentType(this.userInfo.idNationality);
		}
	}

	removeSpaces(event: any): void {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\s+/g, '');
	}

	private listenMembershipChanges(): void {
		this.form.get('membership')?.valueChanges.subscribe((value) => {
			this.selectedMembership = this.membershipList.find((m) => m.value === value);
		});
	}

	private getCivilStatus() {
		this.newPartnerGeneralInfoService
			.getCivilstatus()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => (this.civilStateList = civilStatus))
			)
			.subscribe();
	}
	getDocumentType(eventOrId: any) {
		const idCountry = eventOrId?.idCountry ?? eventOrId;
		this.newPartnerGeneralInfoService
			.getDocumentType(idCountry)
			.pipe(
				takeUntil(this.destroy$),
				tap((documentTypes) => {
					this.documentTypeList = documentTypes;
				})
			)
			.subscribe();
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

	private getGender() {
		this.newPartnerGeneralInfoService
			.getGender()
			.pipe(
				takeUntil(this.destroy$),
				tap((civilStatus) => (this.genderList = civilStatus))
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

	onSearchUser(event: any) {
		const query = event.query;
		this.search.emit(query);
	}

	setSearchResults(results: any[]) {
		this.searchResults = results;
	}

	onUserSelect(event: any) {
		this.selectedUser = event;
		this.formChange.emit(event);
		this.form.get('searchBy')?.setValue(event, { emitEvent: true });
	}
	setPhonePrefix(country: number) {
		const selectedContry = this.nationalitiesList.find((c) => c.value === country);

		if (selectedContry) {
			this.iconName = selectedContry.icon ?? '';
			this.phonecodeCountry = (selectedContry.symbol ?? '') + (selectedContry.phonecode ?? '');
		} else {
			console.warn('No se encontró el país para el valor', country);
			this.iconName = '';
			this.phonecodeCountry = '';
		}
	}

	onConfirmSelection(): void {
		if (!this.selectedUser) {
			console.warn('Debe seleccionar un usuario');
			return;
		}
		this.formChange.emit(this.selectedUser);
	}

	checkEmailExists(): void {
		const emailControl = this.form.get('email');
		if (emailControl && emailControl.valid) {
			this.onCheckEmailExists.emit();
		} else {
			console.log('Email inválido, no se consulta API');
		}
	}
}
