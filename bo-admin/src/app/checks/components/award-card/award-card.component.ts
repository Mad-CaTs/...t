import { CommonModule } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormControlModule } from '@shared/components/form-control/form-control.module';
import { ModalComponent } from '@shared/components/modal/modal.component';
import { NumberToTextPipe } from '@shared/pipes/number-to-text/number-to-text.pipe';
import { SharedModule } from '@shared/shared.module';
import { InlineSVGModule } from 'ng-inline-svg-2';

@Component({
	selector: 'app-award-card',
	templateUrl: './award-card.component.html',
	styleUrls: ['./award-card.component.scss'],
	standalone: true,
	imports: [CommonModule, SharedModule]
})
export class AwardCardComponent {
	@Input() name: string = '';
	@Input() lastname: string = '';
	@Input() amount: number = 0;
	@Input() amountText: string = '';
	@Input() clubName: string = '';

	get headerClass(): string {
		switch (this.clubName.toLowerCase()) {
			case 'club 1m':
				return 'club-1m-bg';
			case 'club 500k':
				return 'club-500k-bg';
			case 'club 250k':
				return 'club-250k-bg';
			case 'club 100k':
				return 'club-100k-bg';
			case 'club 50k':
				return 'club-50k-bg';
			case 'club 25k':
				return 'club-25k-bg';
			case 'club 10k':
				return 'club-10k-bg';
			default:
				return '';
		}
	}

	get textColorClass(): string {
		switch (this.clubName.toLowerCase()) {
			case 'club 1m':
				return 'club-1m-color';
			case 'club 500k':
				return 'club-500k-color';
			case 'club 250k':
				return 'club-250k-color';
			case 'club 100k':
				return 'club-100k-color';
			case 'club 50k':
				return 'club-50k-color';
			case 'club 25k':
				return 'club-25k-color';
			case 'club 10k':
				return 'club-10k-color';
			default:
				return '';
		}
	}
}
