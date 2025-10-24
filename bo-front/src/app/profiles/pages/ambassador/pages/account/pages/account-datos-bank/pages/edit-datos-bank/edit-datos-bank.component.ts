import { CommonModule } from '@angular/common';
import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { AccountTypeOptMock, BankNameOptMock, TypeAccountBankOptMock } from '../../../account-bank-data-tab/commons/modals/account-edit-bank-data-modal/_mock';
import { NewPartnerService } from '../../../../../new-partner/commons/services/new-partner.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { NewPartnerGeneralInfoService } from '../../../../../new-partner/pages/new-partner-general-info/commons/services/new-partner-general-info.service';
import { ISelect } from '@shared/interfaces/forms-control';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountBankRequest, AccountDataRequest, BankRequest, OwnerDataRequest } from '../../commons/interface/accountBankRequest';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VerifyDataComponent } from '../../commons/modals/verify-data/verify-data.component';
import { AccountDatosBankServiceService } from '../../../../commons/services/account-datos-bank-service.service';
import { ModalCambiosRegistrationComponent } from '../../commons/modals/modal-cambios-registration/modal-cambios-registration.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { WalletService } from '../../../../../wallet/commons/services/wallet.service';
import { CodeVerificationComponent } from '../../commons/modals/code-verification/code-verification.component';

@Component({
  selector: 'app-edit-datos-bank',
  standalone: true,
  providers: [DialogService, DynamicDialogRef, MessageService],
  imports: [ToastModule, CommonModule, ReactiveFormsModule,
    InputComponent, SelectComponent, RadiosComponent],
  templateUrl: './edit-datos-bank.component.html',
  styleUrl: './edit-datos-bank.component.scss'
})
export class EditDatosBankComponent {
  public form: FormGroup;
  public disabledUser: boolean = this.userInfoService.disabled;
  isLoading = false
  @ViewChildren('detalle') detalles!: QueryList<ElementRef>;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private newPartnerService: NewPartnerService,
    private newPartnerGeneralInfoService: NewPartnerGeneralInfoService,
    private accountDatosBankServiceService: AccountDatosBankServiceService,
    public userInfoService: UserInfoService,
    public router: Router,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private messageService: MessageService,
    private walletService: WalletService,


  ) { }
  public form1: FormGroup;
  public form2: FormGroup;
  public form3: FormGroup;
  nationalitiesList: any[] = [];
  public documentTypes: ISelect[];
  public countryIdBank: ISelect[];
  public accountTypeOpt: ISelect[];
  public tipUsuario = TypeAccountBankOptMock;
  dataAccountBankRequest: AccountBankRequest;
  dataBankRequest: BankRequest;
  dataAccountDataRequest: AccountDataRequest;
  dataOwnerDataRequest: OwnerDataRequest;
  public bankNameOpt = BankNameOptMock;
  data: any
  dialogRef: DynamicDialogRef;

  ngOnInit(): void {
    this.data = JSON.parse(localStorage.getItem('bank'));
    console.log('Datos recibidos:', this.data);
    this.initService();
    this.initForm()
  }
  initService() {
    this.getNationalities()
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
  initForm() {
    /////////////PASO 1////////////////
    this.form1 = this.formBuilder.group({
      paisOpe: [this.data['idCountry'], [Validators.required]],
      nameBank: [this.data['idBank'], [Validators.required]],
      directBank: [this.data['bankAddress']],
      switf: [this.data['codeSwift']],
      iban: [this.data['codeIban']],
    });
    /////////////PASO 2////////////////
    this.form2 = this.formBuilder.group({
      tipCuenta: [this.data['idTypeAccountBank'], [Validators.required]],
      numCuenta: [this.data['numberAccount'], [Validators.required]],
      cci: [this.data['cci'], [Validators.required]],
    })
    /////////////PASO 3////////////////
    console.log(this.data);

    this.form3 = this.formBuilder.group({
      title: [this.data['titular'] == true ? 1 : 2, [Validators.required]],
      nameHoler: [{ value: this.data['nameHolder'], disabled: true }, [Validators.required]],
      lastNameHolder: [{ value: this.data['lastNameHolder'], disabled: true }, [Validators.required]],
      typeDoc: [{ value: this.data['idDocumentType'], disabled: true }, [Validators.required]],
      numDoc: [{ value: this.data['numDocument'], disabled: true }, [Validators.required]],
      email: [{ value: this.data['email'], disabled: true }, [Validators.required, Validators.email]],
      numContri: [{ value: this.data['numberContribuyente'], disabled: true }],
      razonSocial: [{ value: this.data['razonSocial'], disabled: true }],
      direccionFiscal: [{ value: this.data['addressFiscal'], disabled: true }],

    })
    this.onChangeTypeBank(this.form3.get('title').value)

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  toggleDetalle(event: Event, index: number) {
    // Verifica si el clic provino directamente del header (no del contenido)
    const target = event.target as HTMLElement;
    const isHeaderClick = target.closest('.operacion-header') ||
      target.classList.contains('number-count') ||
      target.classList.contains('datos-bank') ||
      target.classList.contains('update-form') ||
      target.classList.contains('chevron-icon');

    if (!isHeaderClick) {
      return; // Ignora clics en el contenido
    }

    event.stopPropagation();
    const item = (event.currentTarget as HTMLElement).closest('.operacion-item');
    const detalle = this.detalles.toArray()[index].nativeElement;

    item?.classList.toggle('abierto');
    detalle.classList.toggle('abierto');

    const chevron = item?.querySelector('.chevron-icon');
    chevron?.classList.toggle('rotated');
  }

  validNextOne() {
    const paso1Controls = ['nameBank'];
    paso1Controls.forEach(controlName => {
      this.form1.get(controlName)?.markAsTouched();
    });
    const isPaso1Valid = paso1Controls.every(controlName => {
      const control = this.form1.get(controlName);
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
    this.router.navigate(['../'], { relativeTo: this.route });
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
      //this.form3.reset()
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
  validarPasos() {
    const isPaso1Valid = this.validNextOne();
    const isPaso2Valid = this.validNextTwo();
    const isPaso3Valid = this.validNextThere();
    if (!isPaso1Valid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: "Completa todos los campos de los Datos del banco",
        life: 3000
      });
      return false;

    }
    else if (!isPaso2Valid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: "Completa todos los campos de los Datos de la cuenta bancaria",
        life: 3000
      });
      return false;
    }
    else if (!isPaso3Valid) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: "Completa todos los campos de los Datos del titular",
        life: 3000
      });
      return false;
    } else {
      return true
    }

  }
  onNextStep() {
    if (this.validarPasos()) {
      if (this.form3.get('email').value == this.data['email']) {
        this.openModal();
      }
      else {
        this.isLoading = true;
        this.walletService
          .postGenerateTokenGestionBancaria(this.userInfoService.userInfo.id)
          .subscribe({
            next: (value) => {
              this.isLoading = false;
              if (value.data === true) {
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
        this.openModal()
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
  openModal() {
    this.dialogRef = this.dialogService.open(VerifyDataComponent, {
      header: '',
      data: {
        icon: "assets/wallet/warnning-icon.svg",
        title: '¿Estas seguro de guardar los cambios?',
        descripcion: "Recuerda que al confirmar, estos cambios se actualizará <br>" + "\n" +
          "en el sistema.",
      }
    });
    this.dialogRef.onClose.subscribe((resultado: boolean) => {
      if (resultado === true) {
        this.objectoUpdateBank()
      }

    });
  }
  objectoUpdateBank() {
    this.isLoading = true
    this.dataBankRequest = {
      idBank: this.form1.get('nameBank').value,
      idCountry: this.form1.get('paisOpe').value,
      bankAddress: this.form1.get('directBank').value ?? '',
      codeSwift: this.form1.get('switf').value ?? '',
      codeIban: this.form1.get('iban').value ?? ''
    }
    this.dataAccountDataRequest = {
      numberAccount: this.form2.get('numCuenta').value,
      cci: this.form2.get('cci').value,
      idTypeAccountBank: this.form2.get('tipCuenta').value
    }
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
    console.log("paso1 ", this.dataBankRequest);
    console.log("paso2 ", this.dataAccountDataRequest);
    console.log("paso3 ", this.dataOwnerDataRequest);
    console.log("final object", this.dataAccountBankRequest);
    this.accountDatosBankServiceService.updateSaveGestion(
      this.dataAccountBankRequest, this.data.idAccountBank)
      .subscribe(
        (ele: any) => {
          if (ele['result'] == true) {
            this.openModalRegistration();
          } else {
            this.messageService.add({
              severity: 'info',
              summary: 'Info',
              detail: "Ha Ocurrido un error, Vuelve a Intentarlo",
              life: 3000
            });
            this.isLoading = false;
          }
        });
  }
  openModalRegistration() {
    this.dialogRef = this.dialogService.open(ModalCambiosRegistrationComponent, {});
    this.dialogRef.onClose.subscribe(() => {
      this.isLoading = false
      localStorage.removeItem("bank");
      return this.router.navigate(['/profile/ambassador/account/datos-bancarios']);

    });
  }
}
