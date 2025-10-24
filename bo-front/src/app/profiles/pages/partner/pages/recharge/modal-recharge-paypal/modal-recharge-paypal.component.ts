import { Component, OnInit, Input, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IPayPalConfig, NgxPayPalModule } from 'ngx-paypal';
import { environment } from '@environments/environment';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PaypalBankPresenter } from './modal-recharge-paypal.presenter';


@Component({
  selector: 'app-modal-recharge-paypal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    NgxPayPalModule,
  ],
  templateUrl: './modal-recharge-paypal.component.html',
  styleUrl: './modal-recharge-paypal.component.scss',
  providers: [PaypalBankPresenter]
})

export class ModalRechargePaypalComponent implements OnInit {

  @Input() totalMount: number = 0;
  payPalConfig: IPayPalConfig;
  subTotalMount: number = 0;
  tasaMount: number = 0;
  comisionMount: number = 0;
  isInvalid: boolean = false;
  showPaymentModal = false;
  currentStep: number = 1;
  selectIdType: number = 0;
  paymentType: any;
  inputData: any;
  currency: string = 'USD'; // Default currency
  showCancel: boolean;
  showError: boolean;
  paymentSubTypeId = 9; // Default payment subtype ID
  mountMin = 1.4;

  constructor(
    public ref: DynamicDialogRef,
    public paypalBankPresenter: PaypalBankPresenter,
    public config: DynamicDialogConfig,
    private renderer: Renderer2
  ) {
  }

  ngOnInit(): void {

    this.inputData = this.config.data;
    this.initConfig();
  }


  private initConfig(): void {

    this.payPalConfig = {
      clientId: environment.TOKEN_PAYPAL,
      style: {
        layout: 'vertical',
        label: 'paypal',
        color: 'gold',
        shape: 'rect',
        tagline: false,
        height: 42,
      },
      advanced: {
        commit: 'true',
      },
      createOrderOnClient: () =>
        <any>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              description: this.inputData.description,
              amount: {
                currency_code: this.currency,
                value: this.totalMount.toFixed(2) 
              }
            }
          ]
        },
      onClientAuthorization: (data) => {
        const value = this.paypalBankPresenter.paypalForm.value;
        this.ref.close({
          ...value,
          operationNumber: data.id,
          operationMount: this.totalMount,
          operationTasa: this.tasaMount,
          operationComision: this.comisionMount,
          operationSubTotal: this.subTotalMount
        });
      },
      onCancel: (data, actions) => {
        this.showCancel = true;
      },
      onError: (err) => {
        this.showError = true;
      },
      onClick: (data, actions) => {
      }
    };
  }

  resetMounts() {
    this.subTotalMount = 0;
    this.tasaMount = 0;
    this.comisionMount = 0;
    this.totalMount = 0;
    this.isInvalid = false;
  }

  calcMounts(subTotalIn: number) {

    let data = this.inputData.paymentSubTypeList[0];
    let comission: number = data.commissionDollars;
    let tasa: number = parseFloat((((subTotalIn + comission) * data.ratePercentage) / 100).toFixed(2));
    let total: number = parseFloat((comission + tasa + subTotalIn).toFixed(2))

    this.subTotalMount = subTotalIn;
    this.tasaMount = tasa;
    this.comisionMount = comission;
    this.totalMount = total;
    this.isInvalid = true;

  }

  closeModal() {
    this.ref.close();
  }

  cancelPaymentType() {
    if (this.currentStep < 3) {
      this.currentStep = 1;
    }
    this.showPaymentModal = false;
    this.selectIdType = 0;
  }

  formatDecimal() {
    if (this.subTotalMount < this.mountMin) {
      this.isInvalid = false;
    } else {
      this.isInvalid = true;
    }
  }

  validateInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const numericValue = parseFloat(currentValue) || 0;
    this.subTotalMount = parseFloat(numericValue.toFixed(2));

    if (parseFloat(currentValue) < this.mountMin || currentValue === '') {
      this.resetMounts(); //reseteamos valores calculados
      return;
    }
    this.calcMounts(this.subTotalMount);

  }


}
