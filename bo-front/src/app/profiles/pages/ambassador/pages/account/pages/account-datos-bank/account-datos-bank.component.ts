import { Component } from '@angular/core';
import { AccountDatosBankServiceService } from '../../commons/services/account-datos-bank-service.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { VerifyDataComponent } from './commons/modals/verify-data/verify-data.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { AtencionBankComponent } from './commons/modals/atencion-bank/atencion-bank.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-account-datos-bank',
  standalone: true,
  providers: [DialogService, DynamicDialogRef, MessageService],
  imports: [ToastModule, CommonModule],
  templateUrl: './account-datos-bank.component.html',
  styleUrl: './account-datos-bank.component.scss'
})
export class AccountDatosBankComponent {
  listData: any;
  isLoading: Boolean = true;
  public id: any = this.userInfoService.userInfo.id;

  constructor(
    private router: Router,
    private accountDatosBankServiceService: AccountDatosBankServiceService,
    public userInfoService: UserInfoService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.accountDatosBankServiceService.getAccountBankIdUser(this.id)
      .subscribe({
        next: (response) => {
          this.listData = response['data']
          console.log(this.listData);
          this.isLoading = false;
        },
        error: () => {
        }
      });
  }
  addAccount() {
    if (this.listData.length < 3) {
      return this.router.navigate(['/profile/ambassador/account/datos-bancarios/add-datos-bank']);
    } else {
      return this.dialogService.open(AtencionBankComponent, {})
    }
  }
  verDetalle(item: any) {
    localStorage.setItem('bank', JSON.stringify(item));
    return this.router.navigate(['/profile/ambassador/account/datos-bancarios/detail-datos-bank']);
  }
  redirectCuenta() {
    return this.router.navigate(['/profile/ambassador/account/account-data']);
  }
}
