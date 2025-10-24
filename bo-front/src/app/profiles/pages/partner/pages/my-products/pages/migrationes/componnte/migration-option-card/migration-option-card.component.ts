import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { IMigrationDetail } from '../../commons/interfaces/migration.interface';

@Component({
	selector: 'app-migration-option-card',
	standalone: true,
	imports: [CommonModule, RadiosComponent],
	templateUrl: './migration-option-card.component.html',
	styleUrl: './migration-option-card.component.scss'
})
export class MigrationOptionCardComponent {
	@Input() option: any;
	migrationOptions: IMigrationDetail[] = [];
	@Output() optionSelected = new EventEmitter<number>();
	@Output() previewClicked = new EventEmitter<void>();

	onOptionSelect() {
		this.optionSelected.emit(this.option.idOption);
	}

	onPreviewClick() {
		this.previewClicked.emit(this.option);
	}
}
