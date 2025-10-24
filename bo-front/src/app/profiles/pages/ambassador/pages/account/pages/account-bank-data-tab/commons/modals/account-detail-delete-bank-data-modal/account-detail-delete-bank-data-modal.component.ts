import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MatIconModule } from '@angular/material/icon';
import { ITableBankData } from '../../../../../commons/interfaces/account';
import { ModalComponent } from '@shared/components/modal/modal.component';

@Component({
  selector: 'app-account-detail-delete-bank-data-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent, MatIconModule],
  templateUrl: './account-detail-delete-bank-data-modal.component.html',
  styleUrls: [],
})
export class AccountDetailDeleteBankDataModalComponent {
  @Input() data: ITableBankData | null = null;
  @Input() isDetail: boolean = true;

  constructor(public instanceModal: NgbActiveModal) {}

  get title() {
    if (this.isDetail) return 'Detalle';

    return 'Eliminar Cuenta';
  }
}
