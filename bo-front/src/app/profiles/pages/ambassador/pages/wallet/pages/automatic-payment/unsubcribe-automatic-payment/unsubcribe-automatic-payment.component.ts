import { CommonModule } from '@angular/common';
import { Component, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { CancelAffiliateModalComponent } from '../../../commons/modals/cancel-affiliate-modal/cancel-affiliate-modal.component';
import { IUser, MembershipAffiliate } from '../../../commons/interfaces/membership.model';
import { DisaffiliationRequestComponent } from '../disaffiliation-request/disaffiliation-request.component';
import { WalletPaymentService } from '../../../commons/services/wallet-payment.service';
import { MatIconModule } from '@angular/material/icon';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';

@Component({
  selector: 'app-unsubcribe-automatic-payment',
  standalone: true,
  imports: [CommonModule, DisaffiliationRequestComponent, MatIconModule],
  templateUrl: './unsubcribe-automatic-payment.component.html',
  styleUrl: './unsubcribe-automatic-payment.component.scss'
})
export class UnsubcribeAutomaticPaymentComponent {
  MembershipSelected: boolean = true;
  memberships: MembershipAffiliate[] = [];
  selectedMembershipActive: string = '';
  userData: IUser;


  constructor(
    private dialogService: DialogService,
    private walletSevice: WalletPaymentService,
    private userInfoService: UserInfoService,
    private router: Router
  ) {
    this.userData = this.userInfoService.userInfo;
    this.loadAffiliatesPay();
  }

  convertToDateArray(fechaArray: number[]): Date {
    return new Date(fechaArray[0], fechaArray[1] - 1, fechaArray[2]);
  }

  loadAffiliatesPay(): void {
    let IdUser = this.userData.id
    this.walletSevice.getAllAffiliatesPay(IdUser).subscribe({
      next: (data) => {
        this.memberships = data.map(membership => ({
          ...membership,
          selected: membership.isSelected || false
        }));

        console.log('Afiliaciones cargadas:', this.memberships);
      },
      error: (error) => {
        console.error('Error al cargar afiliaciones:', error);
      }
    });

  }

  selectedMembership: {} | null = null;

  get isAffiliateButtonEnabled(): boolean {
    return this.selectedMembershipActive !== '';
  }

  onMembershipSelect(membershipId: any): void {
    this.selectedMembershipActive = membershipId;
    this.selectedMembership = this.memberships.find(membership => membership.idSuscription === membershipId) || null;
    this.memberships.find(membership => {
      membership.isSelected = (membership.idSuscription === membershipId);
    });

    console.log('Selected Membership:', this.selectedMembership);
  }


  onClickOpenCoAffiliateModal(): void {
    const dataToPass = {
      memberships: this.memberships.find(m => m.isSelected),
    };

    const ref = this.dialogService.open(CancelAffiliateModalComponent, {
      header: 'Detalle de la cuota',
      data: dataToPass,
      styleClass: 'custom-modal-header'
    });

    ref.onClose.subscribe((rs) => {
      
      if (rs) {
        if (this.isAffiliateButtonEnabled) {
          const selected = this.memberships.find(m => m.isSelected);
          this.MembershipSelected = false;
        }
      } else {
        this.handleGoToBack(true);
      }
    });

  }

  onVolver(): void {
    this.router.navigate([`/profile/ambassador/wallet`]);
  }

  
  handleGoToBack(event: boolean): void {
    if (event) {
      this.MembershipSelected = event;
      this.selectedMembershipActive = '';
      this.selectedMembership = null;
    }
  }
}
