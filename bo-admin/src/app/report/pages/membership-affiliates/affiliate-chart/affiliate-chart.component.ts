// affiliate-chart.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg-2';

import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

import { ChartOptions } from '../membership-affiliates.component';
import { ISelectOpt } from '@interfaces/form-control.interface';

@Component({
	selector: 'app-affiliate-chart',
	templateUrl: './affiliate-chart.component.html',
	styleUrls: ['./affiliate-chart.component.scss'],
	standalone: true,
	imports: [
		CommonModule,
		ReactiveFormsModule,
		NgApexchartsModule,
		InlineSVGModule,
		FormControlModule,
		MatFormFieldModule,
		MatSelectModule,
		MatOptionModule
	]
})
export class AffiliateChartComponent {
	@Input() form!: FormGroupDirective['form']; // o FormGroup
	@Input() chartOptions!: ChartOptions;
	@Input() exportLabel!: string;
	@Input() exporting = false; // Para el botón de exportar
	@Input() exportFn!: () => void;

	// Para los selects
	@Input() monthOptions!: ISelectOpt[];
	@Input() statusOptions!: ISelectOpt[];
	@Input() thirdSelectLabel!: string;
	@Input() thirdSelectOptions!: ISelectOpt[];
	@Input() thirdSelectControlName!: string;
	@Input() fourthSelectLabel!: string;
	@Input() fourthSelectOptions!: ISelectOpt[];
	@Input() fourthSelectControlName!: string;
}
