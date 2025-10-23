import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-spinner',
	templateUrl: './spinner.component.html',
	styleUrls: ['./spinner.component.scss'],
	standalone: true,
	imports: [CommonModule]
})
export class SpinnerComponent {
	@Input() size: 'sm' | 'md' | 'lg' = 'md';
	@Input() color: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'light' | 'dark' = 'primary';
	@Input() text: string = '';
	@Input() showText: boolean = true;
	@Input() inline: boolean = false;

	get spinnerClasses(): string {
		const sizeClass = this.getSizeClass();
		const colorClass = `text-${this.color}`;
		return `spinner-border ${sizeClass} ${colorClass}`;
	}

	private getSizeClass(): string {
		switch (this.size) {
			case 'sm':
				return 'spinner-border-sm';
			case 'lg':
				return 'spinner-border-lg';
			default:
				return '';
		}
	}
}