import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { walletHistoryTransactionTableData } from '../../mocks/mock';
import { CommonModule, DatePipe } from '@angular/common';
import { IWalletHistoryTransactionTable } from '../../../../../../../payments-and-comissions/pages/payment-detail/commons/interfaces/payments-and-comissions.interfaces';

import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
	selector: 'app-modal-wallet-detail-history-transaction',
	templateUrl: './modal-wallet-detail-history-transaction.component.html',
	standalone: true,
	imports: [CommonModule, ModalComponent],
	providers: [DatePipe],
	styleUrls: []
})
export class ModalWalletDetailHistoryTransactionComponent implements OnInit {
	@Input() id: number = 0;
	@Input() selectedData: IWalletHistoryTransactionTable | undefined;

	constructor(public instanceModal: NgbActiveModal, private datePipe: DatePipe) { }

	ngOnInit(): void {
		if (this.selectedData) {
			this.id = this.selectedData.id;
			console.log('selectedData:', this.selectedData);
		} else {
			console.log('No se han proporcionado datos de selectedData al modal.');
		}
	}

	private parseDate(dateStr: string): Date | null {
		const dateParts = dateStr.split(' ');
		if (dateParts.length !== 2) return null;

		const [date, time] = dateParts;
		const [day, month, year] = date.split('/').map(Number);
		const [hours, minutes] = time.split(':').map(Number);

		return new Date(year, month - 1, day, hours, minutes);
	}

	getFormattedDate(): string {
		if (this.selectedData && this.selectedData.date) {
			const parsedDate = this.parseDate(this.selectedData.date);
			return parsedDate ? this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '' : '';
		}
		return '';
	}

	getFormattedTime(): string {
		if (this.selectedData && this.selectedData.date) {
			const parsedDate = this.parseDate(this.selectedData.date);
			return parsedDate ? this.datePipe.transform(parsedDate, 'HH:mm') || '' : '';
		}
		return '';
	}

	getAbsoluteAmount(amount: number): string {
		return Math.abs(amount).toFixed(2);
	}
}
