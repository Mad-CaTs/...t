
import { Component, NgModule, Input  } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { WalletPaymentService } from '../../../commons/services/wallet-payment.service';
import { IUser, MembershipAffiliate } from '../../../commons/interfaces/membership.model';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';


@Component({
  selector: 'app-cart-payment-automatic',
  standalone: true,
  imports: [NgIf],
  providers: [DialogService, DynamicDialogRef],
  templateUrl: './cart-payment-automatic.component.html',
  styleUrl: './cart-payment-automatic.component.scss'
})
export class CartPaymentAutomaticComponent {
  @Input() walletBlock: boolean = false;

  modulworking: boolean = false;
  memberships: MembershipAffiliate[] = [];
  userData: IUser;

  constructor(private router: Router,
    public ref: DynamicDialogRef,
    private dialogService: DialogService,
    private walletSevice: WalletPaymentService,
    private userInfoService: UserInfoService,

  ) { 
    this.userData = this.userInfoService.userInfo;
    this.loadAffiliatesPay();
  }

  navigateToDisaffiliationRequest(op: number): void {
    if (this.walletBlock) {
      return this.modalConciliacion();
    }
    if (this.modulworking) {
      this.dialogService.open(ModalAlertComponent, {
        header: '',
        data: {
          message: `Estamos trabajando en esta funcionalidad para ofrecerte una mejor experiencia.`,
          title: '¡Vuelve pronto!',
          icon: 'pi pi-desktop'
        }
      });
      this.ref.close(true);

      return;
    }

    if (op === 1) {
      this.router.navigate([`/profile/ambassador/wallet/affiliate-payment`]);
    }
    else {
      this.router.navigate([`/profile/ambassador/wallet/desafiliate-payment`]);
    }

  }
  modalConciliacion() {
    this.dialogService.open(ModalSuccessComponent, {
      header: '',
      data: {
        text: 'Para habilitar wallet, falta subir conciliación.',
        title: '¡Alerta!',
        icon: 'assets/icons/Inclub.png'
      }
    });
  }

  loadAffiliatesPay() {
    let IdUser = this.userData.id
    this.walletSevice.getAllAffiliatesPay(IdUser).subscribe({
      next: (data) => {
        this.memberships = data;
        console.log('Afiliaciones cargadas:', this.memberships);
      },
      error: (error) => {
        console.error('Error al cargar afiliaciones:', error);
      }
    });
  }

}


