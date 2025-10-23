import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { ManageBusinessRoutingModule } from './manage-business-routing.module';

import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		ManageBusinessRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		InlineSVGModule,
		ModalComponent,
		FormControlModule
	],
	providers: [CurrencyPipe]
})
export class ManageBusinessModule { }
