import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PaymentScheduleDetailApiService } from '../../../../../services/payment-schedule-detail.service';
import { PaymentScheduleApiService } from '../../../../../services/payment-schedule.service';
import { PaymentScheduleDetail } from '../../../../../interfaces/payment-schedule-detail.interface';
import { PaymentSchedule } from '../../../../../interfaces/payment-schedule.interface';
import { Subscription, Subject, tap } from 'rxjs';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { ModalPaymentPaypalComponent } from '../../../../../../../../../../../ambassador/pages/new-partner/pages/new-partner-payment/commons/modals/modal-payment-paypal/modal-payment-paypal.component';
import { ModalPaymentBankContainer } from '../../../../../../../../../../../ambassador/pages/tree/pages/history-range/commons/components/achievements-section/emerald/modals/modal-payment-bank/modal-payment-bank.container';
import { ModalPaymentService } from '../../../../../../../../../../../ambassador/pages/new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { PaymentType } from '../../../../../../../../../../../ambassador/pages/new-partner/pages/new-partner-payment/commons/enums';
import { getPaymentListByContry } from '../../../../../../../../../../../ambassador/pages/new-partner/pages/new-partner-payment/commons/contants';
import { ISelect } from '@shared/interfaces/forms-control';
import { IPaypalData } from '../../../../../../../../../../pages/new-partner/commons/interfaces/new-partner.interface';
import { ChangeDetectorRef } from '@angular/core';
import { ModalPayFeeComponent } from 'src/app/profiles/pages/partner/pages/my-products/commons/modals/modal-pay-fee/modal-pay-fee';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { CurrencyType } from 'src/app/profiles/commons/enums';
import { ModalPartnerPaymentService } from '../../../../../../../../../../../ambassador/pages/new-partner/pages/new-partner-payment/servicio/new-partner-payment.service';

@Component({
  selector: 'app-modal-detail-schedule-auto-bonus',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  templateUrl: './modal-detail-schedule-auto-bonus.component.html',
  styleUrl: './modal-detail-schedule-auto-bonus.component.scss',
  providers: [DatePipe, DialogService]
})
export class ModalDetailScheduleAutoBonusComponent implements OnInit, OnDestroy {
  @Input() transactionData: Partial<PaymentScheduleDetail> & { status?: string, date?: any } | null = null;
  @Input() residenceContry: string = 'PE';
  @Output() paypalData = new EventEmitter<IPaypalData>();
  @Output() paymentConfirmed = new EventEmitter<PaymentSchedule>();
  paymentScheduleDetail: PaymentScheduleDetail | null = null;
  showDetails: boolean = false;
  isLoading: boolean = false;
  paying: boolean = false;
  confirming: boolean = false;
  methodSelected: any = null;
  paymentConfirmedFlag: boolean = false;
  paymentTypeListaFiltered: any[] = [];
  paymentTypeList: any[] = [];
  paymentForm: FormGroup;
  pkgDetail = { initialPrice: null, numberQuotas: 12, price: 5000.00, monthsDuration: 12 };
  private subscription: Subscription = new Subscription();
  dialogRef: DynamicDialogRef;
  operationCurrency: ISelect[] = [];
  exchangeType: number = 1;
  listVochersToSave: any[] = [];
  listMethodPayment: any[] = [];
  indexEdit: number | null = null;
  voucherToEdit: any;
  disablePaymentMethods: boolean = false;
  private destroy$: Subject<void> = new Subject<void>();
  walletBlock: boolean = false;

  constructor(
    public instanceModal: NgbActiveModal,
    private datePipe: DatePipe,
    private paymentScheduleDetailApiService: PaymentScheduleDetailApiService,
    private paymentScheduleApiService: PaymentScheduleApiService,
    private fb: FormBuilder,
    private dialogService: DialogService,
    private modalPaymentService: ModalPaymentService,
    private modalPartnerPaymentService: ModalPartnerPaymentService,
    private cdr: ChangeDetectorRef
  ) {
    this.paymentForm = this.fb.group({
      totalNumberPaymentPaid: [0],
      amount: [null]
    });
  }

  ngOnInit(): void {
    console.log('Input transactionData:', this.transactionData);
    this.getInitData();
    if (this.transactionData?.paymentScheduleId) {
      this.fetchPaymentScheduleDetail(this.transactionData.paymentScheduleId);
    } else {
      console.warn('No paymentScheduleId provided in transactionData');
      this.paymentScheduleDetail = null;
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getInitData(): void {
    this.getPaymentType();
    this.getCurrencyList();
    this.getTC();
    this.filterPaymentTypesByCountry();
  }

  private filterPaymentTypesByCountry(): void {
    if (this.paymentTypeList && this.residenceContry === 'PE') {
      this.paymentTypeListaFiltered = getPaymentListByContry(
        this.paymentTypeList,
        this.residenceContry,
        this.walletBlock
      );
      console.log('Filtered payment types for PE:', this.paymentTypeListaFiltered);
      const orderedMethods = [
        { description: PaymentType.BCP },
        { description: PaymentType.INTERBANK },
        { description: PaymentType.PAYPAL },
        { description: PaymentType.WALLET, content: 'Mi Wallet' },
        { description: PaymentType.OTROS }
      ];
      this.paymentTypeListaFiltered = orderedMethods.map(orderedMethod => {
        const foundMethod = this.paymentTypeListaFiltered.find(m => m.description === orderedMethod.description) ||
                           this.paymentTypeList.find(m => m.description === orderedMethod.description);
        return foundMethod ? { ...foundMethod, content: orderedMethod.content || foundMethod.content } : orderedMethod;
      });
      console.log('Adjusted payment types for PE with order:', this.paymentTypeListaFiltered);
    }
  }

  private getPaymentType(): void {
    this.modalPartnerPaymentService
      .getPaymenttype()
      .pipe(
        tap((paymentTypeList) => {
          this.paymentTypeList = paymentTypeList;
          console.log('Payment types fetched:', this.paymentTypeList);
        }),
        tap(() => this.filterPaymentTypesByCountry())
      )
      .subscribe();
  }

  private getCurrencyList(): void {
    this.modalPaymentService
      .getCurrency()
      .pipe(tap((monedas) => (this.operationCurrency = monedas)))
      .subscribe();
  }

  private getTC(): void {
    this.modalPaymentService.getTipoCambio().subscribe((exchangeType) => {
      this.exchangeType = exchangeType.sale || 1;
    });
  }

  private fetchPaymentScheduleDetail(paymentScheduleId: number): void {
    this.isLoading = true;
    this.subscription.add(
      this.paymentScheduleDetailApiService.fetchGetByPaymentScheduleId(paymentScheduleId).subscribe({
        next: (response: any) => {
          console.log('API response:', response);
          if (response.result && Array.isArray(response.data) && response.data.length > 0) {
            const detail = response.data[0];
            this.paymentScheduleDetail = {
              id: detail.id,
              paymentScheduleId: detail.paymentScheduleId,
              transactionDateTime: this.parseDateArray(detail.transactionDateTime),
              operationType: detail.operationType || '-',
              operationCode: detail.operationCode || '-',
              description: detail.description || '-',
              amount: detail.amount,
              financedPayment: detail.financedPayment,
              fractionatedInitial: detail.fractionatedInitial,
              gpsService: detail.gpsService,
              insurance: detail.insurance
            };
            this.pkgDetail.initialPrice = detail.amount;
            this.paymentForm.get('amount').setValue(detail.amount);
          } else {
            this.paymentScheduleDetail = null;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching payment schedule details:', error);
          this.paymentScheduleDetail = null;
          this.isLoading = false;
        }
      })
    );
  }

  private parseDateArray(dateArray: number[] | undefined): string {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 3) return '-';
    const [year, month, day, hours = 0, minutes = 0, seconds = 0] = dateArray;
    const parsedDate = new Date(year, month - 1, day, hours, minutes, seconds);
    return isNaN(parsedDate.getTime()) ? '-' : this.datePipe.transform(parsedDate, "dd/MM/yyyy '|' h:mm a") || '-';
  }

  private formatDate(date: any): string {
    if (!date || !Array.isArray(date) || date.length < 3) return '-';
    const [year, month, day] = date;
    const parsedDate = new Date(year, month - 1, day);
    return isNaN(parsedDate.getTime()) ? '-' : this.datePipe.transform(parsedDate, 'dd/MM/yyyy') || '-';
  }

  get data() {
    return this.paymentScheduleDetail;
  }

  get status() {
    return this.transactionData?.status || 'Por Pagar';
  }

  getFormattedDateTime(): string {
    return this.data?.transactionDateTime || '-';
  }

  getAbsoluteAmount(amount: number | undefined): string {
    if (amount === undefined || amount === null) return '0.00';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(Math.abs(amount));
  }

  getPaymentDate(): string {
    return this.transactionData?.date ? this.formatDate(this.transactionData.date) : '-';
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  onPay(): void {
    this.paying = true;
    this.methodSelected = null;
    this.paymentConfirmedFlag = false;
    this.paymentForm.get('totalNumberPaymentPaid').setValue(0);
    this.paymentForm.get('amount').setValue(this.pkgDetail.initialPrice);
  }

  onCancel(): void {
    if (this.paying) {
      this.paying = false;
      this.methodSelected = null;
      this.paymentConfirmedFlag = false;
    } else {
      this.instanceModal.close();
    }
  }

  onConfirm(): void {
    if (!this.methodSelected) {
      console.log('Por favor, selecciona un método de pago');
      this.dialogService.open(ModalSuccessComponent, {
        header: '',
        data: {
          text: 'Por favor, selecciona un método de pago.',
          title: '¡Alerta!',
          icon: 'assets/icons/Inclub.png'
        }
      });
      return;
    }

    const amount = parseFloat(this.paymentForm.get('amount')?.value);
    const initialPrice = this.pkgDetail?.initialPrice;

    if (!amount || !initialPrice || Math.abs(amount - initialPrice) > 0.01) {
      this.dialogService.open(ModalSuccessComponent, {
        header: '',
        data: {
          text: 'El monto total de los vouchers debe ser exactamente igual al monto a pagar.',
          title: '¡Alerta!',
          icon: 'assets/icons/Inclub.png'
        }
      });
      return;
    }

    this.onMedioPago(this.methodSelected);
  }

  onSubmit(): void {
    const amount = parseFloat(this.paymentForm.get('amount')?.value);
    const initialPrice = this.pkgDetail?.initialPrice;

    if (!amount || !initialPrice || Math.abs(amount - initialPrice) > 0.01) {
      this.dialogService.open(ModalSuccessComponent, {
        header: '',
        data: {
          text: 'El monto total de los vouchers debe ser exactamente igual al monto a pagar.',
          title: '¡Alerta!',
          icon: 'assets/icons/Inclub.png'
        }
      });
      return;
    }

    const exchangeRate = this.exchangeType || 1;
    console.log('Enviando pago:', {
      listMethodPayment: this.listMethodPayment,
      listVochers: this.listVochersToSave,
      exchangeRate
    });
    this.isLoading = true;
    this.paying = false;
    this.confirming = false;
    this.paymentConfirmedFlag = true;

    // Actualizar el PaymentSchedule con el voucher
    if (this.transactionData?.paymentScheduleId && this.listVochersToSave.length > 0) {
      const voucher = this.listVochersToSave[0]; // Tomar el primer voucher
      const updateDto: Partial<PaymentSchedule> = {
        status: 'Pago por Validar',
        paymentVoucher: voucher.imagen instanceof File ? voucher.imagen : voucher.imagen || undefined
      };
      this.subscription.add(
        this.paymentScheduleApiService
          .fetchUpdate(this.transactionData.paymentScheduleId, updateDto)
          .subscribe({
            next: (response) => {
              console.log('PaymentSchedule actualizado con voucher:', response);
              const updatedSchedule: PaymentSchedule = {
                id: this.transactionData!.paymentScheduleId!,
                partnerBonusId: response.data?.partnerBonusId,
                date: this.transactionData!.date || '',
                description: response.data?.description || this.transactionData!.description || '',
                netFinancingInstallmentValue: response.data?.netFinancingInstallmentValue,
                insurance: response.data?.insurance,
                fractionatedInitial: response.data?.fractionatedInitial,
                companyInitial: response.data?.companyInitial,
                gps: response.data?.gps,
                rangeBonus: response.data?.rangeBonus,
                partnerAssumedPayment: response.data?.partnerAssumedPayment,
                status: 'Pago por Validar',
                paymentVoucher: response.data?.paymentVoucher
              };
              this.paymentConfirmed.emit(updatedSchedule);
              this.isLoading = false;
              this.dialogService.open(ModalSuccessComponent, {
                header: '',
                data: {
                  text: 'Tu pago fue registrado con éxito y será verificada. Lo avisaremos y enviaremos toda la información necesaria a su correo electrónico.',
                  title: 'Registro exitoso',
                  icon: 'assets/icons/Inclub.png'
                }
              });
              this.instanceModal.close();
            },
            error: (error) => {
              console.error('Error al actualizar PaymentSchedule con voucher:', error);
              this.isLoading = false;
              this.dialogService.open(ModalSuccessComponent, {
                header: '',
                data: {
                  text: 'Error al registrar el voucher. Por favor, intenta de nuevo.',
                  title: '¡Error!',
                  icon: 'assets/icons/Inclub.png'
                }
              });
            }
          })
      );
    } else {
      setTimeout(() => {
        this.isLoading = false;
        this.instanceModal.close();
        this.dialogService.open(ModalSuccessComponent, {
          header: '',
          data: {
            text: 'Tu pago fue registrado con éxito y será verificada. Lo avisaremos y enviaremos toda la información necesaria a su correo electrónico.',
            title: 'Registro exitoso',
            icon: 'assets/icons/Inclub.png'
          }
        });
      }, 2000); // Simula un tiempo de carga de 2 segundos
    }
  }

  onMedioPago(methodSelected: any): void {
    this.methodSelected = methodSelected;
    console.log('Método de pago seleccionado:', methodSelected.description);

    switch (methodSelected.description) {
      case PaymentType.WALLET:
        this.openModalWallet();
        break;
      case PaymentType.BCP:
        this.openPaymentBank();
        break;
      case PaymentType.INTERBANK:
        this.openPaymentBank();
        break;
      case PaymentType.DAVIVIENDA:
        this.openPaymentBank();
        break;
      case PaymentType.OTROS:
        this.openPaymentBank();
        break;
      case PaymentType.PAYPAL:
        this.onPaypal();
        break;
      default:
        console.warn('Método de pago desconocido:', methodSelected.description);
        this.openPaymentBank();
        break;
    }
  }

  onPaypal(): void {
    const {
      paymentSubTypeList: [value]
    } = this.methodSelected;

    const paypalCurrencies = this.operationCurrency.filter(
      (currency) => [CurrencyType.DOLARES, CurrencyType.SOLES].includes(currency.value)
    );

    const dataToModal = {
      description: 'Payment Schedule',
      amount: this.getTotalAmountPaid,
      operationCurrency: paypalCurrencies,
      ...this.methodSelected,
      ...value
    };
    this.dialogService
      .open(ModalPaymentPaypalComponent, {
        header: 'Pago con Paypal',
        data: dataToModal
      })
      .onClose.pipe(
        tap((data: IPaypalData) => {
          if (data) {
            this.paypalData.emit(data);
            this.disablePaymentMethods = true;
            this.addPaymentMethod(3);
            this.paymentConfirmedFlag = true;
            this.onSubmit();
          } else {
            this.methodSelected = null;
            this.paymentConfirmedFlag = false;
          }
        })
      )
      .subscribe();
  }

  openModalWallet(voucher = null): void {
    const dolaresCurrency = this.operationCurrency.find(
      (currency) => currency.value === CurrencyType.DOLARES
    );
    if (!dolaresCurrency) {
      console.warn('Moneda en dólares no encontrada');
      this.dialogService.open(ModalSuccessComponent, {
        header: '',
        data: {
          text: 'Moneda en dólares no encontrada.',
          title: '¡Alerta!',
          icon: 'assets/icons/Inclub.png'
        }
      });
      return;
    }

    this.dialogRef = this.dialogService.open(ModalPayFeeComponent, {
      header: 'Mi Wallet',
      width: '35%',
      data: {
        isWallet: true,
        methodSelected: this.methodSelected,
        operationCurrency: [dolaresCurrency],
        totalAmountPaid: this.getTotalAmountPaid,
        voucherToEdit: voucher
      }
    });

    this.dialogRef.onClose.subscribe((data) => {
      if (data) {
        data.currencyDescription = dolaresCurrency.content;
        this.processWalletPayment(data, !!voucher);
      } else {
        this.methodSelected = null;
        this.paymentConfirmedFlag = false;
      }
    });
  }

  private processWalletPayment(data: any, isEditing: boolean): void {
    if (data) {
      const [voucher] = data.listaVouches;
      const totalAmountPaid = this.getTotalAmountPaid;
      if (!voucher.totalAmount || Math.abs(voucher.totalAmount - totalAmountPaid) > 0.01) {
        this.dialogService.open(ModalSuccessComponent, {
          header: '',
          data: {
            text: 'El monto total de los vouchers debe ser exactamente igual al monto a pagar.',
            title: '¡Alerta!',
            icon: 'assets/icons/Inclub.png'
          }
        });
        this.methodSelected = null;
        this.paymentConfirmedFlag = false;
        return;
      }

      const walletVoucher = {
        ...voucher,
        paymentMethod: 'wallet',
        bankName: 'Wallet',
        totalAmount: voucher.totalAmount,
        methodSelected: this.methodSelected
      };

      if (isEditing && this.indexEdit !== null && this.indexEdit !== undefined) {
        this.listVochersToSave[this.indexEdit] = {
          ...this.listVochersToSave[this.indexEdit],
          ...walletVoucher
        };
      } else {
        this.listVochersToSave.push(walletVoucher);
      }
      this.listVochersToSave = [...this.listVochersToSave];
      this.cdr.detectChanges();
      this.addPaymentMethod(4);
      this.paymentConfirmedFlag = true;
      this.onSubmit();
    }
  }

  openPaymentBank(): void {
    const listCurrencies = this.operationCurrency.filter((currency) =>
      [CurrencyType.DOLARES, CurrencyType.SOLES].includes(currency.value)
    );
    if (!listCurrencies.length) {
      console.warn('Monedas (Dólares o Soles) no encontradas para el país seleccionado:', this.residenceContry);
      this.dialogService.open(ModalSuccessComponent, {
        header: '',
        data: {
          text: 'No hay monedas (dólares o soles) disponibles.',
          title: '¡Alerta!',
          icon: 'assets/icons/Inclub.png'
        }
      });
      return;
    }

    this.dialogService
      .open(ModalPaymentBankContainer, {
        header: `Pago en efectivo a través de ${this.voucherToEdit?.methodSelected?.description || this.methodSelected?.description}`,
        data: {
          methodSelected: this.voucherToEdit?.methodSelected || this.methodSelected,
          exchangeType: this.exchangeType,
          operationCurrency: listCurrencies,
          totalAmountPaid: this.getTotalAmountPaid,
          voucherToEdit: this.voucherToEdit,
          indexEdit: this.indexEdit
        },
        styleClass: 'custom-modal-css',
        width: '40%'
      })
      .onClose.subscribe((data) => {
        if (data && data.listaVouches && data.listaVouches.length > 0) {
          const totalAmountPaid = this.getTotalAmountPaid;
          const isCashPayment = [PaymentType.BCP, PaymentType.INTERBANK, PaymentType.DAVIVIENDA, PaymentType.OTROS].includes(this.methodSelected.description);

          if (isCashPayment) {
            const totalVouchersAmount = data.listaVouches.reduce((sum: number, voucher: any) => sum + (voucher.totalAmount), 0);
            if (!totalVouchersAmount || Math.abs(totalVouchersAmount - totalAmountPaid) > 0.01) {
              this.dialogService.open(ModalSuccessComponent, {
                header: '',
                data: {
                  text: 'El monto total de los vouchers debe ser exactamente igual al monto a pagar.',
                  title: '¡Alerta!',
                  icon: 'assets/icons/Inclub.png'
                }
              });
              this.methodSelected = null;
              this.paymentConfirmedFlag = false;
              return;
            }
          }

          if (data.indexEdit !== null && data.indexEdit !== undefined) {
            const updatedVouchers = data.listaVouches.map((voucher: any) => ({
              ...voucher,
              methodSelected:
                voucher.methodSelected ||
                this.listVochersToSave[data.indexEdit]?.methodSelected ||
                this.methodSelected
            }));
            this.listVochersToSave.splice(data.indexEdit, 1, ...updatedVouchers);
          } else {
            const newVouchers = data.listaVouches.map((voucher: any) => ({
              ...voucher,
              methodSelected: voucher.methodSelected || this.methodSelected
            }));
            this.listVochersToSave.push(...newVouchers);
          }
          this.addPaymentMethod(2);
          this.paymentConfirmedFlag = true;
          this.onSubmit();
        } else {
          this.methodSelected = null;
          this.paymentConfirmedFlag = false;
        }
      });
  }

  private addPaymentMethod(paymentType: number): void {
    if (!this.listMethodPayment.includes(paymentType)) {
      this.listMethodPayment.push(paymentType);
    }
  }

  ensureNotEmpty(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value === '') {
      input.value = '0';
    }
    if (/^0\d+/.test(input.value)) {
      input.value = '0';
    }
  }

  get getTotalAmountPaid(): number {
    const totalAmountPaid =
      parseFloat(this.paymentForm.get('amount').value) +
      parseFloat(this.getAmountPaid);
    return totalAmountPaid || 0;
  }

  get getAmountPaid(): string {
    let value = this.paymentForm.get('totalNumberPaymentPaid').value;
    if (value > this.pkgDetail.numberQuotas) {
      value = this.pkgDetail.numberQuotas;
      this.paymentForm.get('totalNumberPaymentPaid').setValue(value);
    }
    const amountPaid = ((this.pkgDetail.price - (this.pkgDetail.initialPrice || 0)) / this.pkgDetail.numberQuotas * value).toFixed(2);
    return amountPaid;
  }

  extractPaymentDescription(description: string | undefined, includePrefix: boolean = false, montoPrefix: boolean = false): string {
    if (!description) return '-';
    const initialMatch = description.match(/Inicial Fraccionada (\d+)/i);
    if (initialMatch) return includePrefix ? `Pago tu ${initialMatch[0]}` : montoPrefix ? `Pago de ${initialMatch[0]}` : initialMatch[0];
    const quotaMatch = description.match(/Cuota Nº (\d+)/i);
    if (quotaMatch) return includePrefix ? `Pago tu ${quotaMatch[0]}` : montoPrefix ? `Pago de ${quotaMatch[0]}` : quotaMatch[0];
    return includePrefix ? `Pago tu ${description}` : montoPrefix ? `Pago de ${description}` : description || '-';
  }

  isFutureMonthPayment(): boolean {
    const today = new Date();
    const paymentDate = this.transactionData?.date ? new Date(this.transactionData.date[0], this.transactionData.date[1] - 1, this.transactionData.date[2]) : null;
    if (!paymentDate) return false;
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = diffTime / (1000 * 3600 * 24);
    return diffDays > 30;
  }
}
