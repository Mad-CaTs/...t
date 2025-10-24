import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef, DynamicDialogConfig, DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { PointRangesData } from 'src/app/profiles/pages/ambassador/pages/tree/pages/range-manager/commons/interfaces';
import { TableModule } from 'primeng/table';
import { TableService } from 'src/app/profiles/pages/ambassador/commons/services/table/table.service';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { Router } from '@angular/router';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { BorderedTableComponent } from '@shared/components/bordered-table/bordered-table.component';
import { LegalizationNoticeModal } from '../app-legalization-notice-modal/app-legalization-notice-modal.component';
import { LEGALIZATION_ALERT_MESSAGE } from '../../../../../constants';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
	selector: 'app-modal-register-authorized-person',
	standalone: true,
	providers: [MessageService],
	imports: [
		CommonModule,
		MatIconModule,
		DialogModule,
		ToastModule,
		MatIconModule,
		InputComponent,
		ReactiveFormsModule,
		DateComponent,
		FileComponent,
		SelectComponent
	],
	templateUrl: './register-authorized-person.html',
	styleUrl: './register-authorized-person.scss'
})
export class ModalRegisterAuthorizedPerson implements OnInit {
	form!: FormGroup;
	isEdit: boolean = false;
	public documentTypeList: ISelect[];
	private destroy$: Subject<void> = new Subject<void>();
	public idCountry: any;

	constructor(
		public ref: DynamicDialogRef,
		public config: DynamicDialogConfig,
		public tableService: TableService,
		private router: Router,
		private fb: FormBuilder,
		private dialogService: DialogService,
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private userInfoService: UserInfoService
	) {
		this.idCountry = this.userInfoService.userInfo.idResidenceCountry;
	}

	ngOnInit(): void {
		this.initData();
		this.isEdit = !!this.config.data;
		console.log('Valor inicial de documentId:', this.form.get('documentId')?.value);
	}

	initData() {
		this.buildForm();
		this.getDocumentType(this.idCountry);
	}

	private buildForm(): void {
		const data = this.config.data;

		this.form = this.fb.group({
			name: [data?.name || '', Validators.required],
			lastName: [data?.lastName || '', Validators.required],
			fecha: [data?.fecha ? new Date(data.fecha) : '', Validators.required],
			documentFile: [data?.documentFile || '', Validators.required],
			documentId: [data?.documentId || null, Validators.required],
			nroDocument: [
				data?.nroDocument || '',
				[
					Validators.required,
					Validators.pattern(/^\d+$/),
					Validators.minLength(8),
					Validators.maxLength(12)
				]
			]
		});
	}

	closeModal() {
		this.ref.close();
	}

	beforeSubmit() {
		if (this.isEdit) {
			this.onSubmit();
			return;
		}
		const width = window.innerWidth < 768 ? '90vw' : '40vw';
		this.dialogService
			.open(LegalizationNoticeModal, {
				width: width,
				closable: false,
				dismissableMask: false,
				data: {
					title: '¡Importante!',
					message: LEGALIZATION_ALERT_MESSAGE,
					buttonText: 'Entendido',
					returnValue: 'entendido'
				}
			})
			.onClose.subscribe((res) => {
				if (res === 'entendido') {
					this.onSubmit();
				}
			});
	}
	onSubmit() {
		if (this.form.invalid) return;

		const selectedDoc = this.documentTypeList.find((doc) => doc.value === this.form.value.documentId);

		this.ref.close({
			...this.form.value,
			documentType: selectedDoc
		});
	}

	/* onSubmit() {
		if (this.form.invalid) return;

		this.ref.close(this.form.value);
	} */

	public getDocumentType(idCountry: number) {
		this.newPartnerGeneralInfoService
			.getDocumentType(idCountry)
			.pipe(
				takeUntil(this.destroy$),
				tap((documentTypes) => {
					this.documentTypeList = documentTypes;
					console.log('documentTypeList', this.documentTypeList);
				})
			)
			.subscribe();
	}
}
