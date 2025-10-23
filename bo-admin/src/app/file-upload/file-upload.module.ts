import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { FileUploadRoutingModule } from './file-upload-routing.module';

@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		FileUploadRoutingModule,
		SharedModule,
		ReactiveFormsModule,
		InlineSVGModule,
		ModalComponent,
		FormControlModule,
		FormsModule
	],
	providers: [CurrencyPipe]
})
export class FileUploadModule {}
