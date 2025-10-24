import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountTypeOptMock, BankNameOptMock, NavigationMock, OpCountryOptMock } from './_mock';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITableBankData } from '../../../../../commons/interfaces/account';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { NavigationComponent } from '@shared/components/navigation/navigation.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-account-edit-bank-data-modal',
	standalone: true,
	imports: [
		CommonModule,
		ModalComponent,
		MatIconModule,
		ReactiveFormsModule,
		InputComponent,
		SelectComponent,
		NavigationComponent
	],
	templateUrl: './account-edit-bank-data-modal.component.html',
	styleUrls: [],
	providers: [DialogService]
})
export class AccountEditBankDataModalComponent implements OnInit {
	@Input() data: ITableBankData | null = null;

	public form: FormGroup;
	public step: number = 1;
	public navigation = NavigationMock;
	public currentSection = 1;

	/*Selects */
	public bankNameOpt = BankNameOptMock;
	public opCOuntryOpt = OpCountryOptMock;
	public accountTypeOpt = AccountTypeOptMock;

	constructor(
		public instanceModal: NgbActiveModal,
		private modal: NgbModal,
		private iconRegister: MatIconRegistry,
		private sanitazer: DomSanitizer,
		private builder: FormBuilder,
		private dialogService: DialogService
	) {
		iconRegister.addSvgIcon(
			'transaction-money',
			sanitazer.bypassSecurityTrustResourceUrl('assets/icons/transaction-money.svg')
		);

		this.form = builder.group({
			bank: [0, [Validators.required, Validators.min(1)]],
			opCountry: [0, [Validators.required, Validators.min(1)]],
			bankAddress: ['', [Validators.required]],
			swift: ['', [Validators.required, Validators.minLength(4)]],
			iban: ['', [Validators.required, Validators.minLength(4)]],
			/* Account */
			accountNumber: ['', [Validators.required, Validators.minLength(4)]],
			cci: ['', [Validators.required, Validators.minLength(7)]],
			accountType: [1, [Validators.required, Validators.min(1)]],
			/* Owner */
			ownerBankAccount: ['', [Validators.required, Validators.minLength(4)]],
			contribuyerNumber: ['', [Validators.required, Validators.minLength(4)]],
			businessName: ['', [Validators.required, Validators.minLength(4)]],
			fiscalAddress: ['', [Validators.required, Validators.minLength(4)]]
		});
	}

	ngOnInit(): void {
		if (!this.data) return;

		const { bankName, opCountry, bankAddress, accountNumber, cci, ownerFullname } = this.data;

		const bank = this.bankNameOpt.find((b) => b.content === bankName).value;
		const country = this.opCOuntryOpt.find((c) => c.content === opCountry).value;

		this.form.setValue({
			bank,
			opCountry: country,
			bankAddress,
			swift: '181818AA',
			iban: '48181aA',
			accountNumber,
			cci,
			accountType: 1,
			ownerBankAccount: ownerFullname,
			contribuyerNumber: 'Pepito Alfonso',
			businessName: 'Pepito S.A.C',
			fiscalAddress: 'Adrees fiscal'
		});
		this.step = 2;
	}

	/* === Events === */
	public onSubmit() {
		this.instanceModal.close();

		this.dialogService.open(ModalSuccessComponent, {
			header: '',
			data: {
				text: this.data ? 'La cuenta  se edito con éxito' : 'La cuenta  se agrego con éxito',
				title: 'Exito!',
				icon: 'check_circle_outline'
			}
		});
	}

	get title() {
		if (!this.data && this.step === 1) return 'Importante';

		if (!this.data && this.step === 2) return 'Añadir cuenta';

		return 'Editar cuenta';
	}
}
