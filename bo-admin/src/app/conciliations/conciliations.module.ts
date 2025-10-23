import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ConciliationsRoutingModule } from './conciliations-routing.module';
import { TableConciliationValidatorComponent } from './components/table-conciliation-validator/table-conciliation-validator.component';
import { TableConciliationHistoricalComponent } from './components/table-conciliation-historical/table-conciliation-historical.component';

import { HistoricalComponent, ValidatorComponent } from './pages';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ArrayDatePipe } from '@shared/pipes/array-date.pipe';


@NgModule({
	declarations: [
		ValidatorComponent,
		HistoricalComponent,
		TableConciliationValidatorComponent,
		TableConciliationHistoricalComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		ArrayDatePipe,
		ConciliationsRoutingModule,
		FormControlModule,
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ReactiveFormsModule
	],
	
})

export class ConciliationsModule { }