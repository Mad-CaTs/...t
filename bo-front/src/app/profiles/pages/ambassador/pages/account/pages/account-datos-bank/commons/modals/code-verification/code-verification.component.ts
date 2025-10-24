import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@shared/components/form-control/input/input.component';
import RadiosComponent from '@shared/components/form-control/radios/radios.component';
import { SelectComponent } from '@shared/components/form-control/select/select.component';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { UserInfoService } from 'src/app/profiles/commons/services/user-info/user-info.service';
import { WalletService } from 'src/app/profiles/pages/ambassador/pages/wallet/commons/services/wallet.service';

@Component({
  selector: 'app-code-verification',
  standalone: true,
  providers: [MessageService],
  imports: [ToastModule, CommonModule, ReactiveFormsModule,
    InputComponent, SelectComponent, RadiosComponent],
  templateUrl: './code-verification.component.html',
  styleUrl: './code-verification.component.scss'
})
export class CodeVerificationComponent {
  public form1: FormGroup;
  isLoading: boolean = false;
  constructor(public ref: DynamicDialogRef,
    private formBuilder: FormBuilder,
    public config: DynamicDialogConfig,
    private messageService: MessageService,
    private walletService: WalletService,
    public userInfoService: UserInfoService,

  ) { }
  email: string;
  timeLeft = 900; // 15 minutos en segundos
  interval: any;
  incorrecto: boolean = false;
  ngOnInit() {
    this.initForm()
    let { email } = this.config.data
    this.email = email;
    console.log(this.email);
    this.startTimer();
  }
  initForm() {
    this.form1 = this.formBuilder.group({
      token: ['', [Validators.required]],
    });

  }
  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }
  get minutes() {
    return Math.floor(this.timeLeft / 60);
  }

  get seconds() {
    return this.timeLeft % 60;
  }
  closeModal() {
    this.ref.close();
  }
  next() {
    if (this.form1.invalid) {
      this.incorrecto = false
    } else {
      let tokenBanc = {
        idUser: this.userInfoService.userInfo.id,
        codeToken: this.form1.get('token').value
      }
      this.walletService.verifyValidityTokenGestionBancario(tokenBanc)
        .subscribe({
          next: (value) => {
            console.log(value);
            if (value == null) {
              this.incorrecto = true;
            }
            else if (value?.result === true) {
              this.incorrecto = false
              this.ref.close(true);
            }
            else {
              this.incorrecto = true

            }
          },
          error: (err) => {
            this.incorrecto = true

          }
        });
    }
  }
  reenviarCode() {
    this.isLoading = true
    this.walletService
      .postGenerateTokenGestionBancaria(this.userInfoService.userInfo.id)
      .subscribe({
        next: (value) => {
          this.timeLeft = 900;
          this.startTimer()
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.viewMsgToast("El código de verificación no se ha generado, vuelve a intentarlo");
        }
      });
  }
  viewMsgToast(msg: string) {
    return this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: msg,
      life: 3000
    });
  }
  viewToken() {
    const token = this.form1.get('token').value;
    if (token == "") {
      this.incorrecto = false;
    }

  }
}
