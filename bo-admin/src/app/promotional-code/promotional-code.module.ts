import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { PromotionalCodeRoutingModule } from './promotional-code-routing.module';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TablesModule } from '@shared/components/tables/tables.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { RequestPromotionalCodeComponent } from './pages/request/request-promotional-code.component';


@NgModule({
	declarations: [
		
	],
	imports: [
		CommonModule,
		SharedModule,
		PromotionalCodeRoutingModule,
		FormControlModule,
		CommonModule,
		TablesModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ReactiveFormsModule,
    RequestPromotionalCodeComponent
	]
})
export class PromotionalCodeModule { }
