import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import ProgressIconComponent from 'src/app/profiles/pages/ambassador/pages/dashboard/pages/primary-and-secondary-profile/commons/components/progress-icon/progress-icon.component';
import { IDataPoints, PointRangesData } from '../../interfaces';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import BoxCycleWeeklyComponent from 'src/app/profiles/pages/ambassador/commons/components/box-cycle-weekly/box-cycle-weekly.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-point-volume-component',
	standalone: true,
	imports: [
		ProgressIconComponent,
		CommonModule,
		MatIconModule,
		ProgressSpinnerModule,
		BoxCycleWeeklyComponent
	],
	templateUrl: './point-volume-component.component.html',
	styleUrl: './point-volume-component.component.scss'
})
export class PointVolumeComponentComponent implements OnInit {
	@Input() pointRangesData: PointRangesData[] = [];
	@Input() isLoading: boolean = false;
	@Input() dataPoints!: IDataPoints;

	ngOnChanges(changes: SimpleChanges) {
		if (changes['pointRangesData'] && changes['pointRangesData'].currentValue) {
		}
	}

	ngOnInit() {}

	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
		this.matIconRegistry.addSvgIcon(
			'award',
			this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/award.svg')
		);
	}
}
