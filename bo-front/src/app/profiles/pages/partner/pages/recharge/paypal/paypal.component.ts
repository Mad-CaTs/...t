import { ChangeDetectorRef, Component, EventEmitter, OnInit, TemplateRef, ViewChild, Input, Output } from '@angular/core';
import { Subscription, filter, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';

import { IPaymentType, IPaypalResponse, IUser } from '../../../../../../shared/interfaces/wallet-interface'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { PaypalBankPresenter } from '../modal-recharge-paypal/modal-recharge-paypal.presenter';
import { ModalRechargePaypalComponent } from '../modal-recharge-paypal/modal-recharge-paypal.component';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ConciliationService } from 'src/app/profiles/pages/ambassador/pages/payments-and-comissions/pages/conciliation/commons/services/conciliation.service';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { WalletService } from 'src/app/services/wallet.service';


@Component({
  selector: 'app-paypal',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DialogModule,
    NgxPayPalModule,
  ],
  providers: [
    DialogService,
    WalletService,
    NgbModal,
    PaypalBankPresenter,
  ],
  templateUrl: './paypal.component.html',
  styleUrl: './paypal.component.scss'
})
export default class PaypalComponent implements OnInit {
  @Input() isLoading: boolean;
  @Output() paypalData = new EventEmitter<IPaymentType>();

  private readonly filterTypes = ['PAYPAL', 'BCP', 'INTERBANK', 'OTROS'];
  loading: boolean = false;
  currentStep: number = 1;
  paymentTypes: any[] = [];
  paymentType: IPaymentType;
  selectIdType: number = 0;
  showPaymentModal = false;
  totalMount: number = 0;
  subTotalMount: number = null;
  comisionMount: number = 0.00;
  private subs: Subscription;
  disabledPaymentMethods = false;
  isInvalid: boolean = false;
  payPalConfig: IPayPalConfig;
  paypalResponseData: any;
  userData: IUser;
  operationTypeId = 42;


  modalRef: NgbModalRef;
  public sponsorId: number = this.userInfoService.userInfo.id;

  alertTitle: string = '';
  alertMessage: string = '';
  alertType: string = 'info'; // 'success', 'error', 'warning', 'info'
  @ViewChild('modalTemplatePaypal') modalTemplatePaypal: TemplateRef<any>;
  form: FormGroup;
  modalData = {
    payment: null,
    selectIdType: 0,
    isLoading: true,
    form: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private walletService: WalletService,
    private dialogService: DialogService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private userInfoService: UserInfoService,
    private conciliationService: ConciliationService,
  ) { }

  ngOnInit(): void {

    this.getAllPaymentType();
    this.userData = this.userInfoService.userInfo;
    // console.log('User data:', this.userData);
    this.getWalletById(this.sponsorId);

  }
  public walletBlock: boolean = false;

  private getWalletById(id: number): void {
    this.walletService.getWalletById(id).subscribe(
      (response: any) => {
        this.conciliationService.getConciliationPendingByUserId(this.sponsorId).subscribe({
          next: (check) => {
            this.walletBlock = check.data;
            if (check.data) {
              this.dialogService.open(ModalSuccessComponent, {
                header: '',
                data: {
                  text: 'Para habilitar wallet, falta subir conciliación.',
                  title: '¡Alerta!',
                  icon: 'assets/icons/Inclub.png'
                }
              });
            }
          }
        });
      },
    );
  }

  getAllPaymentType() {

    this.loading = true;
    const params = '/paymenttype/';
    this.subs = this.walletService.getAllPaymentTypes(params).subscribe({
      next: (response) => {
        if (response.status === 200) {
          // console.log('Payment types:', response.data);
          this.paymentTypes = this.getFilteredAndOrderedData(response.data);
        } else {
          this.paymentTypes = [];
          console.error('Error fetching payment types:', response.message);
        }
      },
      error: (error) => {
        console.error('HTTP Error:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  private getFilteredAndOrderedData(data: any[]): any[] {
    const filtered = data.filter(item =>
      this.filterTypes.includes(item.description)
    );
    return filtered.sort((a, b) => {
      return this.filterTypes.indexOf(a.description) - this.filterTypes.indexOf(b.description);
    });
  }


  capitalizeString(paymenType: string): string {
    if (!paymenType) return '';
    let letter = paymenType.charAt(0).toUpperCase() + paymenType.slice(1).toLowerCase();
    if (paymenType.toLowerCase() === 'otros') letter += ' medios';
    if (paymenType.toLowerCase() === 'bcp') letter = letter.toUpperCase();
    return letter;
  }

  selectPaymentType(item: IPaymentType) {
    this.selectIdType = item.idPaymentType;
    this.paymentType = item; //save paymentType Selected
    this.alertTitle = 'Tipo de pago no disponible';
    this.alertMessage = 'el tipo de pago seleccionado no está disponible para recargas en este momento.';
    this.alertType = 'warning'; // 'success', 'error', 'warning', 'info'

    if (this.paymentType.description !== 'PAYPAL') {
      this.currentStep = 1;
      this.modalAlert(this.alertTitle, this.alertMessage, this.alertType);
      return;
    }

    switch (this.paymentType.description.toLowerCase()) {
      case "paypal":
        this.confirmPaymentType(this.paymentType)
        break;

      default:
        this.modalAlert(this.alertTitle, this.alertMessage, this.alertType);
        break;
    }
  }

  modalAlert(title: string, message: string, type: string) {
    this.dialogService.open(ModalAlertComponent, {
      header: title,
      data: {
        message: message,
        type: type,
        title: '¡Alerta!',
        icon: 'pi pi-exclamation-triangle'
      }
    });
  }

  modalPaypal(paymentType: IPaymentType) {
    this.currentStep = 2;
  }

  focusButtonConfirm(): void {
    setTimeout(() => {
      var confirmBtn = document.querySelector('#confirmBtn') as HTMLElement;
      if (confirmBtn) {
        confirmBtn.focus();
      }
    }, 300);
  };

  public confirmPaymentType(paymentType?: IPaymentType) {

    if (this.currentStep < 3) {
      this.currentStep = 2;
    }
    this.paymentType.subTotalMount = this.subTotalMount || 0;
    const {
      paymentSubTypeList: [value]
    } = this.paymentType;

    const dataToModal = {
      description: this.paymentType.description,
      logopayment: this.paymentType.pathPicture,
      subTotal: this.subTotalMount,
      comision: this.comisionMount,
      amount: this.totalMount,
      isInvalid: this.isInvalid,
      ...this.paymentType,
      ...value
    };


    this.dialogService.open(ModalRechargePaypalComponent, {
      data: dataToModal,
      styleClass: 'modal-md hide-modal-header',
      dismissableMask: false,
      closable: false,
    }).onClose
      .pipe(tap((data: any) => {
        if (data) {
          this.paypalResponseData = data;
          this.disabledPaymentMethods = true;
          // Ejecuta ambas Promesas en paralelo
          Promise.all([
            this.onSubmit(data),
            this.onSendEmail(data)
          ])
            .then(() => console.log('Both functions completed'))
            .catch((err) => console.error('Error in either function', err));
        }
      })
      ).subscribe();
  }

  onSubmit(data: IPaypalResponse) {

    // console.log("data: ", data);
    this.currentStep = 3;
    let operatrionNumber = data.operationNumber;
    let subTotalMount = data.totalMount;
    let operationMount = data.operationMount;
    const paramBody = {
      operationType: this.operationTypeId,
      idUser: this.userData.id,
      idUserSecondary: null,
      amount: subTotalMount,
      note: ` Codigo: ${data.operationNumber}`,
    }

    //console.log('body recarga paypal:', paramBody);

    const params = `/wallettransaction/charger/paypal/${operatrionNumber}`;
    try {
      this.subs = this.walletService.postTransactionChargePaypal(paramBody, params).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.showPaymentModal = true;
          } else {
            this.modalAlert('Erro al registrar la recarga', 'Codigo paypal: ' + operatrionNumber, 'error');
          }
        },
        error: (error) => {
          console.error('HTTP Error:', error);
        },
        complete: () => {
          this.loading = false;
          this.cancelPaymentType();
        }
      });
    } catch (outerError) {
      console.error('Error al registrar recarga:', outerError);
      this.modalAlert('Error crítico', `Comunícate con soporte, codigo paypal: ${operatrionNumber}`, 'error');
      this.loading = false;
      this.cancelPaymentType();
    }
  }

  onSendEmail(data: IPaypalResponse) {

    // console.log("data: ", data);

    const paramBody = {
      "subTotal": data.operationSubTotal,
      "tasa": data.operationTasa,
      "comision": data.operationComision,
      "totalMount": data.operationMount,
      "paypalTransactionCode": data.operationNumber,
      "createdUp": null,
      "idUser": this.userData.id,
      "name": this.userData.name,
      "lastName": this.userData.lastName,
      "email": this.userData.email
    }

    // console.log('correo: ', paramBody);

    const params = `/wallettransaction/paypal/sendnotification`;
    try {
      this.subs = this.walletService.postTransactionChargePaypal(paramBody, params).subscribe({
        next: (response) => {
          if (response.status === 200) {
            this.showPaymentModal = true;
          } else {
            this.modalAlert('Erro al enviar correo', 'Codigo paypal: ' + data.operationNumber, 'error');
          }
        },
        error: (error) => {
          console.error('HTTP Error:', error);
        },
        complete: () => {
          this.loading = false;
          this.cancelPaymentType();
        }
      });
    } catch (outerError) {
      console.error('Error al enviar correo:', outerError);
      this.modalAlert('Error crítico', `Comunícate con soporte, codigo paypal: ${data.operationNumber}`, 'error');
      this.loading = false;
      this.cancelPaymentType();
    }

  }

  cancelPaymentType() {
    if (this.currentStep < 3) {
      this.currentStep = 1;
    }
    this.selectIdType = 0;
  }

  closeModalPaypal() {
    this.modalRef?.close();
    this.selectIdType = 0;
    this.currentStep = 1;
  }

  closeModal(event: any) {

    this.showPaymentModal = false;
    this.selectIdType = 0;
    this.currentStep = 1;

  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToMyWallet() {
    return this.router.navigate(['/profile/ambassador/wallet']);
  }


}
