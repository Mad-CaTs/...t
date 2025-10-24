import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {
  constructor(private dialogService: DialogService) {}
  showSessionExpiredDialog(): DynamicDialogRef {
    return this.dialogService.open(ModalSuccessComponent, {
      header: '',
      data: {
        text: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
        title: '¡Sesión expirada!',
        icon: 'assets/icons/Inclub.png'
      }
    });
  }
}

