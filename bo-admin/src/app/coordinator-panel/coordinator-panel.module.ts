import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from '@shared/shared.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { CoordinatorPanelRoutingModule } from './coordinator-panel-routing.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		CoordinatorPanelRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ModalComponent,
		LoadingComponent
	],
	exports: []
})
export class CoordinatorPanelModule {}
