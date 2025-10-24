import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-schedule-detail',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './schedule-detail.component.html',
	styleUrl: './schedule-detail.component.scss'
})
export class ScheduleDetailComponent {
	@Input() title: string = '';
	@Input() iconSvg: string = '';
	@Input() items: { value: string | number; label: string }[] = [];
}
