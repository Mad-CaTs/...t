import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { VerifyDataComponent } from '../../commons/modals/verify-data/verify-data.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { NewPartnerService } from '../../../../../new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { ConfirmationBankComponent } from '../../commons/modals/confirmation-bank/confirmation-bank.component';
import { AccountDatosBankServiceService } from '../../../../commons/services/account-datos-bank-service.service';
import { NewPartnerGeneralInfoService } from '../../../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { AccountTypeOptMock, BankNameOptMock, TypeAccountBankOptMock } from '../../../account-bank-data-tab/commons/modals/account-edit-bank-data-modal/_mock';
import { AccountBankRequest, AccountDataRequest, BankRequest, OwnerDataRequest } from '../../commons/interface/accountBankRequest';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { CodeVerificationComponent } from '../../commons/modals/code-verification/code-verification.component';
import { WalletService } from '../../../../../wallet/commons/services/wallet.service';

@Component({
  selector: 'app-add-datos-bank',
  standalone: true,
  providers: [DialogService, DynamicDialogRef, MessageService],
  imports: [ToastModule, CommonModule, ReactiveFormsModule,
    InputComponent, SelectComponent, RadiosComponent],
  templateUrl: './add-datos-bank.component.html',
  styleUrl: './add-datos-bank.component.scss'
})
export class AddDatosBankComponent {
  public form1: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;

  isLoading = true;
  public documentTypes: ISelect[];
  public countryIdBank: ISelect[];
  public accountTypeOpt: ISelect[];
  public tipUsuario = TypeAccountBankOptMock;
  public step = 1;
  public btnBack = "Volver";
  public disabledUser: boolean = this.userInfoService.disabled;
  dialogRef: DynamicDialogRef;
  nationalitiesList: any[] = [];
  private destroy$: Subject<void> = new Subject<void>();
  dataAccountBankRequest: AccountBankRequest;
  dataBankRequest: BankRequest;
  dataAccountDataRequest: AccountDataRequest;
  dataOwnerDataRequest: OwnerDataRequest;
  constructor(
    private newPartnerService: NewPartnerService,
    public router: Router,
    private accountDatosBankServiceService: AccountDatosBankServiceService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private route: ActivatedRoute,
    public userInfoService: UserInfoService,
    public ref: DynamicDialogRef,
    private messageService: MessageService,
    private walletService: WalletService,
    private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
  ) { }

  ngOnInit(): void {
    this.initService();
    this.initForm()
  }
  initService() {
    this.getNationalities()
  }
  initForm() {
    /////////////PASO 1////////////////
    this.form1 = this.formBuilder.group({
      paisOpe: ['', [Validators.required]],
      nameBank: ['', [Validators.required]],
      directBank: [''],
      switf: [''],
      iban: [''],
    });
    /////////////PASO 2////////////////
    this.form2 = this.formBuilder.group({
      tipCuenta: ['', [Validators.required]],
      numCuenta: ['', [Validators.required]],
      cci: ['', [Validators.required]],
    })
    /////////////PASO 3////////////////
    this.form3 = this.formBuilder.group({
      title: ['', [Validators.required]],
      nameHoler: [{ value: '', disabled: true }, [Validators.required]],
      lastNameHolder: [{ value: '', disabled: true }, [Validators.required]],
      typeDoc: [{ value: '', disabled: true }, [Validators.required]],
      numDoc: [{ value: '', disabled: true }, [Validators.required]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      numContri: [{ value: '', disabled: true }],
      razonSocial: [{ value: '', disabled: true }],
      direccionFiscal: [{ value: '', disabled: true }],

    })
    console.log(this.tipUsuario);

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  getNationalities() {
    this.isLoading = false;
    this.newPartnerService
      .getCountriesList()
      .pipe(
        takeUntil(this.destroy$),
        tap((paises) => {
          this.nationalitiesList = paises
          console.log('pais de operacion :', this.nationalitiesList);

          const idCountry = this.nationalitiesList.find(p => p.idCountry == 167)
          this.form1.patchValue({
            paisOpe: idCountry.idCountry
          })
          this.getByIdCountryBank();
          this.getTypeBank()
          this.getDocumentType({ idCountry: idCountry.idCountry })
        }
          //    (this.nationalitiesList = paises)
        )
      )
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
  getByIdCountryBank() {
    this.accountDatosBankServiceService.findAllByIdCountry().pipe(
      takeUntil(this.destroy$),
      tap((country) => {
        this.countryIdBank = country['data'].map(item => ({
          value: item.idBank,
          content: item.name
        }));
        console.log('Paises:', this.countryIdBank);
      })
    )
      .subscribe();

  }
  getTypeBank() {
    this.accountDatosBankServiceService.getTypeAccountBank().pipe(
      takeUntil(this.destroy$),
      tap((country) => {
        this.accountTypeOpt = country['data'].map(item => ({
          value: item.idTypeAccountBank,
          content: item.name
        }));
        console.log('Type Account Bank:', this.accountTypeOpt);
      })
    )
      .subscribe();
  }
  get title() {
    if (this.step === 1) return 'Datos del banco';
    if (this.step === 2) return 'Datos de la cuenta bancaria';

    return 'Datos del titular';
  }

  get btnText() {
    if (this.step === 1) return 'Siguiente';
    if (this.step === 2) return 'Siguiente';

    return 'Siguiente';
  }
  validNextOne() {
    const paso1Controls = ['nameBank'];
    paso1Controls.forEach(controlName => {
      this.form1.get(controlName)?.markAsTouched();
    });
    const isPaso1Valid = paso1Controls.every(controlName => {
      const control = this.form1.get(controlName);
      if (controlName === 'nameBank' && !control?.value) {
        return false;
      }
      return control?.valid;
    });

    return isPaso1Valid;
  }
  validNextTwo() {
    const paso2Controls = ['tipCuenta', 'numCuenta', 'cci'];
    paso2Controls.forEach(controlName => {
      this.form2.get(controlName)?.markAsTouched();
    });
    const isPaso2Valid = paso2Controls.every(controlName => {
      const control = this.form2.get(controlName);
      return control?.valid;
    });

    return isPaso2Valid;
  }
  validNextThere() {
    let title = this.form3.get('title').value;
    let paso3Controls
    if (title == 1) {
      paso3Controls = [
        'title',
        'nameHoler',
        'lastNameHolder',
        'typeDoc',
        'numDoc',
        'email',
      ];
    } else {
      paso3Controls = [
        'title',
        'nameHoler',
        'lastNameHolder',
        'typeDoc',
        'numDoc',
        'email',
        'numContri',
        'razonSocial',
        'direccionFiscal'
      ];
    }

    paso3Controls.forEach(controlName => {
      this.form3.get(controlName)?.markAsTouched();
    });
    const isPaso3Valid = paso3Controls.every(controlName => {
      const control = this.form3.get(controlName);
      return control?.valid;
    });

    return isPaso3Valid;
  }
  onPreviousStep() {
    if (this.step == 1) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
    if (this.step > 1) {
      this.step--;
    }
  }
  onNextStep() {
    if (this.step === 1) {
      const isPaso1Valid = this.validNextOne();
      if (!isPaso1Valid) {
        return this.viewMsgToast("Completa todos los campos")
      };

      this.dataBankRequest = {
        idBank: this.form1.get('nameBank').value,
        idCountry: this.form1.get('paisOpe').value,
        bankAddress: this.form1.get('directBank').value ?? '',
        codeSwift: this.form1.get('switf').value ?? '',
        codeIban: this.form1.get('iban').value ?? ''
      }
      console.log(this.dataBankRequest);

      this.dialogRef = this.dialogService.open(VerifyDataComponent, {
        header: '',
        data: {
          icon: "assets/wallet/eye-icon.svg",
          title: 'Verifica tus datos',
          descripcion: "¿Esta seguro que el país de operaciones, el nombre del <br>" + "\n" +
            "banco y el tipo de cuenta es correcto?.Ten en cuenta <br>" + "\n" +
            "que después no será posible editar.",
        }
      });
      this.dialogRef.onClose.subscribe((resultado: boolean) => {
        if (resultado === true) {
          this.step++;
        }
      });
    } else if (this.step == 2) {
      const isPaso2Valid = this.validNextTwo();
      if (!isPaso2Valid) {
        return this.viewMsgToast("Completa todos los campos")
      }
      this.dataAccountDataRequest = {
        numberAccount: this.form2.get('numCuenta').value,
        cci: this.form2.get('cci').value,
        idTypeAccountBank: this.form2.get('tipCuenta').value
      }
      console.log(this.dataAccountDataRequest);

      this.step++;

    }
    else if (this.step === 3) {
      const isPaso3Valid = this.validNextThere();
      if (!isPaso3Valid) {
        return this.viewMsgToast("Completa todos los campos")
      } else {
        this.isLoading = true;
        return this.walletService
          .postGenerateTokenGestionBancaria(this.userInfoService.userInfo.id)
          .subscribe({
            next: (value) => {
              this.isLoading = false;
              if (value.result === true) {
                this.openCodeVerification();
              } else {
                this.viewMsgToast("El código de verificación no se ha generado, vuelve a intentarlo");
              }
            },
            error: (err) => {
              this.isLoading = false;
              this.viewMsgToast("El código de verificación no se ha generado, vuelve a intentarlo");
            }
          });

      }
    }
  }

  openCodeVerification() {
    this.dialogRef = this.dialogService.open(CodeVerificationComponent, {
      data: {
        email: this.userInfoService.userInfo.email
      }
    });
    this.dialogRef.onClose.subscribe((resultado: boolean) => {
      if (resultado === true) {
        this.dataOwnerDataRequest = {
          nameTitular: this.form3.get('nameHoler').value,
          apellidoTitular: this.form3.get('lastNameHolder').value,
          numberContribuyente: this.form3.get('numContri').value ?? '',
          razonSocial: this.form3.get('razonSocial').value ?? '',
          addressFiscal: this.form3.get('direccionFiscal').value ?? '',
          email: this.form3.get('email').value,
          idDocumentType: this.form3.get('typeDoc').value,
          numDocument: this.form3.get('numDoc').value,
          titular: this.form3.get('title').value == 1 ? true : false,
          idUser: this.userInfoService.userInfo.id
        }
        this.dataAccountBankRequest = {
          bank: this.dataBankRequest,
          accountData: this.dataAccountDataRequest,
          ownerData: this.dataOwnerDataRequest
        }
        console.log(this.dataAccountBankRequest);
        this.isLoading = true;
        this.accountDatosBankServiceService.postSaveGestion(this.dataAccountBankRequest).subscribe(
          (ele: any) => {
            if (ele.body['result'] == true) {
              this.dialogRef = this.dialogService.open(ConfirmationBankComponent, {
                header: '',
                data: {}
              });
              this.dialogRef.onClose.subscribe((resultado: boolean) => {
                return this.redirectDatosBank();
              });
            }
            else {
              this.isLoading = false;
              this.viewMsgToast(ele.body['data'])
            }
          }
        )

      }
    })
  }
  viewMsgToast(msg: string) {
    return this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: msg,
      life: 3000
    });
  }
  redirectCuenta() {
    return this.router.navigate(['/profile/ambassador/account/account-data']);
  }
  redirectDatosBank() {
    return this.router.navigate(['/profile/ambassador/account/datos-bancarios']);
  }
  onChangeTypeBank(value: any) {
    let user = this.userInfoService.userInfo
    this.form3.get('nameHoler').enable();
    this.form3.get('lastNameHolder').enable();
    this.form3.get('typeDoc').enable();
    this.form3.get('numDoc').enable();
    this.form3.get('email').enable();
    if (value == 1) {
      this.form3.patchValue({
        title: 1,
        nameHoler: user.name,
        lastNameHolder: user.lastName,
        typeDoc: user.idTypeDocument,
        numDoc: user.documentNumber,
        email: user.email,
      })
      this.form3.get('numContri').disable();
      this.form3.get('razonSocial').disable();
      this.form3.get('direccionFiscal').disable();

      ['numContri', 'razonSocial', 'direccionFiscal'].forEach(field => {
        this.form3.get(field)?.disable();
        this.form3.get(field)?.clearValidators();
        this.form3.get(field)?.updateValueAndValidity();
      });
    }
    else {
      const currentTitle = this.form3.get('title')?.value;
      this.form3.reset()
      this.form3.get('title')?.setValue(currentTitle)
      this.form3.get('numContri').enable();
      this.form3.get('razonSocial').enable();
      this.form3.get('email').enable();
      ['numContri', 'razonSocial', 'direccionFiscal'].forEach(field => {
        this.form3.get(field)?.enable();
        this.form3.get(field)?.setValidators([Validators.required]);
        this.form3.get(field)?.updateValueAndValidity();
      });
    }

  }
}
