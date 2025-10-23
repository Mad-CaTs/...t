import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalsBulkSuccesComponent } from '../modals-bulk-succes/modals-bulk-succes.component';
import { ModalComponent } from "@shared/components/modal/modal.component";
import { CommonModule } from '@angular/common';
import { RetirosService } from '@app/manager-wallet/services/retiros.service';
import { solicituRetiroMasivo, withdrawalsDetails } from '@app/manager-wallet/model/solicitudRetiro';
import { AuthService } from '@app/auth';
import { forkJoin } from 'rxjs';

export type NotificationMode = 'rejectionall' | 'rejection'

@Component({
  selector: 'app-modals-bulk-notification',
  standalone: true,
  templateUrl: './modals-bulk-notification.component.html',
  styleUrls: ['./modals-bulk-notification.component.scss'],
  imports: [ModalComponent, CommonModule]
})
export class ModalsBulkNotificationComponent {
  @Input() body: any;
  @Input() config : NotificationMode; 
  isLoading : boolean = false;
  approved :any[] = [];
  rejected : any[] = [];


  constructor(
    private modalManager: NgbModal,
    private activeModal: NgbActiveModal,
    private retiroService: RetirosService,
    private authService : AuthService
  ) { }

  notify() {
    this.closeModal();
    switch(this.config) {
      case 'rejectionall':
        this.updateBankWithdrawalNotificationAll();
        break
      case 'rejection':
        this.executeUpdateBankWithdrawalAll();
      break
    }
    this.openModalBullSucces();
  }

  private updateBankWithdrawalNotificationAll() {
    this.isLoading = true;

    const requestBody: solicituRetiroMasivo = {
      msg: 'Documento incompleto',
      idReasonRetiroBank:5,
      status: 0,
      solicitudes: this.body.map((row: withdrawalsDetails) => ({
        idsolicitudebank: row['idsolicitudebank'],
        namePropio: row['namePropio'],
        lastnamePropio: row['lastnamePropio']
      }))
    };

    const username = this.authService.getUsernameOfCurrentUser();

    this.retiroService.updateBankWithdrawalNotificationAll(username, requestBody).subscribe({
      next: (response) => {
        if (response.status === 200) {
          this.body = [];
          this.isLoading = false
        }
      }, error : (err) => {
        console.log(err)
        this.isLoading = false
      },
    })
  }

  private executeUpdateBankWithdrawalAll() {
  this.isLoading = true;

  this.approved = this.body.filter((i: any) => i.idBankStatus === 4);
  this.rejected = this.body.filter((i: any) => i.idBankStatus !== 4);

  const username = this.authService.getUsernameOfCurrentUser();
  const requests: any[] = [];

  if (this.approved.length > 0) {
    const requestAprobadas: solicituRetiroMasivo = {
      status: 2,
      msg: 'Solicitud Aprobada',
      idReasonRetiroBank: 0,
      solicitudes: this.approved.map((i: any) => ({
        idsolicitudebank: i.idsolicitudebank,
        namePropio: i.nameHolder,
        lastnamePropio: i.lastNameHolder
      }))
    };
    
    requests.push(
      this.retiroService.updateBankWithdrawalNotificationAll(username, requestAprobadas)
    );
  }

  if (this.rejected.length > 0) {
    const requestRechazadas: solicituRetiroMasivo = {
      status: 0,
      msg: 'Solicitud Rechazada',
      idReasonRetiroBank: 5,
      solicitudes: this.rejected.map((i: any) => ({
        idsolicitudebank: i.idsolicitudebank,
        namePropio: i.nameHolder,
        lastnamePropio: i.lastNameHolder
      }))
    };
    
    requests.push(
      this.retiroService.updateBankWithdrawalNotificationAll(username, requestRechazadas)
    );
  }

  if (requests.length > 0) {
    forkJoin(requests).subscribe({
      next: (responses) => {
        
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error en la actualización masiva:', err);
        this.isLoading = false;
      }
    });
  } else {
    console.warn('No hay solicitudes para procesar');
    this.isLoading = false;
  }
}

  private openModalBullSucces() {
    const ref = this.modalManager.open(ModalsBulkSuccesComponent, {
      centered: true,
      size: 'md'
    });

    ref.componentInstance.totalReject = this.body.length
    ref.componentInstance.approved = this.approved.length
    ref.componentInstance.rejected = this.rejected.length
    
    if(ref?.componentInstance) {
      ref.componentInstance.totalReject = this.body.length
    }
  }

  closeModal() {
    this.activeModal.close();
  }

}
