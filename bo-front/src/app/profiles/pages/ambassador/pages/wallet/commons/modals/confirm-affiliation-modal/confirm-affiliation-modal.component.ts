import { Component } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Membership, TransactionData, Affiliate } from '../../../commons/interfaces/membership.model';
@Component({
  selector: 'app-confirm-affiliation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-affiliation-modal.component.html',
  styleUrl: './confirm-affiliation-modal.component.scss'
})
export class ConfirmAffiliationModalComponent {

  memberships: any[] = [];
  transactionData: TransactionData;
  dateActualal: string = '';

  constructor(
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private router: Router
  ) {}

  ngOnInit() {
    const fecha = new Date();
    const fechaFormateada = `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
    this.dateActualal = fechaFormateada;

    if (this.config.data) {
      this.memberships = this.config.data.memberships || {};
      this.transactionData = this.config.data.transactionData || {};
    }
  }

  onConfirm() {    
    this.ref.close({ confirmed: true });
    this.router.navigate([`/profile/ambassador/wallet`]);
  }
}
