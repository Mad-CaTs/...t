import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ConciliationService } from 'src/app/profiles/pages/ambassador/pages/payments-and-comissions/pages/conciliation/commons/services/conciliation.service';
import { WalletService } from 'src/app/profiles/pages/ambassador/pages/wallet/commons/services/wallet.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalOpcionInhabilitadaComponent } from '@shared/modals/modal-opcion-inhabilitada/modal-opcion-inhabilitada.component';

@Component({
  selector: 'app-quick-links',
  standalone: true,
  imports: [],
  providers: [DialogService, DynamicDialogRef],
  templateUrl: './quick-links.component.html',
  styleUrl: './quick-links.component.scss'
})
export class QuickLinksComponent {
  @Input() walletBlock: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public userInfoService: UserInfoService,
    private walletService: WalletService,
    private dialogService: DialogService,
    private conciliationService: ConciliationService,
    public ref: DynamicDialogRef,
  ) { }
  ngOnInit(): void {
    console.log(this.walletBlock);
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
  enlaseRapidos(numero: number) {
    // Si la wallet está bloqueada, muestra modal y termina
    if (this.walletBlock) {
      return this.modalConciliacion();
    }

    // Manejo de casos según el número
    switch (numero) {
      case 1:
        return this.router.navigate(['transferir'], { relativeTo: this.route });
      case 2:
        return this.router.navigate(['/profile/partner/rechargepaypal']);
      case 3:
        /* return this.dialogService.open(ModalOpcionInhabilitadaComponent, {
          header: '',
          data: {
            icon: 'assets/wallet/warnning-icon.svg',
            title: "Esta funcionalidad se encuentra <br> temporalmente bloqueada.",
            message: `Por el momento no es posible acceder a esta<br> opción.
				 Estamos trabajando para restablecer <br> el servicio a la brevedad.
				  Agradecemos tu comprensión.`,
          }
        }); 

          */

       return this.router.navigate(['retiro-bancario'], { relativeTo: this.route }) ///this.modalEnvioCode()
      case 5:
       return this.downloadWalletReport();
      default:
        return this.dialogService.open(ModalAlertComponent, {
          header: '',
          data: {
            message: `Estamos trabajando en esta funcionalidad para ofrecerte una mejor experiencia.`,
            title: '¡Vuelve pronto!',
            icon: 'pi pi-desktop'
          }
        });
      //  return this.router.navigate(['ahorro'], { relativeTo: this.route });
    }

  }

  modalEnvioCode() {
    this.dialogService.open(ModalAlertComponent, {
      header: '',
      data: {
        message: `Estamos trabajando en esta funcionalidad para ofrecerte una mejor experiencia.`,
        title: '¡Vuelve pronto!',
        icon: 'pi pi-desktop'
      }
    });
    this.ref.close(true);
  }


downloadWalletReport(): void {
  const user = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userId = user?.id;
  if (!userId) return this.showError('No se encontró el usuario. Inicia sesión nuevamente.');
  this.walletService.getWalletMovements(userId).subscribe({
    next: (blob: Blob) => {
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = `Reporte-Wallet-${user.name || 'Usuario'}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
    },
    error: () => this.showError('No se pudo descargar el reporte. Intenta nuevamente.')
  });
}

private showError(msg: string): void {
  this.dialogService.open(ModalAlertComponent, {
    header: '',
    data: { message: msg, title: 'Error', icon: 'pi pi-exclamation-triangle' }
  });
}
}