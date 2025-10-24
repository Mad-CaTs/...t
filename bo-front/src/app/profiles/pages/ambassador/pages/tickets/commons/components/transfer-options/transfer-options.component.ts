import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITransferOption } from '../../interfaces';
import { CommonModule } from '@angular/common';
import CardActionComponent from 'src/app/profiles/pages/ambassador/commons/components/card-action/card-action.component';

@Component({
	selector: 'app-transfer-options',
	standalone: true,
	imports: [CommonModule, CardActionComponent],
	templateUrl: './transfer-options.component.html',
	styleUrl: './transfer-options.component.scss'
})
export class TransferOptionsComponent {
	@Input() options: ITransferOption[] = [];
	@Input() title: string;
	@Input() selectedId: number | null = null;
	@Output() optionSelected = new EventEmitter<ITransferOption>();

	onOptionClick(option: ITransferOption) {
		this.optionSelected.emit(option);
	}
}
