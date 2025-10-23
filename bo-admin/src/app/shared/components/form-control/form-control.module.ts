import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';

import { InputComponent } from './input/input.component';
import { InputDateComponent } from './input-date/input-date.component';
import { InputFileComponent } from './input-file/input-file.component';
import { PasswordFieldComponent } from './password-field/password-field.component';
import { SelectComponent } from './select/select.component';
import { SelectMultipleComponent } from './select-multiple/select-multiple.component';
import { SwitchComponent } from './switch/switch.component';
import { ColorPickerComponent } from './color-picker/color-picker.component';
import { InputDateCalendarDropdownComponent } from './input-date/input-date-calendar-dropdown/input-date-calendar-dropdown.component';
import { InputDateTimeDropdownComponent } from './input-date/input-date-time-dropdown/input-date-time-dropdown.component';
import { SelectMultipleDropdownComponent } from './select-multiple/select-multiple-dropdown/select-multiple-dropdown.component';
import { NgbDropdownModule, NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { InputErrorPipe } from '@shared/pipes/input-error/input-error.pipe';
import { TextAreaComponent } from './textarea/textarea.component';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { MonthPeriodSelectorComponent } from './month-period-selector/month-period-selector.component';

@NgModule({
	declarations: [
		ColorPickerComponent,
		InputComponent,
		InputDateComponent,
		InputFileComponent,
		PasswordFieldComponent,
		SelectComponent,
		SelectMultipleComponent,
		SwitchComponent,
		InputDateCalendarDropdownComponent,
		InputDateTimeDropdownComponent,
		SelectMultipleDropdownComponent,
		SearchableSelectComponent,
		TextAreaComponent,
		MonthPeriodSelectorComponent
	],
	imports: [
		CommonModule,
		InlineSVGModule,
		ReactiveFormsModule,
		ColorPickerModule,
		NgbTooltipModule,
		NgbTypeaheadModule,
		FormsModule,
		InputErrorPipe,
		NgbDropdownModule 
	],
	exports: [
		ColorPickerComponent,
		InputComponent,
		InputDateComponent,
		InputFileComponent,
		PasswordFieldComponent,
		SelectComponent,
		SelectMultipleComponent,
		SearchableSelectComponent,
		MonthPeriodSelectorComponent,
		SwitchComponent,
		TextAreaComponent
	]
})
export class FormControlModule {}
