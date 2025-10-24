import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DropdownModule } from 'primeng/dropdown';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { INewPartnerStep1Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { ISelect } from '@shared/interfaces/forms-control';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ConciliationService } from '../../../payments-and-comissions/pages/conciliation/commons/services/conciliation.service';
import { DialogService } from 'primeng/dynamicdialog';
import { VariableSharingService } from 'src/app/profiles/pages/partner/pages/my-products/commons/services/variable-sharing.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime, filter, switchMap, tap } from 'rxjs';
import { NationalityStateService } from '../../commons/services/nationality-state.service';

@Component({
	selector: 'app-new-partner-general-info-component',
	standalone: true,
	imports: [
		CommonModule,
		MatIconModule,
		ReactiveFormsModule,
		RadiosComponent,
		SelectComponent,
		InputComponent,
		DateComponent,
		DropdownModule,
		FormsModule
	],
	templateUrl: './new-partner-general-info.component.html',
	styleUrls: []
})
export class NewPartnerGeneralInfoComponent implements OnInit {
	@Input() form: FormGroup;
	@Input() registerTypeList: ISelect[];
	@Input() nationalitiesList: ISelect[];
	@Input() civilStateList: ISelect[];
	@Input() documentTypeList: ISelect[];
	@Input() isMultiUsuario: boolean;
	@Input() genderList: ISelect[];
	@Input() isDocumentLoading: boolean = false;
	@Input() isToken: boolean;
	@Output() nextStep = new EventEmitter<INewPartnerStep1Data>();
	@Output() onChangeNationality = new EventEmitter<number>();
	@Output() familyPackagesChanged = new EventEmitter<any[]>();
	@Output() openCoAffiliateModal = new EventEmitter();
	@Output() deleteCoRequester = new EventEmitter();
	@Output() onCheckDocumentExists = new EventEmitter<void>();
	@Output() changeTypeUser = new EventEmitter<string>();
	@Output() prevState = new EventEmitter();
	public sponsorId: number = this.userInfoService.userInfo.id;
	public disabledUser: boolean = this.userInfoService.disabled;
	@Input() coRequesterData;
	maxBirthDate: Date;

	constructor(
		private http: HttpClient,
		public userInfoService: UserInfoService,
		private conciliationService: ConciliationService,
		private dialogService: DialogService,
		private variableSharingService: VariableSharingService,
		private nationalityState: NationalityStateService
	) {}

	ngOnInit(): void {
		this.listeningChangeNationality();
		//this.verifyWallet();
		this.listenForDniChanges();
		this.maxBirthDate = new Date();
		this.maxBirthDate.setFullYear(this.maxBirthDate.getFullYear() - 18);
	}

	verifyWallet() {
		this.conciliationService.getConciliationPendingByUserId(this.sponsorId).subscribe({
			next: (check) => {
				this.variableSharingService.setData({
					walletBlock: check.data
				});
				if (check.data) {
					this.dialogService.open(ModalSuccessComponent, {
						header: '',
						data: {
							text: 'Para habilitar wallet, falta subir conciliación.',
							title: '¡Alerta!',
							icon: 'assets/icons/Inclub.png'
						}
					});
				}
			}
		});
	}

	onNextStep() {
		this.nextStep.emit();
	}

	listeningChangeNationality() {
		this.form
			.get('idNationality')
			.valueChanges.pipe(
				tap((idCountry: number) => {
					if (idCountry) {
						this.onChangeNationality.emit(idCountry);
						this.nationalityState.setNationality(idCountry);
					}
				})
			)
			.subscribe({
				error: (err) => {
					console.error('[GENERAL-INFO] Error:', err);
				}
			});
	}

	listenForDniChanges(): void {
		console.log('CONTROLES DISPONIBLES:', this.form.controls);

		const documentControl = this.form.get('nroDocument');
		if (!documentControl) {
			console.error("No se encontró el control 'documentNumber'. Si el error sigue, el nombre es otro. Revisa la lista de controles en la consola.");
			return;
		}
		//AQUI VALIDAMOS EL DNI
		documentControl.valueChanges
			.pipe(
				// pcheti de mrcoles no me dice donde trabajar
				debounceTime(500),
				filter((dni) => dni && String(dni).trim().length === 8),
				tap((dni) => console.log(`Iniciando validación para el DNI: ${dni}`)),
				switchMap((dni) => {
					const url = `https://collaboratorsapi-dev.inclub.world/api/collaborators/validate/${dni.trim()}`;
					return this.http.get<any>(url);
				}),
				tap((response) => {
					if (response && response.collaborator === true) {
						console.log('¡Colaborador encontrado!', response);
						this.variableSharingService.setData({ collaboratorData: response });
					} else {
						console.log('El DNI no corresponde a un colaborador.');
						this.variableSharingService.setData({ collaboratorData: null });
					}
				})
			)
			.subscribe();
	}

	checkDocumentExists(exists: boolean): void {
		this.onCheckDocumentExists.emit();
	}

	onClickOpenCoAffiliateModal() {
		this.openCoAffiliateModal.emit();
	}

	onDeleteCoRequester() {
		this.form.get('coAffiliateData').setValue(null);
		this.deleteCoRequester.emit();
	}

	getDocumentDescription(id: number) {
		return this.documentTypeList?.find((doc) => doc.value === id)?.content;
	}

	onChangeTypeUser(value: string) {
		this.changeTypeUser.emit(value);
	}

	removeSpaces(event: any): void {
		const input = event.target as HTMLInputElement;
		input.value = input.value.replace(/\s+/g, '');
	}
}
