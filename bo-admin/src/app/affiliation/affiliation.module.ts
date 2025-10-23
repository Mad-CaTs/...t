import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FormControlModule } from "@shared/components/form-control/form-control.module";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { ModalComponent } from "@shared/components/modal/modal.component";
import { SharedModule } from "@shared/shared.module";
import { InlineSVGModule } from "ng-inline-svg-2";
import { AffiliationRoutingModule } from "./affiliation-routing.module";

@NgModule({
	declarations: [
	],
	imports: [
		CommonModule,
        AffiliationRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		InlineSVGModule,
		FormControlModule,
		FormsModule,
		ModalComponent,
		LoadingComponent
	],
	exports: [
	]
})
export class AffiliationModule {}