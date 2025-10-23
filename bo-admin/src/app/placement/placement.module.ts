import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { PlacementRoutingModule } from './placement-routing.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		PlacementRoutingModule,
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
export class PlacementModule {}
