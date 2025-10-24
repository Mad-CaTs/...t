import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileComponent } from '@shared/components/form-control/file/file.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { ISelect } from '@shared/interfaces/forms-control';
import { Subject, takeUntil, tap } from 'rxjs';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { NewPartnerGeneralInfoService } from 'src/app/profiles/pages/ambassador/pages/new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';

@Component({
	selector: 'app-upload-documents',
	standalone: true,
	imports: [CommonModule, SelectComponent, InputComponent, FileComponent],
	templateUrl: './upload-documents.component.html',
	styleUrl: './upload-documents.component.scss'
})
export class UploadDocumentsComponent {
	@Input() isLegalization: boolean = false;
	@Input() form!: FormGroup;
	public documentTypeList: ISelect[];
	/*  form: FormGroup
	 */ private destroy$: Subject<void> = new Subject<void>();
	public idCountry: any;
	isDocumentLoading: boolean = false;
	@Output() formValidityChanged = new EventEmitter<boolean>();
	@Output() formDataChanged = new EventEmitter<{ value: any; valid: boolean }>();

	constructor(
		private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
		private fb: FormBuilder,
		private userInfoService: UserInfoService
	) {
		this.idCountry = this.userInfoService.userInfo.idResidenceCountry;
	}
	ngOnInit(): void {
		this.loadDocumentTypes();
		this.subscribeToFormChanges();
		this.emitInitialFormState();
	}

	private loadDocumentTypes() {
		this.getDocumentType(this.idCountry);
	}

	private subscribeToFormChanges() {
		this.form.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
			const isValid = this.form.valid;
			this.formValidityChanged.emit(isValid);
			if (isValid) {
				this.formDataChanged.emit({
					value: this.form.value,
					valid: true
				});
			}
		});
	}

	private emitInitialFormState() {
		if (this.form.valid) {
			this.formValidityChanged.emit(true);
			this.formDataChanged.emit({
				value: this.form.value,
				valid: true
			});
		}
	}

	public getDocumentType(idCountry: number) {
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
}
