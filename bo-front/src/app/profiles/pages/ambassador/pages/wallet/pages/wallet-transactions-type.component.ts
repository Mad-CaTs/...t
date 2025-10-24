import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { WalletService } from '../commons/services/wallet.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConciliationService } from '../../payments-and-comissions/pages/conciliation/commons/services/conciliation.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalOpcionInhabilitadaComponent } from '@shared/modals/modal-opcion-inhabilitada/modal-opcion-inhabilitada.component';

@Component({
  selector: 'app-wallet-transactions-type',
  standalone: true,
  imports: [],
  providers: [DialogService, DynamicDialogRef],
  templateUrl: './wallet-transactions-type.component.html',
  styleUrl: './wallet-transactions-type.component.scss'
})
export class WalletTransactionsTypeComponent {
  public sponsorId: number = this.userInfoService.userInfo.id;
  walletBlock: boolean = false
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userInfoService: UserInfoService,
    private walletService: WalletService,
    private dialogService: DialogService,
    private conciliationService: ConciliationService,
  ) { }
  ngOnInit(): void {
    this.getWalletById(this.sponsorId);

  }
  private getWalletById(id: number): void {
    this.walletService.getWalletById(id).subscribe(
      (response: any) => {
        this.conciliationService.getConciliationPendingByUserId(this.sponsorId).subscribe({
          next: (check) => {
            this.walletBlock = check.data;
            console.log(this.walletBlock);
            if (check.data) {
              this.modalConciliacion();
            }
          }
        });
      });
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
  redirecctPage(number: any) {
    if (this.walletBlock) return this.modalConciliacion()
    if (number == 1) return this.router.navigate(['entre-wallet'], { relativeTo: this.route });
    return this.dialogService.open(ModalOpcionInhabilitadaComponent, {
      header: '',
      data: {
        icon: 'assets/wallet/warnning-icon.svg',
        title: "Esta funcionalidad se encuentra <br> temporalmente bloqueada.",
        message: `Por el momento no es posible acceder a esta<br> opción.
         Estamos trabajando para restablecer <br> el servicio a la brevedad.
          Agradecemos tu comprensión.`,
      }
    });
  }

}
