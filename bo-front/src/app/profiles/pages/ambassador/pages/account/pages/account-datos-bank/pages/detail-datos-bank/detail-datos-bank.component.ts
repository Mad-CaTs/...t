import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountDatosBankServiceService } from '../../../../commons/services/account-datos-bank-service.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DeleteBankComponent } from '../../commons/modals/delete-bank/delete-bank.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detail-datos-bank',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './detail-datos-bank.component.html',
  styleUrl: './detail-datos-bank.component.scss'
})
export class DetailDatosBankComponent {
  dialogRef: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private router: Router,
    private accountDatosBankServiceService: AccountDatosBankServiceService,
    private dialogService: DialogService,

  ) { }
  data: any;
  isLoading: boolean = false;
  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('bank'));
    console.log('Datos recibidos:', this.data);

  }
  editDetalle() {
    return this.router.navigate(['/profile/ambassador/account/datos-bancarios/edit-datos-bank']);

  }
  redirectCuenta() {
    return this.router.navigate(['/profile/ambassador/account/account-data']);
  }
  redirectDatosBank() {
    return this.router.navigate(['/profile/ambassador/account/datos-bancarios']);
  }
  deleteDetalle() {
    this.isLoading = true
    this.accountDatosBankServiceService.deleteSaveGestion(
      this.data.idAccountBank)
      .subscribe(
        (ele: any) => {
          if (ele.body['result'] == true) {
            this.dialogRef = this.dialogService.open(DeleteBankComponent, {
            })
            this.dialogRef.onClose.subscribe(() => {
              localStorage.removeItem("bank");
              this.router.navigate(['/profile/ambassador/account/datos-bancarios']);
            })
          }
          else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: "No se encuentra la informacion",
              life: 3000
            });
          }
        })
  }
}
