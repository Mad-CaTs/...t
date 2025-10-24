import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { INewPartnerStep2Data } from '../../../../commons/interfaces/new-partner.interfaces';
import { ISelect } from '@shared/interfaces/forms-control';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DateComponent } from '@shared/components/form-control/date/date.component';
import { PhoneComponent } from '@shared/components/form-control/phone/phone.component';
import { CellFieldComponent } from '@shared/components/form-control/cell-field/cell-field.component';
import { NewPartnerContactInfoComponent } from './new-partner-contact-info.component';
import { NewPartnerContactInfoService } from './commons/services/new-partner-contact-info.service';
import { tap } from 'rxjs';
import { NewPartnerService } from '../../commons/services/new-partner.service';
import { INewUserPromotorData } from '../../commons/interfaces/new-partner.interface';

@Component({
	selector: 'app-new-partner-contact-info',
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatIconModule,
		InputComponent,
		SelectComponent,
		DateComponent,
		PhoneComponent,
		CellFieldComponent,
		NewPartnerContactInfoComponent
	],
	templateUrl: './new-partner-contact-info.container.html',
	styleUrls: []
})
export class NewPartnerContactInfoContainer {
	@Input() registerTypeControl = new FormControl(1);
	@Input() isPromotor: boolean;

	@Output() submit = new EventEmitter<INewPartnerStep2Data>();
	@Output() prevState = new EventEmitter<void>();
	@Output() onCheckEmailExists = new EventEmitter<boolean>();
	@Output() saveNewUserPromotor = new EventEmitter<INewUserPromotorData>();
	/* 	public currentStep: number = 1;
	 */
	optNationalities: ISelect[];

	@Input() form: FormGroup;
	@Output() familyPackagesChanged = new EventEmitter<any[]>();
	@Output() onChangeResidency = new EventEmitter<number>();
	maxBirthDate!: Date;

	constructor(private newPartnerService: NewPartnerService) {}

	ngOnInit(): void {
		this.newPartnerService
			.getCountriesList()
			.pipe(
				tap((paises) => {
					this.optNationalities = paises.map((pais) => {
						return { content: pais.nicename, value: pais.icon, ...pais };
					});
				})
			)
			.subscribe();
		this.maxBirthDate = new Date();
		this.maxBirthDate.setFullYear(this.maxBirthDate.getFullYear() - 18);
	}

	ngOnChanges(): void {}

	onSubmit() {
		this.submit.emit();
	}

	onSaveNewUserPromotor() {
		this.saveNewUserPromotor.emit();
	}

	onFamilyPackagesChange(packages: any[]): void {
		this.familyPackagesChanged.emit(packages);
	}

	onResidencyChange(idResidency: number): void {
		this.onChangeResidency.emit(idResidency);
	}

	public checkEmailExists(): void {
		const email = this.form.get('email').value;
		if (email) {
			this.newPartnerService
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
	}

	onPrevState(): void {
		this.prevState.emit();
	}
}
