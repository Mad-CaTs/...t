import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalSuccessComponent } from 'src/app/profiles/commons/modals/modal-success/modal-success.component';
import { ModalAclaracionComponent } from '../../modals/modal-aclaracion/modal-aclaracion.component';
import { ModalAlertComponent } from 'src/app/profiles/commons/modals/modal-alert/modal-alert.component';
import { ModalRetiroProcesoComponent } from '../../modals/modal-retiro-proceso/modal-retiro-proceso.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, tap } from 'rxjs';
import { NewPartnerService } from '../../../../new-partner/commons/services/new-partner.service';
import { AccountDatosBankServiceService } from '../../../../account/commons/services/account-datos-bank-service.service';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { NewPartnerGeneralInfoService } from '../../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ModalPaymentService } from '../../../../new-partner/pages/new-partner-payment/commons/sevices/modal-payment.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RetiroBancariaService } from '../../../../account/commons/services/retiro-bancaria.service';
import { RetiroBankRequest } from '../../../../account/pages/account-datos-bank/commons/interface/retiroBankRequest';
import { WalletService } from '../../services/wallet.service';

@Component({
  selector: 'app-retiro-bancaria',
  standalone: true,
  providers: [DialogService, DynamicDialogRef, MessageService],
  imports: [ToastModule, CommonModule, SelectComponent,
    ReactiveFormsModule, InputComponent],
  templateUrl: './retiro-bancaria.component.html',
  styleUrl: './retiro-bancaria.component.scss'
})
export class RetiroBancariaComponent {
  dialogRef: DynamicDialogRef;
  nationalitiesList: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  public documentTypes: ISelect[];

  constructor(private formBuilder: FormBuilder,
    private messageService: MessageService,
    public userInfoService: UserInfoService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef,
    private route: ActivatedRoute,
    public router: Router,
    private newPartnerService: NewPartnerService,
    private accountDatosBankServiceService: AccountDatosBankServiceService,
    private modalPaymentService: ModalPaymentService,
    private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
    private retiroBancariaService: RetiroBancariaService,
    private walletService: WalletService,

  ) { }
  public form: FormGroup;
  retiroBankRequest: RetiroBankRequest
  userInfoId = this.userInfoService.userInfo.id;
  userInfoName = this.userInfoService.userInfo.name;
  userInfoLastName = this.userInfoService.userInfo.lastName;
  monto: any;
  public isLoading: boolean = false;

  ngOnInit(): void {
    this.initService();
    this.initForm()


  }
  initService() {
    this.getNationalities()
    this.getWalletById()
  }
  initForm() {
    this.form = this.formBuilder.group({
      monto: [{ value: '', disabled: false }, [Validators.required, Validators.min(0.01), Validators.max(5000)]],
      pais: [{ value: '', disabled: true }, [Validators.required]],
      cci: ['', [Validators.required]],
      name_bank: [{ value: '', disabled: true }, [Validators.required]],
      tipDoc: [{ value: '', disabled: true }, [Validators.required]],
      numDoc: [{ value: '', disabled: true }, [Validators.required]],
      name_account: [{ value: '', disabled: true }, [Validators.required]],
      lastName_Account: [{ value: '', disabled: true }, [Validators.required]],
    })
  }
  step = 1
  public disabledUser: boolean = false
  get isValidBtn() {
    return true
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getNationalities() {
    this.newPartnerService
      .getCountriesList().pipe(takeUntil(this.destroy$),
        tap((paises) => {
          this.nationalitiesList = paises
          console.log('pais de operacion :', this.nationalitiesList);

          const idCountry = this.nationalitiesList.find(p => p.idCountry == 167)
          this.form.patchValue({
            pais: idCountry.idCountry
          })
          this.getDocumentType({ idCountry: idCountry.idCountry })
          this.getCuentaInterbancaria()
          this.getCurrencyList()
        }
        )
      )
      .subscribe();
  }
  availableBalance: number = 0;
  getWalletById() {
    this.walletService.getWalletById(this.userInfoId).subscribe(
      (response: any) => {
        console.log(response);
        this.availableBalance = response.availableBalance;
      }
    );
  }
  idUser: any
  listAccountBank: any
  getListAccountBank: any
  getCuentaInterbancaria() {
    this.idUser = this.userInfoService.userInfo.id
    this.accountDatosBankServiceService.getAccountBankIdUser(this.idUser).subscribe(list => {
      console.log(list);
      this.getListAccountBank = list['data']
      this.listAccountBank = list['data'].map(item => ({
        value: item.idAccountBank,
        content: item.cci
      }));

    })
  }
  operationCurrency: any;
  private getCurrencyList() {
    this.modalPaymentService
      .getCurrency()
      .pipe(tap((monedas) => (this.operationCurrency = monedas)))
      .subscribe();
  }
  getDocumentType(event: any) {
    this.newPartnerGeneralInfoService
      .getDocumentType(event.idCountry)
      .pipe(
        takeUntil(this.destroy$),
        tap((documentTypes) => {
          this.documentTypes = documentTypes;
          console.log('document type', this.documentTypes);
        })
      )
      .subscribe();
  }
  onChangeAccountBank(dato: any) {
    let { value } = dato;
    let list = this.getListAccountBank.find(ele => ele.idAccountBank == value)
    console.log(list);

    if (list) {
      this.form.get('name_bank').setValue(list['nameBank']);
      this.form.get('tipDoc').setValue(list['idDocumentType']);
      this.form.get('numDoc').setValue(list['numDocument']);
      this.form.get('name_account').setValue(list['nameHolder']);
      this.form.get('lastName_Account').setValue(list['lastNameHolder']);
    }
    else {
      this.form.get('name_bank').setValue("");
      this.form.get('tipDoc').setValue("");
      this.form.get('numDoc').setValue("");
      this.form.get('name_account').setValue("");
      this.form.get('lastName_Account').setValue("");
    }

  }
  validNextOne() {
    const paso1Controls = ['monto', 'pais', 'cci', 'name_bank', 'tipDoc',
      'numDoc', 'name_account', 'lastName_Account'
    ];
    paso1Controls.forEach(controlName => {
      this.form.get(controlName)?.markAsTouched();
    });
    return this.form.valid ||

      (this.form.get('monto')?.valid &&
        this.form.get('cci')?.valid &&
        this.form.get('name_bank')?.value &&
        this.form.get('tipDoc')?.value &&
        this.form.get('numDoc')?.value &&
        this.form.get('name_account')?.value &&
        this.form.get('lastName_Account')?.value);

  }
  nextPaso() {
    console.log(this.availableBalance);
    console.log(this.form.get('monto').value);
    console.log();

    const isPaso1Valid = this.validNextOne();
    if (!isPaso1Valid) {
      return this.mensajeModal();
    };

    if (this.form.get('monto').value > 5000) {
      return this.montoMaximoModal();
    }

    if (this.form.get('monto').value > this.availableBalance) {
      return this.montoMayorModal();
    }
    console.log(this.operationCurrency);
    this.dialogRef = this.dialogService.open(ModalAclaracionComponent, {
    });
    this.dialogRef.onClose.subscribe((resultado: boolean) => {
      if (resultado === true) {
        this.saveRetiroBank()
      }
    })
  }
  mensajeModal() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: "Completa todos los campos",
      life: 3000
    });
  }

  montoMaximoModal() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: "El monto máximo permitido es de $5,000.00",
      life: 3000
    });
  }

  montoMayorModal() {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: "El monto ingresado es mayor a tu saldo actual",
      life: 3000
    });
  }
  saveRetiroBank() {
    this.isLoading = true;
    this.retiroBankRequest = {
      "idUser": this.userInfoId,
      "idCountry": this.form.get('pais').value,
      "idCurrency": 1,
      "idAccountBank": this.form.get('cci').value,
      "money": this.form.get('monto').value.toFixed(2),
      "namePropio": this.userInfoName,
      "lastnamePropio": this.userInfoLastName
    }
    this.retiroBancariaService.posSaveBancario(this.retiroBankRequest).
      subscribe(save => {
        if (save != null) {
          this.isLoading = false;
          this.openModalRetiroProceso()
        }
      }, error => {
        this.isLoading = false;

        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: "Ha Ocurrido un error vuelve a intentarlo",
          life: 3000
        });
      })
  }
  openModalRetiroProceso() {
    this.dialogRef = this.dialogService.open(ModalRetiroProcesoComponent, {
    });
    this.dialogRef.onClose.subscribe(() => {
      this.redirectWallet();
    });
  }
  redirectWallet() {
    this.router.navigate(['../'], { relativeTo: this.route });

  }
}
