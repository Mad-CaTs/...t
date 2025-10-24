import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TransferService } from '../../../pages/commons/services/transfer/transfer.service';
import { ITransferData, ITransferUserData } from '../../../pages/commons/interfaces';
import { ITransferOption } from '../../interfaces';

@Component({
	selector: 'app-request-confirmation',
	standalone: true,
	imports: [CommonModule, MatIconModule],
	templateUrl: './request-confirmation.component.html',
	styleUrl: './request-confirmation.component.scss'
})
export class RequestConfirmationComponent {
	@Input() transferData!: ITransferData;
	@Input() sponsorInfo!: any;
	@Input() selectedOption!: ITransferOption;
	@Input() hasPendingConciliation: boolean = false;

	constructor() {}

	ngOnInit(): void {
		console.log('selectedOption', this.selectedOption);
		console.log('hasPendingConciliationenhijo', this.hasPendingConciliation);
	}

	ngOnChanges(changes: SimpleChanges) {
		console.log('sponsorInfochacge', this.sponsorInfo);

		if (this.transferData) {
			console.log('Recibí en el hijo:', this.transferData.info, this.transferData.documentos);
		}

		if (changes['hasPendingConciliation']) {
			console.log('Nuevo valor recibido en hijo:', this.hasPendingConciliation);
		}
	}

	get conciliacionTexto(): string {
		return this.hasPendingConciliation
			? 'Sí cuenta con conciliaciones pendientes'
			: 'No cuenta con conciliaciones pendientes';
	}
}
