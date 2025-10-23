import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { InlineSVGModule } from 'ng-inline-svg-2';
import { ReactiveFormsModule } from '@angular/forms';

import { TableComponent } from './components/table/table.component';
import { ModalComponent } from './components/modal/modal.component';

import { ToastManagerComponent } from './components/toast-manager/toast-manager.component';
import { DurationPipe } from './pipes/duration.pipe';
import { InputErrorPipe } from './pipes/input-error/input-error.pipe';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TitleCasePipe } from './pipes/title-case/title-case.pipe';
import { SplitMillionsThousandsPipe } from './pipes/split-millions-units/split-millions-units.pipe';
import { SplitHundredsUnitsPipe } from './pipes/split-hundreds-units/split-hundreds-units.pipe';
import { NumberToTextPipe } from './pipes/number-to-text/number-to-text.pipe';

@NgModule({
	declarations: [TableComponent, ToastManagerComponent, DurationPipe, TitleCasePipe, SplitMillionsThousandsPipe, SplitHundredsUnitsPipe, NumberToTextPipe],
	imports: [
		CommonModule,
		InlineSVGModule,
		ReactiveFormsModule,
		NgbTooltipModule,
		InputErrorPipe,
		ModalComponent
	],
	exports: [TableComponent, ToastManagerComponent, DurationPipe, ModalComponent, TitleCasePipe, SplitMillionsThousandsPipe, SplitHundredsUnitsPipe, NumberToTextPipe],
	providers: [CurrencyPipe]
})
export class SharedModule { }
