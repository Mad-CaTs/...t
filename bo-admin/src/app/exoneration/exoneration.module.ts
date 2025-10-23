import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ExonerationRoutingModule } from './exoneration-routing.module';
import { TableExonerationValidatorComponent } from './components/table-exoneration-validator/table-exoneration-validator.component';
import { TableExonerationHistoricalComponent } from './components/table-exoneration-historical/table-exoneration-historical.component';

import { HistoricalComponent, ValidatorComponent } from './pages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
	declarations: [
		ValidatorComponent,
		HistoricalComponent,
		TableExonerationValidatorComponent,
		TableExonerationHistoricalComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ExonerationRoutingModule,
		FormControlModule,
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ReactiveFormsModule
	]
})
export class ExonerationModule { }