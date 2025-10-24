import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StepsModule } from 'primeng/steps';

@Component({
	selector: 'app-step-progress',
	standalone: true,
	imports: [CommonModule, StepsModule],
	templateUrl: './step-progress.component.html',
	styleUrl: './step-progress.component.scss'
})
export class StepProgressComponent {
	@Input() enabledSteps: number[] = [];
	@Input() activeIndex: number = 0;
	@Input() stepLabels: string[] = [];
	@Output() stepChange = new EventEmitter<number>();

	selectStep(index: number) {
		this.stepChange.emit(index);
	}
}
