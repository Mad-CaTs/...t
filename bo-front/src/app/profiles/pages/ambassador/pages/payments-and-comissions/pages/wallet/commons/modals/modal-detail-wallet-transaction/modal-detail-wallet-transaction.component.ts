import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule, DatePipe } from '@angular/common';
import { IWalletTransactionTable } from '../../../../payment-detail/commons/interfaces/payments-and-comissions.interfaces';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-modal-detail-wallet-transaction',
  templateUrl: './modal-detail-wallet-transaction.component.html',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  providers: [DatePipe]
})
export class ModalDetailWalletTransactionComponent {
  @Input() transactionData: IWalletTransactionTable | null = null;
  showDetails: boolean = false; // Toggle state for additional fields

  constructor(public instanceModal: NgbActiveModal, private datePipe: DatePipe) {}

  get data() {
    return this.transactionData;
  }

  private parseDate(dateStr: string): Date | null {
    const dateParts = dateStr.split(' ');
    if (dateParts.length !== 2) return null;

    const [date, time] = dateParts;
    const [day, month, year] = date.split('/').map(Number);
    let [hours, minutes] = time.split(':').map(Number);
    const ampm = dateStr.toLowerCase().includes('pm') ? 'PM' : 'AM';

    if (ampm === 'PM' && hours < 12) hours += 12;
    if (ampm === 'AM' && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes);
  }

  getFormattedDateTime(): string {
    if (this.data && this.data.dateInitial) {
      const parsedDate = this.parseDate(this.data.dateInitial);
      return parsedDate ? this.datePipe.transform(parsedDate, "dd/MM/yyyy '|' h:mm a") || '' : '';
    }
    return '';
  }

  getAbsoluteAmount(amount: number): string {
    return Math.abs(amount).toFixed(2);
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
