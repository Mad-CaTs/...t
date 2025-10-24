import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { WalletService } from '../../../../../services/wallet.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { IElectronicPurse } from '../../../../../interfaces/wallet.interface';
import { ISelect } from '@shared/interfaces/forms-control';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ModalLoadingComponent } from '@shared/components/modal/modal-loading/modal-loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-wallet-detail-request-transfer',
	templateUrl: './modal-wallet-detail-request-transfer.component.html',
	standalone: true,
	providers: [DialogService],
	imports: [
		CommonModule,
		SelectComponent,
		InputComponent,
		ModalComponent,
		ModalSuccessComponent,
		FileComponent,
		ModalLoadingComponent
	],
	styleUrls: []
})
export class ModalWalletDetailRequestTransferComponent {
	public form: FormGroup;
	public file: File | null = null;
	public data: any;
	public idUser = this.userInfoService.userInfo.id;
	public loading = false;
	public optDestinyAccount;

	@Output() resultEmitter = new EventEmitter<string>();

	constructor(
		public instanceModal: NgbActiveModal,
		private walletService: WalletService,
		public userInfoService: UserInfoService,
		private formBuilder: FormBuilder,
		private dialogService: DialogService,
		private router: Router
	) {
		this.form = formBuilder.group({
			destinyAccount: [0],
			amount: [0, [Validators.required, Validators.min(0.01)]],
			file: [null],
			description: ['', [Validators.required]]
		});
	}

	ngOnInit(): void {
		this.getElectronicPurse(this.idUser);
	}

	onSubmit(): void {
		const fileControlValue = this.form.get('file')?.value;

		this.file = fileControlValue;

		this.data = {
			idUser: this.idUser,
			idElectronicPurse: this.form.get('destinyAccount').value,
			description: this.form.get('description').value,
			walletTransaction: {
				initialDate: '2024-05-08T11:30:00',
				amount: this.form.get('amount').value
			}
		};
		this.postSolicitTransferElectronic(this.file, this.data);
	}

	postSolicitTransferElectronic(file: File | null, data: any): void {
		this.loading = true;

		const loadingRef = this.dialogService.open(ModalLoadingComponent, {
			header: 'Cargando',
			closable: false
		});

		if (file) {
			this.walletService.postSolicitTransfer(file, data).subscribe(
				(response) => {
					loadingRef.close();

					this.dialogService
						.open(ModalSuccessComponent, {
							header: '',
							data: {
								text: 'Tu transferencia fue registrada con éxito.',
								title: '¡Éxito!',
								icon: 'check_circle_outline'
							}
						})
						.onClose.pipe(
							tap(() => {
								this.instanceModal.close();
								this.resultEmitter.emit('success');
							})
						)
						.subscribe();
				},
				(error) => {
					loadingRef.close();
					this.loading = false;
					console.error('Error', error);
				}
			);
		} else {
			loadingRef.close();
			this.loading = false;
			console.error('No file selected');
		}
	}

	getElectronicPurse(id: number): void {
		this.walletService.getElectronicPurse(id).subscribe(
			(response: IElectronicPurse[]) => {
				const selectOptions: ISelect[] = response.map((item) => ({
					value: item.idElectronicPurse,
					content: item.userNameAccount
				}));
				this.optDestinyAccount = selectOptions;
			},
			(error) => {
				console.error('Error', error);
			}
		);
	}
}
